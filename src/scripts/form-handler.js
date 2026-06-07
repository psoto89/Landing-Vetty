import { getUTMs } from './utm-helper.js';

const WEBHOOK_URL = 'https://crm.vetty.vet/api/webhooks/leads?token=bda5a4a27a5f42cb99e57f6b46045d610ce43442119a4af6960c2a331516817d';
const WHATSAPP_FALLBACK = 'https://wa.me/573117113874';

export function initFormHandlers() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    const phoneInput = form.querySelector('input[name="phone"]');
    const phoneError = document.getElementById('phoneError');
    const emailInput = document.getElementById('emailInput');
    const emailError = document.getElementById('emailError');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let isValid = true;

        // Limpiar errores previos
        form.querySelectorAll('input, select').forEach(el => el.classList.remove('border-red-500'));
        [phoneError, emailError].forEach(el => el.classList.add('hidden'));

        // Validar teléfono
        const phoneClean = phoneInput.value.replace(/\s/g, '');
        if (phoneClean.length < 7) {
            phoneError.classList.remove('hidden');
            phoneInput.classList.add('border-red-500');
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-red-500');
            isValid = false;
        }

        // Validar checkbox de términos
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            alert('Debes aceptar los Términos y Condiciones para continuar.');
        }

        // Validar selects
        const petTypeSelect = document.getElementById('petTypeSelect');
        const needTypeSelect = document.getElementById('needTypeSelect');
        const petType = petTypeSelect?.value;
        const need = needTypeSelect?.value;

        if (!petType || !need) {
            isValid = false;
            if (!petType && petTypeSelect) petTypeSelect.classList.add('border-red-500');
            if (!need && needTypeSelect) needTypeSelect.classList.add('border-red-500');
        }

        if (!isValid) return;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = '⏳ Enviando...';
        submitButton.disabled = true;

        const prefix = document.getElementById('phonePrefix').value;
        const utms = getUTMs();

        const payload = {
            fullName: form.querySelector('input[name="fullName"]').value.trim(),
            phone: `${prefix}${phoneClean}`,
            email: emailInput.value.trim(),
            petType,
            need,
            terms: true,
            utm_source: utms.source || 'direct',
            utm_medium: utms.medium || '',
            utm_campaign: utms.campaign || '',
            utm_content: utms.content || '',
            utm_term: utms.term || '',
            page_url: window.location.href,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Disparar pixels solo en éxito
                if (typeof fbq === 'function') {
                    fbq('track', 'Lead');
                }
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead');
                }

                // Mostrar mensaje de éxito inline
                _showSuccess();
            } else {
                _showError();
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error('[form-handler] Error al enviar formulario:', error);
            _showError();
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    });
}

function _showSuccess() {
    const formEl = document.getElementById('consultationForm');
    const titleEl = document.getElementById('formTitle');
    const subtitleEl = document.getElementById('formSubtitle');
    const successEl = document.getElementById('formSuccess');

    if (formEl) formEl.classList.add('hidden');
    if (titleEl) titleEl.classList.add('hidden');
    if (subtitleEl) subtitleEl.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');
}

function _showError() {
    const errorEl = document.getElementById('formError');
    if (errorEl) errorEl.classList.remove('hidden');
}
