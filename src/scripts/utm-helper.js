/**
 * Captura parámetros UTM desde la URL actual
 */
export function getUTMs() {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
        content: params.get('utm_content') || '',
        term: params.get('utm_term') || '',
        full_url: window.location.href
    };
}

/**
 * Construye la URL de WhatsApp con mensaje que incluye la fuente de tráfico UTM
 * @param {string} baseMessage - Mensaje base sin contexto UTM
 * @returns {string} URL completa de WhatsApp
 */
export function buildWhatsAppUrl(baseMessage = 'Hola! Quiero iniciar una consulta.') {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');
    const campaign = params.get('utm_campaign');
    const medium = params.get('utm_medium');

    let message = baseMessage;

    // Añadir contexto de fuente si existe
    if (source || campaign) {
        const parts = [source, medium, campaign].filter(Boolean);
        message += ` [Fuente: ${parts.join('/')}]`;
    }

    return `https://wa.me/573117113874?text=${encodeURIComponent(message)}`;
}

/**
 * Inicializa todos los botones de WhatsApp con URLs dinámicas y tracking de eventos
 * @param {string[]} ids - Array de IDs de los elementos anchor de WhatsApp
 */
export function initWhatsAppLinks(ids) {
    const baseMessage = 'Hola! Quiero iniciar una consulta inmediata con un asesor de ventas o veterinario.';
    const url = buildWhatsAppUrl(baseMessage);

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.href = url;

        el.addEventListener('click', () => {
            if (typeof fbq === 'function') {
                fbq('track', 'Contact', { content_name: 'whatsapp_click' });
            }
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', { event_category: 'conversion' });
            }
        });
    });
}
