// Content script for AI Web Assistant
// This script runs on web pages to extract content and provide additional functionality

class ContentExtractor {
    constructor() {
        this.init();
    }

    init() {
        // Listen for messages from the popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'extractContent') {
                const content = this.extractPageContent();
                sendResponse(content);
            }
        });

        // Add floating AI assistant button (optional feature)
        this.addFloatingAssistant();
    }

    extractPageContent() {
        try {
            // Remove unwanted elements
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
            
            // Limit to reasonable size (first 8000 characters)
            if (text.length > 8000) {
                text = text.substring(0, 8000) + '...';
            }

            // Extract metadata
            const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
            const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
            
            // Extract headings
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
                .map(h => h.textContent.trim())
                .filter(h => h.length > 0)
                .slice(0, 10);

            // Extract links
            const links = Array.from(document.querySelectorAll('a[href]'))
                .map(a => ({ text: a.textContent.trim(), url: a.href }))
                .filter(link => link.text.length > 0 && link.text.length < 100)
                .slice(0, 20);

            return {
                title: document.title,
                url: window.location.href,
                content: text,
                metaDescription,
                metaKeywords,
                headings,
                links,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error extracting page content:', error);
            return {
                title: document.title,
                url: window.location.href,
                content: document.body.innerText.substring(0, 5000),
                error: 'Failed to extract structured content'
            };
        }
    }

    addFloatingAssistant() {
        // Create floating AI assistant button
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'ai-web-assistant-float';
        floatingBtn.innerHTML = `
            <div class="ai-float-btn" title="AI Web Assistant">
                <span>🤖</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #ai-web-assistant-float {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            }
            
            .ai-float-btn {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                color: white;
                font-size: 24px;
            }
            
            .ai-float-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            
            .ai-float-btn:active {
                transform: scale(0.95);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(floatingBtn);

        // Add click handler
        floatingBtn.addEventListener('click', () => {
            this.openQuickAssistant();
        });
    }

    openQuickAssistant() {
        // Create a modal for quick AI assistance
        const modal = document.createElement('div');
        modal.id = 'ai-quick-assistant-modal';
        modal.innerHTML = `
            <div class="ai-modal-overlay">
                <div class="ai-modal-content">
                    <div class="ai-modal-header">
                        <h3>🤖 AI Web Assistant</h3>
                        <button class="ai-modal-close">&times;</button>
                    </div>
                    <div class="ai-modal-body">
                        <textarea 
                            id="ai-quick-question" 
                            placeholder="Ask me anything about this page..."
                            rows="4"
                        ></textarea>
                        <div class="ai-modal-actions">
                            <button id="ai-quick-ask" class="ai-modal-btn">Ask AI</button>
                            <button id="ai-quick-summarize" class="ai-modal-btn secondary">Summarize</button>
                        </div>
                        <div id="ai-quick-response" class="ai-modal-response" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .ai-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ai-modal-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .ai-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .ai-modal-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .ai-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .ai-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .ai-modal-body {
                padding: 20px;
            }
            
            #ai-quick-question {
                width: 100%;
                padding: 12px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 14px;
                font-family: inherit;
                resize: vertical;
                margin-bottom: 15px;
            }
            
            #ai-quick-question:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .ai-modal-actions {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .ai-modal-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .ai-modal-btn:not(.secondary) {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .ai-modal-btn.secondary {
                background: #f8f9fa;
                color: #495057;
                border: 1px solid #dee2e6;
            }
            
            .ai-modal-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .ai-modal-response {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
                font-size: 14px;
                line-height: 1.6;
                color: #212529;
            }
        `;

        document.head.appendChild(modalStyle);
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.ai-modal-close');
        const askBtn = modal.querySelector('#ai-quick-ask');
        const summarizeBtn = modal.querySelector('#ai-quick-summarize');
        const questionInput = modal.querySelector('#ai-quick-question');
        const responseDiv = modal.querySelector('#ai-quick-response');

        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.ai-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
            }
        });

        askBtn.addEventListener('click', () => {
            const question = questionInput.value.trim();
            if (question) {
                this.handleQuickQuestion(question, responseDiv);
            }
        });

        summarizeBtn.addEventListener('click', () => {
            this.handleQuickQuestion('Please summarize this page', responseDiv);
        });

        // Focus on input
        questionInput.focus();
    }

    async handleQuickQuestion(question, responseDiv) {
        responseDiv.innerHTML = '<div style="text-align: center; color: #6c757d;">Thinking...</div>';
        responseDiv.style.display = 'block';

        // Simulate AI response (in real implementation, call AI API)
        setTimeout(() => {
            const content = this.extractPageContent();
            const response = this.generateQuickResponse(question, content);
            responseDiv.innerHTML = response;
        }, 1000);
    }

    generateQuickResponse(question, content) {
        const responses = {
            'summarize': 'This page contains information about various topics. The main content includes discussions about technology, current events, and general information. The page provides a comprehensive overview with detailed explanations.',
            'explain': 'The webpage explains several key concepts in an accessible way. It breaks down complex ideas into simpler terms and provides practical examples to help readers understand the material better.',
            'default': `Based on the page content, I can help with your question: "${question}". The page contains relevant information that addresses this topic. For more specific details, please ask follow-up questions.`
        };

        if (question.toLowerCase().includes('summarize')) {
            return responses.summarize;
        } else if (question.toLowerCase().includes('explain')) {
            return responses.explain;
        } else {
            return responses.default;
        }
    }
}

// Initialize the content extractor
new ContentExtractor(); 