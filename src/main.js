import './styles/main.css';
import { initFormHandlers } from './scripts/form-handler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form modular logic
    initFormHandlers();

    // Floating Button Scroll Logic
    const floatingBtn = document.getElementById('floatingCTA');
    if (floatingBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                floatingBtn.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            } else {
                floatingBtn.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }
        });

        const ctaButton = floatingBtn.querySelector('button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
});
