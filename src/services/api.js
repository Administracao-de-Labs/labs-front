// centraliza as chamadas http
const BASE_URL = 'http://localhost:4000';
// Desabilita timeout no frontend para testar a requisição sem cancelamento
const TIMEOUT_MS = 0;

// Helper para fazer requisições com timeout opcional
async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    let timeoutId;

    if (TIMEOUT_MS > 0) {
        timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    }

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        if (timeoutId) clearTimeout(timeoutId);
        return response;
    } catch (error) {
        if (timeoutId) clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Requisição expirou após ${TIMEOUT_MS / 1000}s. Verifique se o cliente está conectado ao servidor.`);
        }
        throw error;
    }
}

export async function listClients() {
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/api/v1/clients`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro em listClients:', error);
        throw error;
    }
}

export async function sendCommand(event, channel) {
    try {
        console.log('Enviando comando:', { event, channel });
        const response = await fetchWithTimeout(`${BASE_URL}/api/v1/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ event, channel })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Resultado do comando:', data);
        return data;
    } catch (error) {
        console.error('Erro em sendCommand:', error);
        throw error;
    }
}