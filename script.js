// --- State Management ---
let state = {
    score: 0,
    maxPossibleScore: 0,
    categories: {
        'Booth Scenarios': { earned: 0, max: 0 },
        'EVM Knowledge': { earned: 0, max: 0 }
    },
    scenariosCompleted: 0
};

// --- Navigation Logic ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = e.target.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        
        if(target === 'readiness') updateReadinessDashboard();
        window.scrollTo(0, 0);
    });
});

// --- EVM Simulator ---
const fictionalCandidates = [
    { serial: 1, name: "Arjun Verma", symbol: "🍎" },
    { serial: 2, name: "Priya Sharma", symbol: "🚲" },
    { serial: 3, name: "Ravi Kumar", symbol: "☂️" },
    { serial: 4, name: "NOTA", symbol: "❌" }
];

const candidateList = document.getElementById('candidate-list');
let hasVoted = false;

fictionalCandidates.forEach((c, index) => {
    const row = document.createElement('div');
    row.className = 'candidate-row';
    row.innerHTML = `
        <div class="c-serial">${c.serial}</div>
        <div class="c-name">${c.name}</div>
        <div class="c-symbol">${c.symbol}</div>
        <div class="c-led" id="led-${index}"></div>
        <button class="vote-btn" onclick="castVote(${index})"></button>
    `;
    candidateList.appendChild(row);
});

function castVote(index) {
    if(hasVoted) return;
    hasVoted = true;
    
    // Disable all buttons
    document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
    
    // Turn on LED
    document.getElementById(`led-${index}`).classList.add('active');
    
    // Play Beep
    const beep = document.getElementById('beep-sound');
    beep.play().catch(e => console.log("Audio play blocked by browser", e));
    
    document.getElementById('vvpat-status').innerText = "Printing...";
    
    // Show VVPAT Slip
    const slip = document.getElementById('vvpat-slip');
    const c = fictionalCandidates[index];
    document.getElementById('slip-serial').innerText = c.serial;
    document.getElementById('slip-name').innerText = c.name;
    document.getElementById('slip-symbol').innerText = c.symbol;
    
    slip.classList.remove('hidden');
    slip.classList.add('show');
    
    // Drop slip after 7 seconds
    setTimeout(() => {
        slip.classList.remove('show');
        slip.classList.add('drop');
        document.getElementById('vvpat-status').innerText = "Vote Recorded ✅";
        
        // Show feedback after slip drops
        setTimeout(() => {
            document.getElementById('evm-feedback').classList.remove('hidden');
            slip.classList.add('hidden');
            slip.classList.remove('drop');
            
            // Add EVM Knowledge Points just for trying!
            state.categories['EVM Knowledge'].max += 10;
            state.categories['EVM Knowledge'].earned += 10;
            state.score += 10;
            state.maxPossibleScore += 10;
        }, 500);
    }, 7000);
}

function resetEVM() {
    hasVoted = false;
    document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = false);
    document.querySelectorAll('.c-led').forEach(led => led.classList.remove('active'));
    document.getElementById('vvpat-status').innerText = "Machine Ready";
    document.getElementById('evm-feedback').classList.add('hidden');
    document.getElementById('vvpat-slip').classList.add('hidden');
}


// --- Myth vs Fact Flashcards ---
const mythsData = [
    {
        myth: "EVMs can be hacked remotely via Wi-Fi or Bluetooth.",
        fact: "EVMs are standalone machines with NO wireless communication capabilities. They cannot connect to Wi-Fi, Bluetooth, or the Internet."
    },
    {
        myth: "If I don't have a Voter ID card, I cannot vote at all.",
        fact: "If your name is on the Voter List, you can vote using other ECI-approved ID proofs like Aadhaar, PAN Card, Driving License, or Passport."
    },
    {
        myth: "The Presiding Officer can see who I voted for.",
        fact: "Your vote is completely secret. The Control Unit only tracks the total number of votes, not who cast them."
    }
];

