document.addEventListener("DOMContentLoaded", function () {
    const chatMessages = document.getElementById("chat-messages");
    const userMessageInput = document.getElementById("user-message");
    const sendButton = document.getElementById("send-button");
    const quickquestionButtons = document.querySelectorAll('.quick-question-btn');

   
    document.getElementById("popup").style.display = "block";

    window.closePopup = function () {
        document.getElementById("popup").style.display = "none";
    };

    sendButton.addEventListener("click", function () {
        const userMessage = userMessageInput.value.trim();
        if (userMessage !== "") {
            displayMessage("User", userMessage);
            sendToChatbot(userMessage);
            userMessageInput.value = "";
        }
    })

    quickquestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            displayMessage("User", message);
            sendToChatbot(message);
            button.style.display = "none";
        });
    });

    function sendToChatbot(message) {
        displayBotThinking();
        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            removeBotThinking();
            displayMessage("Agent-AI", data.message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
            removeBotThinking();
        });
    }

    function displayMessage(sender, message) {
        const messageElement = document.createElement("p");
        messageElement.classList.add("chat-message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
    }

    function displayBotThinking() {
        const thinkingIndicator = document.createElement('div');
        thinkingIndicator.className = 'bot-thinking';
        thinkingIndicator.textContent = 'Agent-AI is thinking...';
        chatMessages.appendChild(thinkingIndicator);
    }

    function removeBotThinking() {
        const thinkingIndicator = document.querySelector('.bot-thinking');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }
});
