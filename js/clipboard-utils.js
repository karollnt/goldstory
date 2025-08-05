/**
 * Clipboard utility functions for copying text to clipboard
 * Compatible with modern and legacy browsers, optimized for mobile
 */

function copyToClipboard() {
  const textToCopy = document.getElementById('copyText').innerText;
  const copyBtn = document.getElementById('copyBtn');

  // Use the modern clipboard API if available
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show success feedback
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        copyBtn.style.backgroundColor = '#28a745';

        setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.style.backgroundColor = '';
        }, 2000);
      })
      .catch(() => {
        // Fallback for older browsers
        fallbackCopyToClipboard(textToCopy, copyBtn);
      });
  } else {
    // Fallback for older browsers or non-secure contexts
    fallbackCopyToClipboard(textToCopy, copyBtn);
  }
}

function fallbackCopyToClipboard(text, button) {
  // Create a temporary textarea element
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    // Show success feedback
    const originalText = button.innerText;
    button.innerText = 'Copied!';
    button.style.backgroundColor = '#28a745';

    setTimeout(() => {
      button.innerText = originalText;
      button.style.backgroundColor = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    button.innerText = 'Error';
    setTimeout(() => {
      button.innerText = 'Copy';
    }, 2000);
  }

  document.body.removeChild(textArea);
}

/**
 * Generic function to copy any text to clipboard with custom button
 * @param {string} textToCopy - The text to copy
 * @param {HTMLElement} button - The button element to show feedback
 */
function copyTextToClipboard(textToCopy, button) {
  // Use the modern clipboard API if available
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showCopyFeedback(button);
      })
      .catch(() => {
        fallbackCopyText(textToCopy, button);
      });
  } else {
    fallbackCopyText(textToCopy, button);
  }
}

function fallbackCopyText(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showCopyFeedback(button);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showCopyError(button);
  }

  document.body.removeChild(textArea);
}

function showCopyFeedback(button) {
  const originalText = button.innerText;
  const originalBgColor = button.style.backgroundColor;

  button.innerText = 'Copied!';
  button.style.backgroundColor = '#28a745';

  setTimeout(() => {
    button.innerText = originalText;
    button.style.backgroundColor = originalBgColor;
  }, 2000);
}

function showCopyError(button) {
  const originalText = button.innerText;

  button.innerText = 'Error';
  setTimeout(() => {
    button.innerText = originalText;
  }, 2000);
}
