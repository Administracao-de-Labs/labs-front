import './machineCard.css'
import { Monitor, Terminal, Loader, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const OS_COLORS = {
  Windows: 'os-badge windows',
  Linux: 'os-badge linux',
  Darwin: 'os-badge mac',
  macOS: 'os-badge mac',
}

function OsCor({ os }) {
  const color = OS_COLORS[os] || 'os-badge default'
  return (
    <span className={color}>
      {os}
    </span>
  )
}

export default function MachineCard({ machine, onRunCommand, loading, result }) {
  const [copiedField, setCopiedField] = useState(null)
  const [command, setCommand] = useState('whoami')

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleRunCommand = () => {
    if (command.trim()) {
      onRunCommand(command, machine.uuid)
      setCommand('whoami')
    }
  }

  return (
    <div className="machine-card">
      <div className="machine-card-header">
        <div className="machine-card-icon">
          <Monitor size={24} className="text-blue-600" />
        </div>
        <div className="machine-card-info">
          <h3 className="machine-card-hostname">{machine.hostname}</h3>
          <p className="machine-card-username">@{machine.username}</p>
        </div>
        <OsCor os={machine.operationSystem} />
      </div>

      <div className="machine-card-details">
        <div className="detail-item">
          <span className="detail-label">Identificador:</span>
          <div className="detail-value-with-copy">
            <code className="detail-value">{machine.uuid}</code>
            <button
              onClick={() => copyToClipboard(machine.uuid, 'uuid')}
              className="copy-button"
              title="Copiar UUID completo"
            >
              {copiedField === 'uuid' ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-label">Endereço:</span>
          <div className="detail-value-with-copy">
            <code className="detail-value">{machine.ip}:{machine.port}</code>
            <button
              onClick={() => copyToClipboard(`${machine.ip}:${machine.port}`, 'address')}
              className="copy-button"
              title="Copiar endereço"
            >
              {copiedField === 'address' ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="machine-card-command">
        <div className="command-input-wrapper">
          <Terminal size={18} className="command-icon" />
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Digite um comando..."
            className="command-input"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleRunCommand()}
          />
        </div>
        <button
          onClick={handleRunCommand}
          disabled={loading}
          className="command-button"
        >
          {loading ? (
            <>
              <Loader size={16} className="spinning" />
              Executando...
            </>
          ) : (
            'Executar'
          )}
        </button>
      </div>

      {result && (
        <div className="machine-card-result">
          <div className="result-header">
            <span className="result-label">📋 Output:</span>
            <button
              onClick={() => copyToClipboard(result.output || JSON.stringify(result))}
              className="copy-result-button"
              title="Copiar resultado"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="result-output">{result.output || JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}






