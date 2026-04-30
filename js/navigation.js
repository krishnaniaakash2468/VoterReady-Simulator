import { state } from './state.js';
import { updateReadinessDashboard } from './ui.js';

export function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const target = e.target.getAttribute('data-target');

            // --- Robust State Machine Enforcement ---
            if (target === 'evm' && state.voterState === 'IDLE') {
                alert("🔒 Please complete '🚨 Test Me' first to verify your identity before using the EVM.");
                return;
            }
            if (target === 'readiness' && state.voterState !== 'VOTE_CAST') {
                alert("🔒 Please cast your vote in the '🗳️ EVM Simulator' to see your final Readiness Score.");
                return;
            }

            document.getElementById(target).classList.add('active');
            
            if(target === 'readiness') updateReadinessDashboard();
            window.scrollTo(0, 0);
        });
    });
}
