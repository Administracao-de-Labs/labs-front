import { useEffect, useState, useCallback, useRef } from "react";
import { listClients, sendCommand } from "../services/api";

/**
 * Hook customizado para gerenciamento do ciclo de vida, polling e execução de ações rápidas nas máquinas.
 */
export function useMachine() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runCommandLoading, setRunCommandLoading] = useState(false);
    const [runCommandResult, setRunCommandResult] = useState(null);
    const intervalRef = useRef(null);

    // Solicita a atualização cadastral do pool de computadores ativos
    const refreshClients = useCallback(async () => {
        if (runCommandLoading) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await listClients();
            console.log('Clientes recebidos:', data);
            setClients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
            setError(err.message || 'Erro ao buscar clientes');
            setClients([]);
        } finally {
            setLoading(false);
        }
    }, [runCommandLoading]);

    // Estabelece o mecanismo de polling contínuo a cada 5 segundos
    useEffect(() => {
        refreshClients();
        
        intervalRef.current = setInterval(refreshClients, 5000);
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refreshClients]);

    // Executa as ações predefinidas enviando a carga útil para o barramento da VPS
    const runCustomCommand = useCallback(async (command, channel) => {
        setRunCommandLoading(true);
        setRunCommandResult(null);
        
        try {
            console.log(`Executando comando ${command} para:`, channel);
            const result = await sendCommand(command, channel);
            console.log('Resultado recebido:', result);
            setRunCommandResult(result);
        } catch (err) {
            console.error('Erro ao executar comando:', err);
            // Mostrar erro de forma mais legível
            const errorMessage = err.message || 'Erro desconhecido ao executar comando';
            setRunCommandResult({ 
                error: errorMessage,
                output: `❌ Erro: ${errorMessage}`
            });
        } finally {
            setRunCommandLoading(false);
        }
    }, []);

    return {
        clients,
        loading,
        error,
        refreshClients,
        runCustomCommand,
        runCommandLoading,
        runCommandResult
    };
}