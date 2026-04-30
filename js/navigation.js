import { updateReadinessDashboard } from './ui.js';

export function setupNavigation() {
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
}
