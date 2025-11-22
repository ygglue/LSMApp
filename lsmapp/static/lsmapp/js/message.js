document.addEventListener('DOMContentLoaded', () => {
    const messageDisplay = document.getElementById('message-display');
    const choicesContainer = document.getElementById('choices-container');
    const typingIndicator = document.getElementById('typing-indicator');
    const progressBar = document.getElementById('progress-bar');

    let conversationData = null;
    let currentMessageId = 1; // Start with the first message
    let typingSpeed = 50; // ms per character

    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('chatSessionId', sessionId);
    }

    // Function to log interaction
    function logInteraction(messageId, choiceText, nextMessageId) {
        console.log('Logging interaction:', { sessionId, messageId, choiceText, nextMessageId });
        fetch('/api/log-interaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                message_id: messageId,
                choice_text: choiceText,
                next_message_id: nextMessageId
            })
        })
            .then(async response => {
                console.log('Response status:', response.status);
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    console.log('Log response data:', data);
                } catch (e) {
                    console.error('Failed to parse JSON response:', text);
                }
            })
            .catch(err => console.error('Error logging interaction:', err));
    }

    // Fetch conversation data
    fetch('/api/messages/')
        .then(response => response.json())
        .then(data => {
            conversationData = data.conversations;
            startConversation();
        })
        .catch(error => {
            console.error('Error loading messages:', error);
            messageDisplay.textContent = "Error loading messages. Please try again.";
        });

    function startConversation() {
        if (!conversationData) return;
        showNextMessage(currentMessageId);
    }

    function showNextMessage(id) {
        const messageObj = conversationData.find(m => m.id === id);

        if (!messageObj) {
            // End of conversation, redirect to bouquet page
            finishConversation();
            return;
        }

        // Update progress
        const totalMessages = conversationData.length;
        // This is a rough estimate of progress since branching makes it non-linear
        // We'll just increment it a bit for visual effect
        const currentProgress = (conversationData.indexOf(messageObj) + 1) / totalMessages * 100;
        progressBar.style.width = `${Math.min(currentProgress, 100)}%`;

        // Clear previous content
        messageDisplay.textContent = '';
        choicesContainer.innerHTML = '';
        choicesContainer.classList.remove('visible');

        // Show typing indicator
        typingIndicator.classList.add('active');

        // Simulate thinking delay
        setTimeout(() => {
            typingIndicator.classList.remove('active');
            typeMessage(messageObj.message, () => {
                showChoices(messageObj.choices);
            });
        }, 800);
    }

    function typeMessage(text, callback) {
        let index = 0;
        messageDisplay.textContent = '';

        function type() {
            if (index < text.length) {
                messageDisplay.textContent += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            } else {
                if (callback) callback();
            }
        }

        type();
    }

    function showChoices(choices) {
        if (!choices || choices.length === 0) {
            // If no choices, maybe auto-proceed or end? 
            // For this app, we assume choices or end of flow.
            // If it's a linear message without choices, we could add a "Continue" button automatically
            // But based on requirements, it seems choice-driven.
            // Let's add a default continue if no choices provided but not end of data
            setTimeout(finishConversation, 1500);
            return;
        }

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-btn');

            const span = document.createElement('span');
            span.textContent = choice.text;
            button.appendChild(span);

            button.addEventListener('click', () => {
                // Log the interaction
                logInteraction(currentMessageId, choice.text, choice.next);

                // Disable all buttons to prevent double clicks
                const allButtons = choicesContainer.querySelectorAll('.choice-btn');
                allButtons.forEach(btn => btn.disabled = true);

                // Proceed to next message
                currentMessageId = choice.next;
                showNextMessage(currentMessageId);
            });

            choicesContainer.appendChild(button);
        });

        // Small delay before showing choices for animation effect
        setTimeout(() => {
            choicesContainer.classList.add('visible');
        }, 300);
    }

    function finishConversation() {
        progressBar.style.width = '100%';
        messageDisplay.textContent = "Redirecting...";
        setTimeout(() => {
            window.location.href = '/bouquet/';
        }, 1000);
    }
});
