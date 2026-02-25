// Background service worker for AI Web Assistant
// This handles extension lifecycle and communication

class BackgroundService {
    constructor() {
        this.init();
    }

    init() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });

        // Handle messages from content scripts and popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Handle tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        // Set up context menu
        this.setupContextMenu();
    }

    handleInstallation(details) {
        if (details.reason === 'install') {
            console.log('AI Web Assistant installed successfully!');
            
            // Set default settings
            chrome.storage.local.set({
                aiEnabled: true,
                floatingButton: true,
                autoSummarize: false,
                theme: 'default'
            });

            // Open welcome page
            chrome.tabs.create({
                url: chrome.runtime.getURL('welcome.html')
            });
        } else if (details.reason === 'update') {
            console.log('AI Web Assistant updated!');
        }
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'getTabInfo':
                    const tabInfo = await this.getTabInfo(sender.tab?.id);
                    sendResponse(tabInfo);
                    break;

                case 'extractContent':
                    const content = await this.extractContent(sender.tab?.id);
                    sendResponse(content);
                    break;

                case 'getSettings':
                    const settings = await this.getSettings();
                    sendResponse(settings);
                    break;

                case 'updateSettings':
                    await this.updateSettings(request.settings);
                    sendResponse({ success: true });
                    break;

                case 'getAIResponse':
                    const aiResponse = await this.getAIResponse(request.question, request.context);
                    sendResponse(aiResponse);
                    break;

                default:
                    sendResponse({ error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Background service error:', error);
            sendResponse({ error: error.message });
        }
    }

    async getTabInfo(tabId) {
        if (!tabId) return null;

        try {
            const [tab] = await chrome.tabs.get(tabId);
            return {
                id: tab.id,
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl
            };
        } catch (error) {
            console.error('Error getting tab info:', error);
            return null;
        }
    }

    async extractContent(tabId) {
        if (!tabId) return null;

        try {
            const [{ result }] = await chrome.scripting.executeScript({
                target: { tabId },
                function: this.extractPageContent
            });
            return result;
        } catch (error) {
            console.error('Error extracting content:', error);
            return null;
        }
    }

    extractPageContent() {
        // This function runs in the context of the web page
        const unwantedSelectors = [
            'script', 'style', 'nav', 'footer', 'header', 
            '.advertisement', '.ads', '.sidebar', '.navigation',
            '.social-share', '.comments', '.related-posts'
        ];

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.body.innerHTML;

        // Remove unwanted elements
        unwantedSelectors.forEach(selector => {
            const elements = tempDiv.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });

        // Extract main content
        const mainContent = tempDiv.querySelector('main, article, .content, .main, #content, #main') || tempDiv;
        
        // Get text content
        let text = mainContent.innerText || mainContent.textContent || '';
        
        // Clean up the text
        text = text.replace(/\s+/g, ' ').trim();
        
        // Limit to reasonable size
        if (text.length > 8000) {
            text = text.substring(0, 8000) + '...';
        }

        return {
            title: document.title,
            url: window.location.href,
            content: text,
            metaDescription: document.querySelector('meta[name="description"]')?.content || '',
            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).slice(0, 5),
            timestamp: new Date().toISOString()
        };
    }

    async getSettings() {
        try {
            const result = await chrome.storage.local.get([
                'aiEnabled',
                'floatingButton',
                'autoSummarize',
                'theme',
                'apiKey'
            ]);
            return result;
        } catch (error) {
            console.error('Error getting settings:', error);
            return {};
        }
    }

    async updateSettings(newSettings) {
        try {
            await chrome.storage.local.set(newSettings);
            return { success: true };
        } catch (error) {
            console.error('Error updating settings:', error);
            return { success: false, error: error.message };
        }
    }

    async getAIResponse(question, context) {
        // For demo purposes, return a mock response
        // In a real implementation, you would call an AI API here
        return this.generateMockAIResponse(question, context);
    }

    generateMockAIResponse(question, context) {
        const responses = {
            'summarize': 'This webpage contains comprehensive information about various topics. The main content includes detailed discussions about technology trends, current events, and general knowledge. The page provides a thorough overview with practical examples and explanations.',
            'explain': 'The webpage presents complex concepts in an accessible manner. It breaks down technical ideas into simpler terms and provides real-world examples to help readers understand the material more effectively.',
            'questions': '1. What are the key arguments presented in this content?\n2. How does this information relate to current developments?\n3. What are the practical applications of these concepts?\n4. How might this information be used in everyday scenarios?\n5. What additional research would enhance understanding of this topic?'
        };

        // Check for specific action types
        for (const [action, response] of Object.entries(responses)) {
            if (question.toLowerCase().includes(action)) {
                return response;
            }
        }

        // Generic response
        return `Based on the webpage content, I can help answer your question: "${question}". The page contains relevant information that addresses this topic. For more detailed analysis, please specify particular aspects you'd like me to focus on.`;
    }

    handleTabUpdate(tabId, changeInfo, tab) {
        // Handle tab updates if needed
        if (changeInfo.status === 'complete' && tab.url) {
            // Could trigger content extraction or other actions
            console.log('Tab updated:', tab.url);
        }
    }

    setupContextMenu() {
        // Create context menu items
        chrome.contextMenus.create({
            id: 'ai-assistant-summarize',
            title: '🤖 Summarize with AI',
            contexts: ['page']
        });

        chrome.contextMenus.create({
            id: 'ai-assistant-explain',
            title: '💡 Explain with AI',
            contexts: ['page']
        });

        chrome.contextMenus.create({
            id: 'ai-assistant-questions',
            title: '❓ Generate Questions',
            contexts: ['page']
        });

        // Handle context menu clicks
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenuClick(info, tab);
        });
    }

    async handleContextMenuClick(info, tab) {
        let action = '';
        switch (info.menuItemId) {
            case 'ai-assistant-summarize':
                action = 'summarize';
                break;
            case 'ai-assistant-explain':
                action = 'explain';
                break;
            case 'ai-assistant-questions':
                action = 'questions';
                break;
        }

        if (action && tab) {
            // Send message to content script to handle the action
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'contextMenuAction',
                    type: action
                });
            } catch (error) {
                console.error('Error sending context menu action:', error);
            }
        }
    }
}

// Initialize the background service
new BackgroundService(); 