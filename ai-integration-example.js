// AI Integration Examples for AI Web Assistant
// This file shows how to integrate with real AI services

class AIIntegration {
    constructor() {
        this.apiKey = null;
        this.service = 'openai'; // 'openai', 'palm', 'claude'
    }

    // Initialize with API key and service
    async init(apiKey, service = 'openai') {
        this.apiKey = apiKey;
        this.service = service;
        
        // Test the connection
        return await this.testConnection();
    }

    // Test AI service connection
    async testConnection() {
        try {
            const response = await this.getAIResponse('Hello', 'Test message');
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Main method to get AI response
    async getAIResponse(question, context) {
        switch (this.service) {
            case 'openai':
                return await this.openAIRequest(question, context);
            case 'palm':
                return await this.googlePalmRequest(question, context);
            case 'claude':
                return await this.anthropicClaudeRequest(question, context);
            default:
                throw new Error('Unsupported AI service');
        }
    }

    // OpenAI GPT Integration
    async openAIRequest(question, context) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI assistant that helps users understand webpage content. Provide clear, helpful, and accurate responses based on the content provided.'
                    },
                    {
                        role: 'user',
                        content: `Webpage Content: ${context}\n\nUser Question: ${question}\n\nPlease provide a helpful response based on the webpage content.`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Google PaLM API Integration
    async googlePalmRequest(question, context) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: {
                    text: `You are an AI assistant that helps users understand webpage content. 

Webpage Content: ${context}

User Question: ${question}

Please provide a helpful response based on the webpage content.`
                },
                temperature: 0.7,
                top_k: 40,
                top_p: 0.95,
                candidate_count: 1
            })
        });

        if (!response.ok) {
            throw new Error(`Google PaLM API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].output;
    }

    // Anthropic Claude API Integration
    async anthropicClaudeRequest(question, context) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-2.1',
                max_tokens: 500,
                messages: [
                    {
                        role: 'user',
                        content: `You are an AI assistant that helps users understand webpage content.

Webpage Content: ${context}

User Question: ${question}

Please provide a helpful response based on the webpage content.`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic Claude API error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Generate specific types of responses
    async generateSummary(context) {
        return await this.getAIResponse('Please provide a concise summary of the main points from this webpage content.', context);
    }

    async generateExplanation(context) {
        return await this.getAIResponse('Please explain the key concepts and ideas presented on this webpage in simple terms.', context);
    }

    async generateQuestions(context) {
        return await this.getAIResponse('Based on this webpage content, generate 3-5 interesting questions that could help someone better understand the topic.', context);
    }

    // Handle different content types
    async analyzeArticle(context) {
        return await this.getAIResponse('Analyze this article and provide insights about the main arguments, evidence, and conclusions.', context);
    }

    async analyzeNews(context) {
        return await this.getAIResponse('Analyze this news article and provide context about the key events, people involved, and implications.', context);
    }

    async analyzeTechnical(context) {
        return await this.getAIResponse('Analyze this technical content and explain the concepts in simple terms for a general audience.', context);
    }
}

// Usage example in popup.js
/*
// Initialize AI integration
const aiIntegration = new AIIntegration();

// In your popup.js, replace the mock AI response with:
async function getRealAIResponse(question, context) {
    try {
        // Get API key from storage
        const result = await chrome.storage.local.get(['apiKey', 'aiService']);
        if (!result.apiKey) {
            throw new Error('API key not configured');
        }

        // Initialize AI integration
        await aiIntegration.init(result.apiKey, result.aiService || 'openai');
        
        // Get AI response
        const response = await aiIntegration.getAIResponse(question, context);
        return response;
    } catch (error) {
        console.error('AI integration error:', error);
        return `Error: ${error.message}. Please check your API configuration.`;
    }
}

// Example usage for quick actions
async function handleQuickAction(action, context) {
    try {
        const response = await aiIntegration[`generate${action.charAt(0).toUpperCase() + action.slice(1)}`](context);
        return response;
    } catch (error) {
        console.error('Quick action error:', error);
        return `Error: ${error.message}`;
    }
}
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIIntegration;
} 