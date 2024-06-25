document.addEventListener("DOMContentLoaded", () => {
    const chatIcon = document.getElementById("chat-icon");
    const chatContainer = document.getElementById("chat-container");
    const chatSubmit = document.getElementById("chat-submit");

    chatIcon.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden");
    });

    chatSubmit.addEventListener("click", () => {
        const message = document.getElementById("chat-textarea").value;
        if (message.trim() !== "") {
            displayMessage(message, 'user-message');
            document.getElementById("chat-textarea").value = "";
            setTimeout(() => {
                const responseMessage = generateResponse(message); // Function to generate a response
                displayMessage(responseMessage, 'response-message');
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

    function generateResponse(message) {
        // You can customize this function to generate a response based on the user's message
        return "This is a response to: " + message;
    }
});
