# 🚀 Installation Guide - AI Web Assistant

Follow these steps to install and set up the AI Web Assistant Chrome extension.

## 📋 Prerequisites

- **Google Chrome Browser** (version 88 or later)
- **Developer Mode** enabled in Chrome
- **Internet Connection** (for AI features)

## 🔧 Step-by-Step Installation

### Step 1: Download the Extension

1. **Clone or download** the extension files to your computer
2. **Extract** the files if downloaded as a ZIP
3. **Ensure** all files are in a single folder with `manifest.json` at the root

### Step 2: Enable Developer Mode

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Toggle "Developer mode"** in the top-right corner
3. **Verify** that the developer mode is now enabled

### Step 3: Load the Extension

1. **Click "Load unpacked"** button in the extensions page
2. **Browse** to the folder containing your extension files
3. **Select** the folder and click "Select Folder"
4. **Verify** the extension appears in your extensions list

### Step 4: Pin the Extension

1. **Click** the puzzle piece icon in Chrome's toolbar
2. **Find** "AI Web Assistant" in the dropdown
3. **Click** the pin icon next to it
4. **Verify** the AI Web Assistant icon now appears in your toolbar

## 🎯 First-Time Setup

### Step 1: Welcome Page

1. **Click** the AI Web Assistant icon in your toolbar
2. **Read** the welcome page to understand the features
3. **Click** "Start Using Now" to begin

### Step 2: Test the Extension

1. **Navigate** to any webpage (e.g., a news article or blog post)
2. **Click** the AI Web Assistant icon
3. **Try** the quick action buttons (Summarize, Explain, Generate Questions)
4. **Ask** a question about the page content

### Step 3: Explore Features

- **Floating Button**: Look for the floating AI button on webpages
- **Context Menu**: Right-click on any page for AI actions
- **Settings**: Click the settings button to configure options

## ⚙️ Configuration (Optional)

### AI Service Setup

To use real AI services instead of mock responses:

1. **Get an API Key**:
   - **OpenAI**: Visit [OpenAI API](https://platform.openai.com/api-keys)
   - **Google PaLM**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Anthropic Claude**: Visit [Anthropic Console](https://console.anthropic.com/)

2. **Configure the Extension**:
   - Open the extension popup
   - Click "Settings"
   - Enter your API key
   - Select your preferred AI service
   - Test the connection

### Customization

You can customize the extension by:

1. **Modifying Styles**: Edit `popup.css` for visual changes
2. **Adding Features**: Modify `popup.js` for new functionality
3. **Changing Content Extraction**: Update `content.js` for different content parsing
4. **AI Integration**: Use `ai-integration-example.js` as a template

## 🐛 Troubleshooting

### Common Issues

**Extension not loading**
- Ensure all files are in the correct folder structure
- Check that `manifest.json` is at the root level
- Verify Chrome version is 88 or later

**Extension not working on websites**
- Some websites block content scripts
- Try refreshing the page
- Check if the site allows extensions

**AI features not responding**
- Check your internet connection
- Verify API key configuration (if using real AI)
- Try the quick action buttons first

**Floating button not appearing**
- Check settings to ensure it's enabled
- Refresh the webpage
- Try disabling and re-enabling the extension

### Debug Mode

To troubleshoot issues:

1. **Open Chrome DevTools** (F12)
2. **Go to Console** tab
3. **Look for** AI Web Assistant logs
4. **Check for** error messages

### Reset Extension

If the extension stops working:

1. **Go to** `chrome://extensions/`
2. **Find** AI Web Assistant
3. **Click** "Remove"
4. **Reload** the extension following the installation steps

## 🔒 Security & Privacy

### Data Handling

- **Local Processing**: Content extraction happens in your browser
- **No Data Collection**: The extension doesn't collect personal data
- **Secure API Calls**: AI API calls use HTTPS
- **Optional Storage**: Settings stored locally

### Permissions Explained

- **activeTab**: Access current tab for content extraction
- **storage**: Save settings and cached content
- **scripting**: Inject content scripts for webpage interaction
- **host_permissions**: Access web pages for content analysis

## 📞 Support

If you need help:

1. **Check** the README.md file for detailed documentation
2. **Review** the troubleshooting section above
3. **Test** with different websites
4. **Verify** your Chrome version and settings

## 🎉 Success!

Once installed and configured, you can:

- **Ask questions** about any webpage content
- **Get summaries** of long articles
- **Understand complex topics** with AI explanations
- **Generate questions** to deepen your understanding
- **Use the floating assistant** for quick access

Enjoy your AI-powered browsing experience! 🤖✨ 