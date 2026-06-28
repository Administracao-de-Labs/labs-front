import './machineList.css'
import { useMachine } from '../../hooks/useMachine'
import MachineCard from '../machineCard/machinesCard'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function MachineList() {
  // Extrai do hook customizado o array de clientes e as funções de execução remota
  const { clients, loading, error, refreshClients, runCustomCommand, runCommandLoading, runCommandResult } = useMachine()
  
  // Mapeia e distribui as respostas dos terminais de forma indexada pelo UUID da máquina escrava
  const [selectedMachineResult, setSelectedMachineResult] = useState({})

  // Repassa a string de comando manual ou atalho gerada pelo card de origem
  const handleRunCommand = (command, uuid) => {
    runCustomCommand(command, uuid)
    setSelectedMachineResult(prev => ({
      ...prev,
      [uuid]: null // Zera o output anterior do card alvo para indicar o estado de execução pendente
    }))
  }

  // Intercepta e vincula a resposta do barramento socket ao respectivo UUID solicitante
  useEffect(() => {
    if (runCommandResult && selectedMachineResult) {
      const lastUuid = Object.keys(selectedMachineResult).find(uuid => selectedMachineResult[uuid] === null)
      if (lastUuid) {
        setSelectedMachineResult(prev => ({
          ...prev,
          [lastUuid]: runCommandResult
        }))
      }
    }
  }, [runCommandResult]);

  return (
    <div className="machine-list">
      {/* Topo do painel: Métricas e botão de atualização assíncrona */}
      <div className="machine-list-header">
        <div>
          <h2 className="machine-list-title">Máquinas Conectadas</h2>
          <p className="machine-list-subtitle">
            {loading ? 'Carregando...' : `${clients.length} máquina${clients.length !== 1 ? 's' : ''} conectada${clients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={refreshClients}
          disabled={loading}
          className="refresh-button"
          title="Atualizar lista"
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Atualizar
        </button>
      </div>

      {/* Renderização de alertas de erro de conexão com a API */}
      {error && (
        <div className="error-container">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Renderização dos esqueletos visuais durante o carregamento de conexões em lote */}
      {loading && clients.length === 0 ? (
        <div className="machines-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="machine-skeleton">
              <div className="machine-skeleton-header">
                <div className="machine-skeleton-icon" />
                <div className="machine-skeleton-info">
                  <div className="machine-skeleton-line" style={{ width: '60%', height: '12px', marginBottom: '8px' }} />
                  <div className="machine-skeleton-line" style={{ width: '40%', height: '10px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : clients && clients.length > 0 ? (
        /* Renderização controlada da grade de computadores escravos ativos */
        <div className="machines-grid">
          {clients.map(machine => (
            <MachineCard
              key={machine.uuid}
              machine={machine}
              onRunCommand={handleRunCommand}
              loading={runCommandLoading}
              result={selectedMachineResult[machine.uuid]}
            />
          ))}
        </div>
      ) : (
        /* Container informativo exibido caso não hajam instâncias escravas registradas no servidor */
        <div className="empty-state">
          <p className="empty-state-text">Nenhuma máquina conectada</p>
          <p className="empty-state-subtext">Inicie o socket-client.php para conectar uma máquina</p>
        </div>
      )}
    </div>
  )
}