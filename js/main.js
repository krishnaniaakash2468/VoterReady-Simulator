import { setupNavigation } from './navigation.js';
import { initEVM } from './evm.js';
import { initScenarios } from './scenarios.js';
import { initMyths } from './myths.js';
import { initChat } from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    setupNavigation();
    initEVM();
    initScenarios();
    initMyths();
    initChat();
});
