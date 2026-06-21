import { useEffect, useState, useCallback, useRef } from "react";
import {listClients, sendCommand} from "../services/api";

export function useMachine() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runCommandLoading, setRunCommandLoading] = useState(false);
    const [runCommandResult, setRunCommandResult] = useState(null);
    const intervalRef = useRef(null);

    const refreshClients = useCallback(async () => {
        // Não atualizar lista enquanto comando está em execução
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

    useEffect(() => {
        // Carregar clientes na primeira vez
        refreshClients();
        
        // Setup interval para atualizar a cada 5 segundos
        intervalRef.current = setInterval(refreshClients, 5000);
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refreshClients]);

    const runWhoami = useCallback(async (channel) => {
        setRunCommandLoading(true);
        setRunCommandResult(null);
        
        try {
            console.log('Executando comando whoami para:', channel);
            const result = await sendCommand('whoami', channel);
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
        runWhoami,
        runCommandLoading,
        runCommandResult
    };
}