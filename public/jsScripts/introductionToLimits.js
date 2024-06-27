document.addEventListener("DOMContentLoaded", () => {
    const chatIcon = document.getElementById("chat-icon");
    const chatContainer = document.getElementById("chat-container");
    const chatSubmit = document.getElementById("chat-submit");

    chatIcon.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden");
    });

    chatSubmit.addEventListener("click", async () => {
        const message = document.getElementById("chat-textarea").value;
        const pageContent = extractPageContent(); // Capture page content here

        console.log('User message:', message); // Log the user message

        if (message.trim() !== "") {
            displayMessage(message, 'user-message');
            document.getElementById("chat-textarea").value = "";
            setTimeout(async () => {
                try {
                    const responseMessage = await generateResponse(message, pageContent); // Pass pageContent to generateResponse
                    displayMessage(responseMessage, 'response-message');
                } catch (error) {
                    displayMessage("Sorry, there was an error getting a response.", 'response-message');
                }
            }, 1000); // Simulate response delay
        } else {
            alert("Please enter a message.");
        }
    });

    function extractPageContent() {
        const bodyContent = document.body.innerText.trim();
        return bodyContent;
    }

    function displayMessage(message, className) {
        const chatMessages = document.getElementById("chat-messages");
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", className);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    async function generateResponse(message, pageContent) {
        try {
            const response = await fetch('/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message, pageContent: pageContent })
            });
            if (!response.ok) {
                console.error(`Error response: ${response.status} ${response.statusText}`);
                throw new Error(`Server responded with ${response.status}`);
            }
            const data = await response.json();
            console.log('AI response:', data); // Log the AI response
            return data.reply;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
});
