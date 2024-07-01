document.addEventListener("DOMContentLoaded", () => {
    const chatIcon = document.getElementById("chat-icon");
    const chatContainer = document.getElementById("chat-container");
    const chatSubmit = document.getElementById("chat-submit");
    const chatTextarea = document.getElementById("chat-textarea");

    let chatInitiated = false; // Flag to track if the chat has been initiated
    let awaitingUserResponse = false; // Flag to track if waiting for user response

    let messageQueue = []; // Queue to hold hints and questions
    let currentMessageIndex = 0; // Index to track current message in the queue

    chatIcon.addEventListener("click", () => {
        chatContainer.classList.toggle("hidden");
        if (!chatContainer.classList.contains("hidden") && !chatInitiated) {
            chatInitiated = true; // Set the flag to true
            initiateChat();
        }
    });

    chatSubmit.addEventListener("click", async () => {
        const message = chatTextarea.value.trim();
        const pageContent = extractPageContent(); // Capture page content here

        console.log('User message:', message); // Log the user message

        if (message !== "") {
            displayMessage(message, 'user-message');
            chatTextarea.value = "";

            if (awaitingUserResponse) {
                // User is responding to a question
                const nextMessage = messageQueue[currentMessageIndex];
                currentMessageIndex++;

                if (nextMessage) {
                    displayMessage(nextMessage.content, 'response-message');
                    awaitingUserResponse = false; // Reset awaiting flag
                    if (nextMessage.type === 'question') {
                        awaitingUserResponse = true; // Set flag to wait for user response
                    }
                } else {
                    awaitingUserResponse = false; // No more messages to wait for
                }
            } else {
                // User initiated new message
                setTimeout(async () => {
                    try {
                        const responseMessages = await generateResponse(message, pageContent); // Pass pageContent to generateResponse
                        messageQueue = responseMessages; // Store all messages in queue
                        currentMessageIndex = 0; // Reset index
                        const initialMessage = messageQueue[currentMessageIndex];
                        displayMessage(initialMessage.content, 'response-message');
                        currentMessageIndex++;

                        if (initialMessage.type === 'question') {
                            awaitingUserResponse = true; // Set flag to wait for user response
                        }
                    } catch (error) {
                        displayMessage("Sorry, there was an error getting a response.", 'response-message');
                    }
                }, 1000); // Simulate response delay
            }
        } else {
            alert("Please enter a message.");
        }
    });

    function initiateChat() {
        const pageContent = extractPageContent();
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
            return processAIResponse(data.reply); // Process the AI response into hints and questions
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    function processAIResponse(aiResponse) {
        const hintsAndQuestions = [];

        // Split the AI response into sentences
        const sentences = aiResponse.split('. ');

        // Generate hints and questions for each sentence
        sentences.forEach((sentence, index) => {
            const hintOrQuestion = generateHintOrQuestion(sentence, index);
            hintsAndQuestions.push(hintOrQuestion);
        });

        return hintsAndQuestions;
    }

    function generateHintOrQuestion(sentence, index) {
        const hintOrQuestionTypes = ['hint', 'question'];
        const type = hintOrQuestionTypes[Math.floor(Math.random() * hintOrQuestionTypes.length)];
        const delay = index * 1000;

        if (type === 'hint') {
            return {
                content: `Hint: ${sentence}`,
                delay: delay,
                type: 'hint'
            };
        } else {
            return {
                content: `What do you think about ${sentence}?`,
                delay: delay,
                type: 'question'
            };
        }
    }
});
