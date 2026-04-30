export function initChat() {
    const customInput = document.getElementById('custom-chat-input');
    
    // Add event listeners for quick prompt chips
    document.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            sendChatMessage(e.target.innerText);
        });
    });

    if (customInput) {
        customInput.addEventListener('keypress', handleKeyPress);
        document.querySelector('.send-btn').addEventListener('click', submitCustomChat);
    }

    // Make global for inline event handlers if any remain
    window.sendChatMessage = sendChatMessage;
    window.handleKeyPress = handleKeyPress;
    window.submitCustomChat = submitCustomChat;
}

function appendMessage(sender, htmlContent) {
    const chatHistory = document.getElementById('chat-history');
    if(!chatHistory) return;

    // Sanitize basic input to prevent simple XSS.
    const sanitizedHtml = htmlContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    // If sender is bot, we allow some trusted HTML, if user we sanitize.
    if(sender === 'bot') {
        msgDiv.innerHTML = htmlContent; 
    } else {
        msgDiv.innerHTML = sanitizedHtml;
    }
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function sendChatMessage(text) {
    if(!text.trim()) return;
    appendMessage('user', text);
    processIntent(text);
}

function handleKeyPress(e) {
    if(e.key === 'Enter') submitCustomChat();
}

function submitCustomChat() {
    const customInput = document.getElementById('custom-chat-input');
    if(!customInput) return;

    const text = customInput.value;
    if(text) {
        sendChatMessage(text);
        customInput.value = '';
    }
}

function processIntent(input) {
    const lowerInput = input.toLowerCase();
    let response = "";

    // Keyword matching / Intent detection
    if (lowerInput.includes('test me') || lowerInput.includes('scenario')) {
        response = "Sure! Go to the <strong>🚨 Test Me</strong> tab in the navigation menu to start the interactive simulation.";
    } 
    else if (lowerInput.includes('after') && lowerInput.includes('press') || lowerInput.includes('evm')) {
        response = "After you press the blue button on the EVM, a red LED glows and a long BEEP sounds. Then, the VVPAT prints a slip showing your choice for 7 seconds. Try it out in the <strong>🗳️ EVM Simulator</strong> tab!";
    }
    else if (lowerInput.includes('problem') || lowerInput.includes('help')) {
        response = "I am here to help. What is the problem? <br>- Is your name missing from the list?<br>- Did someone cast your vote?<br>- Or do you need a specific Form (like Form 6 or 8)?";
    }
    else if (lowerInput.includes('form 6') || lowerInput.includes('new voter') || lowerInput.includes('18')) {
        response = "For new voters, you need to fill out <a href='https://voters.eci.gov.in' target='_blank'>Form 6</a> on the Voters' Services Portal.";
    }
    else if (lowerInput.includes('shift') || lowerInput.includes('correct') || lowerInput.includes('form 8')) {
        response = "To correct details or shift residence, you must fill out <a href='https://voters.eci.gov.in' target='_blank'>Form 8</a>.";
    }
    else if (lowerInput.includes('ready') || lowerInput.includes('score')) {
        response = "You can check your Readiness Score in the <strong>📊 Score</strong> tab! Make sure you complete the scenarios first.";
    }
    else if (lowerInput.includes('nota')) {
        response = "<strong>NOTA (None of the Above)</strong>: This is an option on the EVM that allows a voter to officially reject all the candidates contesting in that election. It ensures your right not to vote for an unsuitable candidate is recorded.";
    }
    else if (lowerInput.includes('epic') || lowerInput.includes('voter id')) {
        response = "<strong>EPIC (Electors Photo Identity Card)</strong>: Commonly known as the Voter ID card. It is issued by the Election Commission of India. However, remember that merely having an EPIC is not enough—your name MUST be on the Voter List to cast a vote.";
    }
    else if (lowerInput.includes('vvpat')) {
        response = "<strong>VVPAT (Voter Verifiable Paper Audit Trail)</strong>: A machine attached to the EVM that prints a paper slip showing your vote (serial number, name, and symbol). You can see it through a glass window for 7 seconds to verify your vote before it drops into a sealed box.";
    }
    else if (lowerInput.includes('blo')) {
        response = "<strong>BLO (Booth Level Officer)</strong>: A local government/semi-government official familiar with the local area. They are the grassroots representative of the Election Commission, responsible for maintaining the voter list for your specific polling booth.";
    }
    else if (lowerInput.includes('proxy') || lowerInput.includes('service voter')) {
        response = "<strong>Proxy Voting</strong>: A facility provided mostly to Service Voters (like members of the Armed Forces). They can authorize a resident of their constituency to vote on their behalf. Ordinary citizens cannot use proxy voting.";
    }
    else {
        response = "I'm processing your query... As an AI assistant focused on voter readiness, I recommend checking out the 'Test Me' or 'EVM Simulator' sections for practical experience. Can you be more specific about your voting question? For example, try asking about 'NOTA', 'EPIC', or 'Form 6'.";
    }

    setTimeout(() => {
        appendMessage('bot', response);
    }, 600);
}
