import { state, updateScore, resetScore } from '../js/state.js';
import { initEVM } from '../js/evm.js';
import { initScenarios } from '../js/scenarios.js';
import { initChat } from '../js/chat.js';

let passed = 0;
let failed = 0;
const resultsDiv = document.getElementById('test-results');

function assert(condition, message) {
    const p = document.createElement('div');
    if (condition) {
        passed++;
        p.className = 'pass';
        p.innerHTML = `✅ PASS: ${message}`;
    } else {
        failed++;
        p.className = 'fail';
        p.innerHTML = `❌ FAIL: ${message}`;
        console.error(`Assertion failed: ${message}`);
    }
    resultsDiv.appendChild(p);
}

function runTests() {
    console.log("Starting VoterReady Unit Tests...");
    
    // --- 1. Test State Management (Flow of Voter) ---
    resetScore();
    assert(state.score === 0 && state.maxPossibleScore === 0, "[State] Initial score should be 0");
    
    updateScore('Booth Scenarios', 10, 10);
    assert(state.score === 10 && state.categories['Booth Scenarios'].earned === 10, "[State] Score should update correctly after a successful booth scenario");
    
    updateScore('Booth Scenarios', 0, 10);
    assert(state.score === 10 && state.maxPossibleScore === 20, "[State] Incorrect choice increases max points but not earned score");

    // --- 2. Test EVM Simulator (Successful Flow) ---
    initEVM();
    const voteBtns = document.querySelectorAll('.vote-btn');
    assert(voteBtns.length === 4, "[EVM] EVM module should initialize with exactly 4 fictional candidates");
    
    if(voteBtns.length > 0) {
        // Simulate casting a vote for the first candidate
        voteBtns[0].click();
        const status = document.getElementById('vvpat-status').innerText;
        assert(status === 'Printing...', "[EVM] EVM flow successfully starts printing sequence upon button press");
        
        // Assert other buttons are disabled immediately to prevent double voting
        const areOthersDisabled = Array.from(voteBtns).every(btn => btn.disabled === true);
        assert(areOthersDisabled, "[EVM] Edge Case: EVM disables all buttons immediately after one is pressed to prevent double voting");
    }

    // --- 3. Test Scenarios (Checking correct scenario loads) ---
    initScenarios();
    const scenarioText = document.getElementById('scenario-text').innerText;
    assert(scenarioText.includes('name is NOT on the voter list'), "[Scenarios] First scenario loads successfully");

    // --- 4. Test Chat Sanitization (Catching Invalid/Malicious Input) ---
    initChat();
    const chatInput = document.getElementById('custom-chat-input');
    const chatHistory = document.getElementById('chat-history');
    
    // Malicious injection attempt
    chatInput.value = "<script>alert('hacked')</script>";
    
    // Use the exposed global from initChat
    if(window.submitCustomChat) {
        window.submitCustomChat();
    }
    
    // The user's message gets appended immediately. Let's find the last user message.
    const userMsgs = chatHistory.querySelectorAll('.message.user');
    if (userMsgs.length > 0) {
        const lastUserMsg = userMsgs[userMsgs.length - 1];
        // The HTML should be escaped: &lt;script&gt;
        const sanitized = lastUserMsg.innerHTML.includes("&lt;script&gt;") && !lastUserMsg.innerHTML.includes("<script>");
        assert(sanitized, "[Security] Chat input validation successfully catches and sanitizes injected HTML/Scripts");
    } else {
        assert(false, "[Security] Chat message was not appended");
    }

    // --- 5. Test Google Maps Component (Accessibility & Presence) ---
    const mapIframe = document.querySelector('iframe[title="Polling Station Locator"]');
    assert(!!mapIframe, "[Google Ecosystem] Google Maps Embed component is present in the DOM");
    if(mapIframe) {
        const hasAria = mapIframe.getAttribute('aria-label') === 'Google Maps Polling Station';
        assert(hasAria, "[Accessibility] Google Maps iframe has correct ARIA label for screen readers");
    }

    // Summary
    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.innerText = `Tests Complete: ${passed} Passed, ${failed} Failed.`;
    if(failed === 0) {
        summary.style.color = '#10b981';
    } else {
        summary.style.color = '#ef4444';
    }
    resultsDiv.appendChild(summary);
}

// Start tests after small delay to ensure DOM is ready
setTimeout(runTests, 100);
