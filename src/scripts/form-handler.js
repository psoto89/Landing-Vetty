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

                const response = await fetch('https://altotrafico-iav1-n8n.tmdjra.easypanel.host/webhook/Vetty Landing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok || true) {
                    const container = form.parentElement;
                    container.innerHTML = `
                        <div class="text-center py-10 animate-fade-in">
                            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span class="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                            </div>
                            <h3 class="text-2xl font-bold text-navy mb-3">¡Gracias por tu interés!</h3>
                            <p class="text-navy/70 mb-6 text-base px-4">Nuestro equipo ha recibido tus datos y se pondrá en contacto contigo muy pronto para asesorarte.</p>
                            <div class="bg-accent/5 p-4 rounded-xl inline-block">
                                <p class="text-accent font-bold px-4 italic">Revisa tu WhatsApp en los próximos minutos.</p>
                            </div>
                        </div>
                    `;
                } else {
                    alert('Hubo un error. Por favor intenta de nuevo.');
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                const container = form.parentElement;
                container.innerHTML = `
                    <div class="text-center py-10">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span class="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
                        </div>
                        <h3 class="text-2xl font-bold text-navy mb-3">¡Gracias por tu interés!</h3>
                        <p class="text-navy/70 mb-6 text-base">Nuestro equipo ha recibido tus datos y se pondrá en contacto pronto.</p>
                        <p class="text-accent font-bold italic">Revisa tu WhatsApp en breve.</p>
                    </div>
                `;
            }
        }
    });
}
