// Modern AI Chat - Clean and Minimal
// Streamlined UX inspired by ChatGPT, Claude, Gemini

const messagesWrapper = document.getElementById('messages-wrapper');
const messagesContainer = document.getElementById('messages-container');
const emptyState = document.getElementById('empty-state');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const statusText = document.getElementById('status-text');
const chatForm = document.getElementById('chat-form');

let isProcessing = false;


// Get API URL from config (loaded from config.js)
const BACKEND_URL = window.config?.BACKEND_URL || 'http://localhost:3000';

// Initialize
function init() {
    messageInput.focus();
    messageInput.addEventListener('input', autoResizeTextarea);
    messageInput.addEventListener('keydown', handleKeyPress);
    checkBackendConnection();
}

// Send Message
async function sendMessage(event) {
    event.preventDefault();

    if (isProcessing) return;

    const message = messageInput.value.trim();
    if (!message) return;

    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }

    // Add user message
    addMessage(message, 'user');

    // Clear input
    messageInput.value = '';
    autoResizeTextarea();

    // Show loading
    setProcessingState(true);

    try {
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.answer || 'No response received';

        // Add AI response
        addMessage(aiResponse, 'ai');
        updateStatus('Online', true);

    } catch (error) {
        console.error('Error:', error);
        addMessage(
            'Unable to connect to the server. Please ensure the backend is running on port 3000.',
            'ai',
            true
        );
        updateStatus('Offline', false);
    } finally {
        setProcessingState(false);
        messageInput.focus();
    }
}

// Add Message to Chat
function addMessage(content, sender, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? 'U' : 'AI';
    avatar.setAttribute('aria-hidden', 'true');

    // Content Wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content-wrapper';

    // Header
    const header = document.createElement('div');
    header.className = 'message-header';

    const senderName = document.createElement('span');
    senderName.className = 'message-sender';
    senderName.textContent = sender === 'user' ? 'You' : 'AI';

    header.appendChild(senderName);

    // Content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    if (isError) {
        messageContent.style.color = '#ef4444';
    }

    contentWrapper.appendChild(header);
    contentWrapper.appendChild(messageContent);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentWrapper);

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Processing State
function setProcessingState(processing) {
    isProcessing = processing;
    sendButton.disabled = processing;
    messageInput.disabled = processing;

    if (processing) {
        sendButton.textContent = 'Sending...';

        // Add loading message
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        loadingDiv.id = 'loading-message';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'AI';

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'message-content-wrapper';

        const header = document.createElement('div');
        header.className = 'message-header';

        const senderName = document.createElement('span');
        senderName.className = 'message-sender';
        senderName.textContent = 'AI';

        header.appendChild(senderName);

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = '<span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>';

        contentWrapper.appendChild(header);
        contentWrapper.appendChild(content);

        loadingDiv.appendChild(avatar);
        loadingDiv.appendChild(contentWrapper);

        messagesContainer.appendChild(loadingDiv);
        scrollToBottom();
    } else {
        sendButton.textContent = 'Send';

        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
}

// Update Status
function updateStatus(status, isOnline) {
    statusText.textContent = status;
    const statusDot = document.querySelector('.status-dot');

    if (statusDot) {
        statusDot.style.background = isOnline ? '#10a37f' : '#ef4444';
    }
}

// Auto-resize Textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
}

// Handle Keyboard
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
}

// Scroll to Bottom
function scrollToBottom() {
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}

// Check Backend Connection
async function checkBackendConnection() {
    try {
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'ping' })
        });

        updateStatus(response.ok ? 'Online' : 'Error', response.ok);
    } catch (error) {
        updateStatus('Offline', false);
    }
}

// Initialize on Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
