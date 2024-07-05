document.addEventListener("DOMContentLoaded", () => {
    let isFirstMessage = true;
    let conversationHistory = [];  // Array to store conversation history

    const chatIcon = document.getElementById("chat-icon");
    const chatContainer = document.getElementById("chat-container");
    const chatSubmit = document.getElementById("chat-submit");

    chatIcon.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden");
        if (isFirstMessage) {
            initiateChat();
            isFirstMessage = false;
        }
    });

    chatSubmit.addEventListener("click", async () => {
        const userInput = document.getElementById("chat-textarea").value.trim();

        if (userInput !== "") {
            displayMessage(userInput, 'user-message');
            document.getElementById("chat-textarea").value = "";

            setTimeout(async () => {
                try {
                    const visibleContent = getVisibleContent(); // Get the current visible content
                    if (!visibleContent) {
                        const responseMessage = "Content not found on current screen. Please scroll to the relevant section.";
                        displayMessage(responseMessage, 'response-message');
                        return;
                    }

                    const responseMessage = await generateResponse(userInput, visibleContent);
                    const formattedResponse = formatResponse(responseMessage);
                    displayMessage(formattedResponse, 'response-message');
                    conversationHistory.push({ role: 'user', content: userInput });
                    conversationHistory.push({ role: 'assistant', content: formattedResponse });
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
        messageElement.innerHTML = message; // Use innerHTML to preserve formatting
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    async function generateResponse(message, visibleContent) {
        try {
            const response = await fetch('/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message, visibleContent })
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

    function initiateChat() {
        const visibleContent = getVisibleContent();
        const initialMessages = [
            "Hi there! Need any help with the content on this page?",
            "Hello! How can I assist you with this page?",
            "Hey! Do you have any questions about what you're reading?",
            "Greetings! Is there something you'd like to know more about?",
            "Hi! Need any clarification on this topic?"
        ];
        const initialMessage = initialMessages[Math.floor(Math.random() * initialMessages.length)];
        displayMessage(initialMessage, 'response-message');
    }

    function getVisibleContent() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const elements = document.elementsFromPoint(centerX, centerY);
        const contentArray = [];

        elements.forEach(element => {
            // Check if the element is not part of the chatbot
            if (element.closest("body") && element.closest("#chat-container") === null && element.innerText.trim()) {
                contentArray.push(element.innerText.trim());
            }
        });

        // Filter out duplicates and concatenate into a single string
        const visibleContent = Array.from(new Set(contentArray)).join(' ');

        // If content length exceeds a certain threshold, trim the content
        const maxLength = 3000; // Adjust based on your context length needs
        const trimmedContent = visibleContent.length > maxLength 
            ? visibleContent.substring(0, maxLength) + '...'
            : visibleContent;

        console.log("Visible Content:", trimmedContent); // Check in console
        return trimmedContent;
    }

    function formatResponse(response) {
        // Ensure there are spaces between sentences and paragraphs
        let formatted = response.replace(/(\.|\?|!)([A-Za-z])/g, '$1 $2');
    
        // Split by sentences and add line breaks for important information
        formatted = formatted.split(/(?<=[.!?])\s+/).map(sentence => {
            sentence = sentence.trim(); // Trim any leading or trailing whitespace
    
            // Check if the sentence starts with a capital letter and doesn't contain a colon in the first 3-5 words
            let words = sentence.split(' ');
            let firstFewWords = words.slice(0, 5).join(' ');
    
            if (/^[A-Z]/.test(sentence) && !/^.{0,25}:/.test(firstFewWords)) {
                return `\n\n<p>${sentence}</p>\n\n`;
            }
    
            return `${sentence}. `;
        }).join(''); // Use empty string to concatenate without extra spaces
    
        return formatted.trim(); // Trim any leading or trailing whitespace
    }
    document.addEventListener('scroll', () => {
        const visibleContent = getVisibleContent();
        console.log("Visible Content on Scroll:", visibleContent); // Check in console
    });
});
