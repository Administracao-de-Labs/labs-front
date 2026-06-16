// centraliza as chamadas http
BASE_URL = 'http://localhost:4000';

export async function listClients() {
    const response = await fetch(`${BASE_URL}/api/v1/clients`);
    if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
    }
    return response.json();
}

