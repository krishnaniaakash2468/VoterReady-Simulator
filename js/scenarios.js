import { state, updateScore } from './state.js';

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

export function initScenarios() {
    const nextScenarioBtn = document.getElementById('next-scenario-btn');
    if(nextScenarioBtn) {
        nextScenarioBtn.addEventListener('click', () => {
            currentScenarioIndex++;
            loadScenario();
        });
    }
    loadScenario();
}

function loadScenario() {
    const scenarioText = document.getElementById('scenario-text');
    const scenarioOptions = document.getElementById('scenario-options');
    const scenarioFeedback = document.getElementById('scenario-feedback');
    const nextScenarioBtn = document.getElementById('next-scenario-btn');
    const scenarioCompletion = document.getElementById('scenario-completion');

    if(!scenarioText) return;

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
    const scenarioOptions = document.getElementById('scenario-options');
    const scenarioFeedback = document.getElementById('scenario-feedback');
    const feedbackVerdict = document.getElementById('feedback-verdict');
    const feedbackWhy = document.getElementById('feedback-why');
    const feedbackStep = document.getElementById('feedback-step');
    const nextScenarioBtn = document.getElementById('next-scenario-btn');

    Array.from(scenarioOptions.children).forEach(b => {
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.6';
    });
    btn.style.opacity = '1';
    
    if(opt.type === 'correct') {
        btn.style.background = "rgba(16, 185, 129, 0.2)";
        btn.style.borderColor = "var(--success)";
        scenarioFeedback.classList.add('correct');
        feedbackVerdict.className = 'verdict correct';
        updateScore(s.category, s.points, s.points);
    } else {
        btn.style.background = "rgba(239, 68, 68, 0.2)";
        btn.style.borderColor = "var(--error)";
        scenarioFeedback.classList.add('incorrect');
        feedbackVerdict.className = 'verdict incorrect';
        updateScore(s.category, 0, s.points);
    }

    state.scenariosCompleted++;
    feedbackVerdict.innerText = opt.verdict;
    feedbackWhy.innerText = opt.why;
    feedbackStep.innerText = opt.step;
    
    scenarioFeedback.classList.remove('hidden');
    nextScenarioBtn.classList.remove('hidden');
}
