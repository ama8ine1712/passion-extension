// Popup script for AI Web Assistant
class AIWebAssistant {
    constructor() {
        this.currentTab = null;
        this.pageContent = null;
        this.init();
    }

    async init() {
        await this.getCurrentTab();
        await this.loadPageInfo();
        this.setupEventListeners();
        this.loadStoredContent();
    }

    async getCurrentTab() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            this.currentTab = tab;
        } catch (error) {
            console.error('Error getting current tab:', error);
        }
    }

    async loadPageInfo() {
        if (!this.currentTab) return;

        const pageTitle = document.getElementById('page-title');
        const pageUrl = document.getElementById('page-url');

        pageTitle.textContent = this.currentTab.title || 'Unknown Page';
        pageUrl.textContent = this.currentTab.url || 'Unknown URL';
    }

    setupEventListeners() {
        // Ask button
        const askBtn = document.getElementById('ask-btn');
        askBtn.addEventListener('click', () => this.handleAskQuestion());

        // Quick action buttons
        document.getElementById('summarize-btn').addEventListener('click', () => this.handleQuickAction('summarize'));
        document.getElementById('explain-btn').addEventListener('click', () => this.handleQuickAction('explain'));
        document.getElementById('questions-btn').addEventListener('click', () => this.handleQuickAction('questions'));

        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

        // Enter key support for textarea
        const textarea = document.getElementById('user-question');
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleAskQuestion();
            }
        });
    }

    async loadStoredContent() {
        try {
            const result = await chrome.storage.local.get(['pageContent', 'pageUrl']);
            if (result.pageContent && result.pageUrl === this.currentTab?.url) {
                this.pageContent = result.pageContent;
            } else {
                await this.extractPageContent();
            }
        } catch (error) {
            console.error('Error loading stored content:', error);
            await this.extractPageContent();
        }
    }

    async extractPageContent() {
        if (!this.currentTab) return;

        try {
            // Inject content script to extract page content
            const [{ result }] = await chrome.scripting.executeScript({
                target: { tabId: this.currentTab.id },
                function: this.extractContentFromPage
            });

            this.pageContent = result;
            
            // Store the content
            await chrome.storage.local.set({
                pageContent: this.pageContent,
                pageUrl: this.currentTab.url
            });
        } catch (error) {
            console.error('Error extracting page content:', error);
            this.showError('Failed to extract page content. Please refresh the page and try again.');
        }
    }

    extractContentFromPage() {
        // Remove script and style elements
        const scripts = document.querySelectorAll('script, style, nav, footer, header');
        scripts.forEach(el => el.remove());

        // Extract main content
        const mainContent = document.querySelector('main, article, .content, .main, #content, #main') || document.body;
        
        // Get text content
        let text = mainContent.innerText || mainContent.textContent || '';
        
        // Clean up the text
        text = text.replace(/\s+/g, ' ').trim();
        
        // Limit to reasonable size (first 5000 characters)
        if (text.length > 5000) {
            text = text.substring(0, 5000) + '...';
        }

        return {
            title: document.title,
            url: window.location.href,
            content: text,
            metaDescription: document.querySelector('meta[name="description"]')?.content || '',
            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).slice(0, 5)
        };
    }

    async handleAskQuestion() {
        const questionInput = document.getElementById('user-question');
        const question = questionInput.value.trim();

        if (!question) {
            this.showError('Please enter a question.');
            return;
        }

        if (!this.pageContent) {
            await this.extractPageContent();
        }

        this.setLoadingState(true);
        
        try {
            const response = await this.getAIResponse(question);
            this.displayResponse(response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.showError('Failed to get AI response. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleQuickAction(action) {
        if (!this.pageContent) {
            await this.extractPageContent();
        }

        this.setLoadingState(true);

        let prompt = '';
        switch (action) {
            case 'summarize':
                prompt = 'Please provide a concise summary of the main points from this webpage content.';
                break;
            case 'explain':
                prompt = 'Please explain the key concepts and ideas presented on this webpage in simple terms.';
                break;
            case 'questions':
                prompt = 'Based on this webpage content, generate 3-5 interesting questions that could help someone better understand the topic.';
                break;
        }

        try {
            const response = await this.getAIResponse(prompt);
            this.displayResponse(response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.showError('Failed to get AI response. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async getAIResponse(question) {
        // For demo purposes, we'll use a mock AI response
        // In a real implementation, you would call an AI API here
        return this.generateMockAIResponse(question);
    }

    generateMockAIResponse(question) {
        const responses = {
            'summarize': 'This webpage appears to contain information about various topics. The main content includes discussions about technology, current events, and general information. The page provides a comprehensive overview of the subject matter with detailed explanations and examples.',
            'explain': 'The webpage explains several key concepts in an accessible way. It breaks down complex ideas into simpler terms and provides practical examples to help readers understand the material better.',
            'questions': '1. What are the main arguments presented in this content?\n2. How does this information relate to current trends?\n3. What are the practical implications of these concepts?\n4. How might this information be applied in real-world scenarios?\n5. What additional research would help deepen understanding of this topic?'
        };

        // Check if it's a quick action
        for (const [action, response] of Object.entries(responses)) {
            if (question.toLowerCase().includes(action)) {
                return response;
            }
        }

        // Generic response for custom questions
        return `Based on the webpage content, I can help answer your question: "${question}". The page contains relevant information that addresses this topic. For a more detailed analysis, please provide specific aspects you'd like me to focus on.`;
    }

    displayResponse(response) {
        const responseContainer = document.getElementById('response-container');
        const aiResponse = document.getElementById('ai-response');
        
        aiResponse.textContent = response;
        responseContainer.style.display = 'block';
        
        // Scroll to response
        responseContainer.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        const responseContainer = document.getElementById('response-container');
        const aiResponse = document.getElementById('ai-response');
        
        aiResponse.innerHTML = `<div class="error">${message}</div>`;
        responseContainer.style.display = 'block';
    }

    setLoadingState(isLoading) {
        const askBtn = document.getElementById('ask-btn');
        const btnText = askBtn.querySelector('.btn-text');
        const spinner = askBtn.querySelector('.loading-spinner');

        if (isLoading) {
            btnText.style.display = 'none';
            spinner.style.display = 'inline';
            askBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
            askBtn.disabled = false;
        }
    }

    openSettings() {
        // For now, just show a simple alert
        // In a real implementation, you'd open a settings page
        alert('Settings feature coming soon! This would include AI API configuration and other preferences.');
    }
}

// Initialize the extension when popup opens
document.addEventListener('DOMContentLoaded', () => {
    new AIWebAssistant();
}); 