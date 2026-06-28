// Atribui o endereço base do servidor de sockets por meio do ambiente Vite ou utiliza o loopback como segurança
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Busca a lista de clientes (máquinas dos laboratórios) conectados ao servidor.
 * @returns {Promise<Array>} Retorna uma promessa com o array de máquinas ativas.
 */
export async function listClients() {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/clients`);
        
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

/**
 * Envia uma requisição contendo um comando de shell para execução em uma máquina destino.
 * @param {string} event - O comando a ser executado na máquina (ex: whoami, ipconfig).
 * @param {string} channel - O UUID v4 correspondente à máquina de destino.
 * @returns {Promise<Object>} Retorna o resultado contendo o output gerado pelo terminal.
 */
export async function sendCommand(event, channel) {
    try {
        const response = await fetch(`${BASE_URL}/api/v1/events`, {
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
        return data;
    } catch (error) {
        console.error('Erro em sendCommand:', error);
        throw error;
    }
}