import { useEffect, useState, useCallback } from "react";
import {listClients, sendCommand} from "../services/api";

export function useMachine() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [runCommandLoading, setRunCommandLoading] = useState(false);
    const [runCommandResult, setRunCommandResult] = useState(null);

    const refreshClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listClients();
            setClients(data);
        } catch (err) {
            setError(err.message||'Erro ao buscar clientes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(refreshClients, 5000);
        refreshClients();
        return () => clearInterval(interval);
    }, [refreshClients]);

    const runWhoami = useCallback(async (channel) => {
        setRunCommandLoading(true);
        setRunCommandResult(null);
        try {
            const result = await sendCommand('whoami', channel);
            setRunCommandResult(result);
        } catch (err) {
            setRunCommandResult({ error: err.message || 'Erro ao executar comando' });
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