document.addEventListener("DOMContentLoaded", () => {
    let conversationHistory = []; // Array to store conversation history

    const chatIcon = document.getElementById("chat-icon");
    const chatContainer = document.getElementById("chat-container");
    const chatSubmit = document.getElementById("chat-submit");

    chatIcon.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden");
    });

    chatSubmit.addEventListener("click", async () => {
        const userInput = document.getElementById("chat-textarea").value.trim();

        if (userInput !== "") {
            displayMessage(userInput, 'user-message');
            document.getElementById("chat-textarea").value = "";

            setTimeout(async () => {
                try {
                    const responseMessage = await generateResponse(userInput); // Function to generate a response
                    displayMessage(responseMessage, 'response-message');
                    conversationHistory.push({ role: 'user', content: userInput });
                    conversationHistory.push({ role: 'assistant', content: responseMessage });
                } catch (error) {
                    displayMessage("Sorry, there was an error getting a response.", 'response-message');
                }
            }, 1000); // Simulate response delay
        } else {
            alert("Please enter a message.");
        }
    });

    function displayMessage(message, className) {
        const chatMessages = document.getElementById("chat-messages");
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", className);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    async function generateResponse(message) {
        try {
            const response = await fetch('/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message })
            });
            if (!response.ok) {
                console.error(`Error response: ${response.status} ${response.statusText}`);
                throw new Error(`Server responded with ${response.status}`);
            }
            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
});
