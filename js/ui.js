import { state } from './state.js';

export function updateReadinessDashboard() {
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
