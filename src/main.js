import './styles/main.css';
import { initFormHandlers } from './scripts/form-handler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form modular logic
    initFormHandlers();

    // Floating Button logic removed as it should always be visible now
});