const flashcardsContainer = document.getElementById('flashcards-container');

mythsData.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.innerHTML = `
        <div class="card-face card-front">
            <h3>❌ MYTH</h3>
            <p>"${m.myth}"</p>
            <p style="margin-top:1rem; font-size:0.8rem; opacity:0.7;">Tap to flip</p>
        </div>
        <div class="card-face card-back">
            <h3>✅ FACT</h3>
            <p>${m.fact}</p>
        </div>
    `;
    card.onclick = () => card.classList.toggle('flipped');
    flashcardsContainer.appendChild(card);
});


// --- Scenario Engine ---
const scenariosData = [
    {
        scenario: "Situation: You arrive at the polling booth, but your name is NOT on the voter list. You have your Voter ID (EPIC) card with you. What do you do?",
        category: 'Booth Scenarios',
        points: 10,
        options: [
            { text: "Argue with the officer and demand to vote.", type: "incorrect", verdict: "🔴 Incorrect", why: "Voter ID card proof hai, par vote dene ke liye aapka naam Voter List mein hona zaroori hai.", step: "Return home. Always verify your name online on voters.eci.gov.in beforehand." },
            { text: "Go back home; I cannot vote without my name on the list.", type: "correct", verdict: "🟢 Correct", why: "Sahi jawab! Possession of an EPIC card does not guarantee the right to vote if the name is missing.", step: "Ensure you fill Form 6 to get added for the next election." },
            { text: "Ask for a 'Tendered Vote'.", type: "incorrect", verdict: "🔴 Incorrect", why: "Tendered vote is ONLY for when someone else has already cast a vote in your name.", step: "Understand the difference between Tendered Vote and missing names." }
        ]
    },
    {
        scenario: "Situation: You reach the booth at 5:50 PM. Polling closes at 6:00 PM. But there is a very long line. What will happen?",
        category: 'Booth Scenarios',
        points: 10,
        options: [
            { text: "I won't be allowed to vote after 6 PM.", type: "incorrect", verdict: "🔴 Incorrect", why: "If you are in the queue before the closing time, you have the right to vote.", step: "Stay in line. The officer will distribute slips from the end of the line at 6 PM." },
            { text: "The officer will distribute slips at 6 PM to everyone in line.", type: "correct", verdict: "🟢 Correct", why: "Sahi Kadam! As per ECI rules, all voters standing in the queue at the scheduled close of poll are allowed to vote.", step: "Wait patiently for your turn." }
        ]
    }
];

let currentScenarioIndex = 0;
const scenarioText = document.getElementById('scenario-text');
const scenarioOptions = document.getElementById('scenario-options');
const scenarioFeedback = document.getElementById('scenario-feedback');
const feedbackVerdict = document.getElementById('feedback-verdict');
const feedbackWhy = document.getElementById('feedback-why');
const feedbackStep = document.getElementById('feedback-step');
const nextScenarioBtn = document.getElementById('next-scenario-btn');
const scenarioCompletion = document.getElementById('scenario-completion');

function loadScenario() {
    if(currentScenarioIndex >= scenariosData.length) {
        scenarioText.innerText = "All scenarios completed!";
        scenarioOptions.innerHTML = '';
        scenarioFeedback.classList.add('hidden');
        scenarioCompletion.classList.remove('hidden');
        return;
    }

    const s = scenariosData[currentScenarioIndex];
    scenarioText.innerText = s.scenario;
    scenarioOptions.innerHTML = '';
    scenarioFeedback.className = 'feedback-box hidden';
    nextScenarioBtn.classList.add('hidden');
    scenarioCompletion.classList.add('hidden');

    s.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = opt.text;
        btn.onclick = () => handleScenarioChoice(opt, btn, s);
        scenarioOptions.appendChild(btn);
    });
}

