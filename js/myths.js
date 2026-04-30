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

export function initMyths() {
    const flashcardsContainer = document.getElementById('flashcards-container');
    if (!flashcardsContainer) return;

    flashcardsContainer.innerHTML = '';
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
}
