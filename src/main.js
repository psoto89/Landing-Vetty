import './styles/main.css';
import { initFormHandlers } from './scripts/form-handler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form modular logic
    initFormHandlers();

    // Floating Button Scroll Logic (throttled for performance)
    const floatingBtn = document.getElementById('floatingCTA');
    if (floatingBtn) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 200) {
                        floatingBtn.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
                    } else {
                        floatingBtn.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});