function handleScenarioChoice(opt, btn, s) {
    Array.from(scenarioOptions.children).forEach(b => {
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.6';
    });
    btn.style.opacity = '1';

    state.categories[s.category].max += s.points;
    state.maxPossibleScore += s.points;
    
    if(opt.type === 'correct') {
        btn.style.background = "rgba(16, 185, 129, 0.2)";
        btn.style.borderColor = "var(--success)";
        scenarioFeedback.classList.add('correct');
        feedbackVerdict.className = 'verdict correct';
        state.score += s.points;
        state.categories[s.category].earned += s.points;
    } else {
        btn.style.background = "rgba(239, 68, 68, 0.2)";
        btn.style.borderColor = "var(--error)";
        scenarioFeedback.classList.add('incorrect');
        feedbackVerdict.className = 'verdict incorrect';
    }

    state.scenariosCompleted++;
    feedbackVerdict.innerText = opt.verdict;
    feedbackWhy.innerText = opt.why;
    feedbackStep.innerText = opt.step;
    
    scenarioFeedback.classList.remove('hidden');
    nextScenarioBtn.classList.remove('hidden');
}

nextScenarioBtn.addEventListener('click', () => {
    currentScenarioIndex++;
    loadScenario();
});

loadScenario();


// --- Readiness Dashboard Logic ---
function updateReadinessDashboard() {
    const detailsDiv = document.getElementById('readiness-details');
    const emptyDiv = document.getElementById('readiness-empty');
    const scoreDisplay = document.getElementById('final-score');
    
    if(state.maxPossibleScore === 0) {
        detailsDiv.classList.add('hidden');
        emptyDiv.classList.remove('hidden');
        scoreDisplay.innerText = "0";
        return;
    }

    detailsDiv.classList.remove('hidden');
    emptyDiv.classList.add('hidden');

    const percentage = Math.round((state.score / state.maxPossibleScore) * 100);
    scoreDisplay.innerText = percentage;

    let weakestCategory = "None";
    let lowestPercent = 101;

    for (const [catName, data] of Object.entries(state.categories)) {
        if (data.max > 0) {
            const perc = data.earned / data.max;
            if (perc < lowestPercent) {
                lowestPercent = perc;
                weakestCategory = catName;
            }
        }
    }

    const weakText = document.getElementById('weak-area-text');
    const tipText = document.getElementById('tip-text');

    if (percentage === 100) {
        weakText.innerText = "None! You are perfectly prepared.";
        tipText.innerText = "Go out there and cast your vote confidently. Encourage others to do the same!";
    } else {
        weakText.innerText = `You need to brush up on: ${weakestCategory}`;
        if(weakestCategory === 'Booth Scenarios') {
            tipText.innerText = "Remember, the Presiding Officer is the final authority at the booth. Follow ECI rules.";
        } else {
            tipText.innerText = "Try the EVM Simulator again to understand how the machines work.";
        }
    }

    const circle = document.querySelector('.score-circle');
    if(percentage < 50) circle.style.borderColor = "var(--error)";
    else if(percentage < 80) circle.style.borderColor = "var(--warning)";
    else circle.style.borderColor = "var(--success)";
}

// --- Chat Assistant (NLP Mock) ---
const chatHistory = document.getElementById('chat-history');
const customInput = document.getElementById('custom-chat-input');

function appendMessage(sender, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = htmlContent;
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
        response = "For new voters, you need to fill out <strong>Form 6</strong> on the Voters' Services Portal.";
    }
    else if (lowerInput.includes('shift') || lowerInput.includes('correct') || lowerInput.includes('form 8')) {
        response = "To correct details or shift residence, you must fill out <strong>Form 8</strong>.";
    }
    else if (lowerInput.includes('ready') || lowerInput.includes('score')) {
        response = "You can check your Readiness Score in the <strong>📊 Score</strong> tab! Make sure you complete the scenarios first.";
    }
    // --- New Definitions Section ---
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
