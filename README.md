# 🤖 AI Web Assistant - Chrome Extension

[![Stars](https://img.shields.io/github/stars/ama8ine1712/passion-extension?style=flat&color=70a5fd)](https://github.com/ama8ine1712/passion-extension/stargazers)
[![Issues](https://img.shields.io/github/issues/ama8ine1712/passion-extension?style=flat&color=ff7b72)](https://github.com/ama8ine1712/passion-extension/issues)
![Theme](https://img.shields.io/badge/theme-tokyonight-1a1b27?style=flat)

An intelligent browser extension that reads webpage content and provides AI-powered assistance to help users understand and interact with web pages more effectively.

<p align="center">
  <img src="https://img.shields.io/badge/Chrome%20Extension-JavaScript-1a1b27?logo=googlechrome&logoColor=white" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/Content%20Scripts-Enabled-1a1b27" alt="Content Scripts" />
  <img src="https://img.shields.io/badge/Popup-UI-1a1b27" alt="Popup UI" />
</p>

## ✨ Features

### 🧠 Smart Content Analysis
- Automatically reads and analyzes webpage content
- Extracts key information, headings, and metadata
- Removes ads, navigation, and other non-essential elements
- Provides clean, focused content for AI processing

### 💬 Interactive AI Assistant
- Ask any question about the webpage content
- Get intelligent, contextual answers
- Support for natural language queries
- Real-time AI responses

### ⚡ Quick Actions
- **Summarize**: Get instant summaries of long articles
- **Explain**: Break down complex topics into simple terms
- **Generate Questions**: Create thought-provoking questions about the content

### 🎯 Multiple Access Points
- **Toolbar Icon**: Click the extension icon for the main interface
- **Floating Button**: Quick access AI assistant on any webpage
- **Context Menu**: Right-click on any page for AI actions
- **Keyboard Shortcuts**: Ctrl+Enter to submit questions

### 🎨 Modern UI/UX
- Clean, modern design with gradient backgrounds
- Responsive layout that works on different screen sizes
- Smooth animations and hover effects
- Professional color scheme and typography

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone <repository-url>
   cd ai-web-assistant
   ```

2. **Open Chrome Extensions**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder containing `manifest.json`

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Pin the AI Web Assistant extension

### Method 2: Install from Chrome Web Store (Future)
- Search for "AI Web Assistant" in the Chrome Web Store
- Click "Add to Chrome"
- Follow the installation prompts

## 📖 Usage Guide

### Getting Started

1. **Navigate to any webpage** you want to analyze
2. **Click the AI Web Assistant icon** in your browser toolbar
3. **Ask questions** or use the quick action buttons
4. **Get intelligent responses** based on the page content

### Quick Actions

- **📝 Summarize**: Get a concise summary of the main points
- **💡 Explain**: Understand complex concepts in simple terms
- **❓ Generate Questions**: Get questions to deepen your understanding

### Floating Assistant

- A floating AI button appears on every webpage
- Click it for quick access to AI assistance
- Perfect for on-the-fly questions without opening the main popup

### Context Menu

- Right-click on any webpage
- Select from AI actions:
  - "Summarize with AI"
  - "Explain with AI"
  - "Generate Questions"

## 🛠️ Technical Details

### Architecture

```
AI Web Assistant/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── content.js            # Content script for webpage interaction
├── background.js         # Background service worker
├── welcome.html          # Welcome page for new users
├── icons/                # Extension icons
└── README.md            # This file
```

### Key Components

- **Popup Interface**: Main user interface for AI interactions
- **Content Script**: Extracts webpage content and provides floating assistant
- **Background Service**: Handles extension lifecycle and communication
- **Storage**: Local storage for settings and cached content

### Content Extraction

The extension intelligently extracts webpage content by:

1. **Removing unwanted elements**: ads, navigation, scripts, styles
2. **Focusing on main content**: articles, main sections, content areas
3. **Cleaning text**: removing extra whitespace and formatting
4. **Limiting size**: keeping content manageable for AI processing
5. **Extracting metadata**: titles, descriptions, headings, links

## 🔧 Configuration

### Settings

Access settings through the extension popup:

- **AI Enabled**: Toggle AI functionality on/off
- **Floating Button**: Show/hide the floating AI assistant
- **Auto Summarize**: Automatically summarize pages
- **Theme**: Choose between light and dark themes
- **API Key**: Configure your AI API key (for real AI integration)

### Customization

The extension can be customized by:

- Modifying CSS styles in `popup.css`
- Adjusting content extraction logic in `content.js`
- Adding new AI actions in `popup.js`
- Customizing the floating assistant appearance

## 🤖 AI Integration

### Current Implementation

The extension currently uses mock AI responses for demonstration purposes. To integrate with real AI services:

1. **OpenAI GPT Integration**
   ```javascript
   // In popup.js, replace generateMockAIResponse with:
   async function getAIResponse(question, context) {
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
           method: 'POST',
           headers: {
               'Authorization': `Bearer ${apiKey}`,
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               model: 'gpt-3.5-turbo',
               messages: [
                   {
                       role: 'system',
                       content: 'You are an AI assistant that helps users understand webpage content.'
                   },
                   {
                       role: 'user',
                       content: `Context: ${context}\n\nQuestion: ${question}`
                   }
               ]
           })
       });
       return response.json();
   }
   ```

2. **Other AI Services**
   - Google PaLM API
   - Anthropic Claude API
   - Local AI models (Ollama, etc.)

### API Configuration

1. Get an API key from your chosen AI service
2. Open extension settings
3. Enter your API key
4. Test the connection

## 🐛 Troubleshooting

### Common Issues

**Extension not working on certain websites**
- Some websites block content scripts
- Try refreshing the page
- Check if the site allows extensions

**AI responses not appearing**
- Check your internet connection
- Verify API key configuration
- Try the quick action buttons first

**Floating button not showing**
- Check settings to ensure it's enabled
- Refresh the webpage
- Try disabling and re-enabling the extension

### Debug Mode

Enable debug mode for troubleshooting:

1. Open Chrome DevTools
2. Go to the Console tab
3. Look for AI Web Assistant logs
4. Check for any error messages

## 🔒 Privacy & Security

### Data Handling

- **Local Processing**: Content extraction happens locally in your browser
- **No Data Collection**: The extension doesn't collect or store personal data
- **Secure API Calls**: AI API calls use secure HTTPS connections
- **Optional Storage**: Settings and cached content are stored locally

### Permissions

The extension requires these permissions:

- **activeTab**: Access to the current tab for content extraction
- **storage**: Save settings and cached content
- **scripting**: Inject content scripts for webpage interaction
- **host_permissions**: Access to web pages for content analysis

## 🚀 Future Enhancements

### Planned Features

- **Real AI Integration**: Connect to OpenAI, Google PaLM, or other AI services
- **Voice Commands**: Speak to the AI assistant
- **Multi-language Support**: Support for multiple languages
- **Advanced Analytics**: Track reading patterns and provide insights
- **Custom Prompts**: Create and save custom AI prompts
- **Export Features**: Export summaries and explanations
- **Collaboration**: Share insights with others

### Technical Improvements

- **Performance Optimization**: Faster content extraction
- **Better Content Parsing**: Improved HTML structure analysis
- **Offline Mode**: Basic functionality without internet
- **Progressive Web App**: Install as a standalone app

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd ai-web-assistant

# Make changes to the code
# Test in Chrome with developer mode enabled

# Commit your changes
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chrome Extension API documentation
- Modern CSS frameworks and design patterns
- AI service providers for inspiration
- Open source community for tools and libraries

## 📞 Support

If you need help or have questions:

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README for usage instructions
- **Community**: Join our discussions and share feedback

---

**Made with ❤️ for better web browsing experience** 
