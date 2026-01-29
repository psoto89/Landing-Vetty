/**
 * Logic for capturing UTM parameters from the URL
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
