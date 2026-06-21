import './machineList.css'
import { useMachine } from '../../hooks/useMachine'
import MachineCard from '../machineCard/machinesCard'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function MachineList() {
  const { clients, loading, error, refreshClients, runWhoami, runCommandLoading, runCommandResult } = useMachine()
  const [selectedMachineResult, setSelectedMachineResult] = useState({})

  useEffect(() => {
    console.log('Componente MachineList - Clientes:', clients);
    console.log('Componente MachineList - Loading:', loading);
    console.log('Componente MachineList - Error:', error);
  }, [clients, loading, error]);

  const handleRunCommand = (command, uuid) => {
    runWhoami(uuid)
    setSelectedMachineResult(prev => ({
      ...prev,
      [uuid]: null
    }))
  }

  // Quando o resultado chega, salvar para a máquina específica
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

      {error && (
        <div className="error-container">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

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
        <div className="empty-state">
          <p className="empty-state-text">Nenhuma máquina conectada</p>
          <p className="empty-state-subtext">Inicie o socket-client.php para conectar uma máquina</p>
        </div>
      )}
    </div>
  )
}
