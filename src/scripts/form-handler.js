import { getUTMs } from './utm-helper.js';

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

        // Cleanup previous errors
        form.querySelectorAll('input, select').forEach(el => el.classList.remove('border-red-500'));
        [phoneError, emailError].forEach(el => el.classList.add('hidden'));

        // Phone Validation
        const phoneClean = phoneInput.value.replace(/\s/g, '');
        if (phoneClean.length < 7) {
            phoneError.classList.remove('hidden');
            phoneInput.classList.add('border-red-500');
            isValid = false;
        }

        // Email Validation (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-red-500');
            isValid = false;
        }

        // Checkbox Validation
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            alert('Debes aceptar los Términos y Condiciones para continuar.');
        }

        // Selects Validation
        const petTypeSelect = document.getElementById('petTypeSelect');
        const needTypeSelect = document.getElementById('needTypeSelect');
        const petType = petTypeSelect?.value;
        const needType = needTypeSelect?.value;

        if (!petType || !needType) {
            isValid = false;
            if (!petType && petTypeSelect) petTypeSelect.classList.add('border-red-500');
            if (!needType && needTypeSelect) needTypeSelect.classList.add('border-red-500');
        }

        if (isValid) {
            const prefix = document.getElementById('phonePrefix').value;
            const formData = {
                fullName: form.querySelector('input[name="fullName"]').value,
                phone: `${prefix} ${phoneClean}`,
                email: emailInput.value,
                petType: petType,
                needType: needType,
                termsAccepted: true,
                utms: getUTMs(),
                timestamp: new Date().toISOString(),
                source: 'Vetty Landing Page'
            };

            try {
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span class="animate-spin inline-block">⏳</span> Enviando...';
                submitButton.disabled = true;

                const response = await fetch('https://altotrafico-iav1-n8n.tmdjra.easypanel.host/webhook/Vetty%20Landing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    window.location.href = '/thank-you.html';
                    return;
                } else {
                    alert('Hubo un error. Por favor intenta de nuevo.');
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión. Por favor intenta de nuevo.');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }
    });
}
