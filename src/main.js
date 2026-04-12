import './styles/main.css';
import { initFormHandlers } from './scripts/form-handler.js';
import { initWhatsAppLinks } from './scripts/utm-helper.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar lógica del formulario
    initFormHandlers();

    // Inicializar botones de WhatsApp con URLs dinámicas + tracking
    initWhatsAppLinks(['waHeroForm', 'waCTA', 'waFloating']);
});
