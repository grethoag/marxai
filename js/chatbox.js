// Get references to chat elements
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Set up the API credentials and URL
const API_KEY = 'sk-wutusmsrudlvqxvpsjuyghbubdssmbgysxjxfpfrtalbrhwn'; // Replace with your API key
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions'; // The correct API endpoint

// Function to send a message
function sendMessage() {
    const message = chatInput.value.trim();

    if (message !== '') {
        // Display the user's message in the chat box without typewriter effect
        displayMessage(message, 'user-message', false);

        // Fetch the bot response from the SiliconFlow API
        fetchBotResponse(message);
    }

    // Clear the input field and focus
    chatInput.value = '';
    chatInput.focus();
    // chatMessages.scrollTop = chatMessages.scrollHeight; // 移除或注释掉这行
}

// Function to display a new message in the chat
function displayMessage(text, className, useTypewriter = true) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerHTML = `<span class="username">${className === 'user-message' ? 'You' : 'Marx'}:</span> `;
    chatMessages.appendChild(messageDiv);

    const messageContentDiv = document.createElement('span');
    messageDiv.appendChild(messageContentDiv);

    if (className === 'user-message' || !useTypewriter) {
        // Display the message immediately for user message or if typewriter effect is not needed
        messageContentDiv.innerHTML = text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
        // Apply typewriter effect to the bot's message with random speed
        let i = 0;
        const minSpeed = 10; // Minimum speed (milliseconds)
        const maxSpeed = 50; // Maximum speed (milliseconds)
        
        function typeWriter() {
            if (i < text.length) {
                messageContentDiv.innerHTML += text.charAt(i);
                i++;
                // Randomize typing speed for the bot's message
                const randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
                setTimeout(typeWriter, randomSpeed);
            }
        }

        // Start typing the message with random speed
        typeWriter();
    }

    // Scroll the chat to the bottom after adding a new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to fetch bot response from SiliconFlow API
async function fetchBotResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-7B-Instruct", // Ensure this is the correct model
                messages: [
                    { role: "system", content: "You are Karl Marx, the 19th-century philosopher and economist. Answer questions in the style of Karl Marx, using his views on history, economics, and politics." },
                    { role: "user", content: userMessage }
                ],
                stream: false, // Adjust if streaming is needed (false to get the whole response in one go)
                max_tokens: 512,
                temperature: 0.7, // Control randomness in the response
                top_p: 0.7,
                top_k: 50,
                frequency_penalty: 0.5,
                n: 1, // Number of responses to generate
                response_format: { type: "text" },
                tools: [] // Remove tools if not necessary for this use case
            })
        });

        const data = await response.json();
        console.log('API Response:', data); // Debugging: print the full response

        // Ensure the response contains the expected structure
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            const botResponse = data.choices[0].message.content;
            displayMessage(botResponse, 'bot-message', true);
        } else {
            console.error('Response structure is incorrect or empty');
            displayMessage('Sorry, I did not get that response. Please try again.', 'bot-message', true);
        }

    } catch (error) {
        console.error('Error fetching response from API:', error);
        displayMessage('Sorry, something went wrong. Please try again later.', 'bot-message', true);
    }
}

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message when 'Enter' key is pressed
chatInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 在页面加载时将滚动位置设置为顶部
window.onload = function() {
    window.scrollTo(0, 0);
};