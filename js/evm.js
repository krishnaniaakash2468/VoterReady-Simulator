import { state, updateScore } from './state.js';

const fictionalCandidates = [
    { serial: 1, name: "Arjun Verma", symbol: "🍎" },
    { serial: 2, name: "Priya Sharma", symbol: "🚲" },
    { serial: 3, name: "Ravi Kumar", symbol: "☂️" },
    { serial: 4, name: "NOTA", symbol: "❌" }
];

let hasVoted = false;

export function initEVM() {
    const candidateList = document.getElementById('candidate-list');
    if (!candidateList) return;

    candidateList.innerHTML = '';
    fictionalCandidates.forEach((c, index) => {
        const row = document.createElement('div');
        row.className = 'candidate-row';
        row.innerHTML = `
            <div class="c-serial">${c.serial}</div>
            <div class="c-name">${c.name}</div>
            <div class="c-symbol">${c.symbol}</div>
            <div class="c-led" id="led-${index}"></div>
            <button class="vote-btn" data-index="${index}"></button>
        `;
        candidateList.appendChild(row);
    });

    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            castVote(index);
        });
    });

    // Make reset available globally if needed for button
    window.resetEVM = resetEVM;
}

function castVote(index) {
    if(hasVoted) return;
    hasVoted = true;
    
    // Disable all buttons
    document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
    
    // Turn on LED
    document.getElementById(`led-${index}`).classList.add('active');
    
    // Play Beep
    const beep = document.getElementById('beep-sound');
    if(beep) beep.play().catch(e => console.log("Audio play blocked by browser", e));
    
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
            updateScore('EVM Knowledge', 10, 10);
            state.voterState = 'VOTE_CAST';
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
