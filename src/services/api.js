// centraliza as chamadas http
const BASE_URL = 'http://localhost:4000';

export async function listClients() {
    const response = await fetch(`${BASE_URL}/api/v1/clients`);
    if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
    }
    return response.json();
}

export async function sendCommand(event, channel) {
    const response = await fetch(`${BASE_URL}/api/v1/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ event, channel })
    });
    if (!response.ok) {
        throw new Error('Erro ao enviar comando');
    }
    return response.json();
}