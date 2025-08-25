document.addEventListener('DOMContentLoaded', function () {
  const chatMessages = document.getElementById('chatMessages');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const languageSelect = document.getElementById('languageSelect');

  // Create typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message ai-message typing-indicator';
  typingIndicator.innerHTML = `
        <div class="message-content">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

  // Function to add a message to the chat
  function addMessage(text, isUser = false, language = 'auto') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format code blocks if present
    let formattedText = formatCodeBlocks(text, language);

    messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${formattedText}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

    chatMessages.appendChild(messageDiv);

    // Apply syntax highlighting to code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);

      // Add copy button to code blocks
      const pre = block.parentElement;
      if (!pre.querySelector('.copy-button')) {
        const codeHeader = document.createElement('div');
        codeHeader.className = 'code-header';

        const languageName = block.className.replace('language-', '') || 'code';
        codeHeader.innerHTML = `
                    <span>${languageName.toUpperCase()}</span>
                    <button class="copy-button" onclick="copyCode(this)">
                        <span class="material-icons" style="font-size: 14px;">content_copy</span>
                        Copy
                    </button>
                `;

        pre.parentElement.insertBefore(codeHeader, pre);
      }
    });

    scrollToBottom();
  }

  // Function to format code blocks in the response
  function formatCodeBlocks(text, language) {
    // Check if the text already contains code blocks
    if (text.includes('```')) {
      return text.replace(
        /```(\w+)?\s([\s\S]*?)```/g,
        function (match, lang, code) {
          const codeLang = lang || 'plaintext';
          return `<div class="code-block"><pre><code class="language-${codeLang}">${escapeHtml(
            code.trim(),
          )}</code></pre></div>`;
        },
      );
    }

    // If no code blocks but we have a language preference, format as code
    if (language && language !== 'auto' && looksLikeCode(text)) {
      return `<div class="code-block"><div class="code-header">${language.toUpperCase()}</div><pre><code class="language-${language}">${escapeHtml(
        text,
      )}</code></pre></div>`;
    }

    // Otherwise, just return the text with line breaks
    return text.replace(/\n/g, '<br>');
  }

  // Helper function to check if text looks like code
  function looksLikeCode(text) {
    const codeIndicators = [
      'function',
      'class ',
      'def ',
      'import ',
      'var ',
      'let ',
      'const ',
      'public ',
      'private ',
      '<?php',
      '<?xml',
      '<html',
      '#include',
      'using ',
      'package ',
    ];
    return codeIndicators.some((indicator) => text.includes(indicator));
  }

  // Helper function to escape HTML
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Function to show/hide typing indicator
  function showTypingIndicator(show = true) {
    if (show) {
      chatMessages.appendChild(typingIndicator);
      typingIndicator.style.display = 'flex';
      scrollToBottom();
    } else {
      typingIndicator.style.display = 'none';
      if (chatMessages.contains(typingIndicator)) {
        chatMessages.removeChild(typingIndicator);
      }
    }
  }

  // Function to scroll to the bottom of the chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to send message to the API
  async function sendMessage() {
    const message = messageInput.value.trim();
    const language = languageSelect.value;

    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    messageInput.value = '';
    sendButton.disabled = true;

    // Show typing indicator
    showTypingIndicator(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response to chat
        addMessage(data.response, false, data.language);
      } else {
        addMessage('Sorry, I encountered an error. Please try again.');
        console.error('API Error:', data.error);
      }
    } catch (error) {
      addMessage(
        "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running.",
      );
      console.error('Network Error:', error);
    } finally {
      // Hide typing indicator
      showTypingIndicator(false);
      sendButton.disabled = false;
      messageInput.focus();
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);

  messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  messageInput.addEventListener('input', function () {
    sendButton.disabled = !this.value.trim();
  });

  // Global function for copying code
  window.copyCode = function (button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const textToCopy = codeBlock.innerText;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const originalText = button.innerHTML;
        button.innerHTML =
          '<span class="material-icons" style="font-size: 14px;">check</span> Copied!';

        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  // Initial focus on input
  messageInput.focus();
});
