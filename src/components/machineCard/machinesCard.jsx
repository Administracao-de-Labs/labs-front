import './machineCard.css'
import { Monitor, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

// Vincula o nome do sistema operacional recebido às classes CSS de estilização
const OS_COLORS = {
  Windows: 'os-badge windows',
  Linux: 'os-badge linux',
  Darwin: 'os-badge mac',
  macOS: 'os-badge mac',
}

// Renderiza o componente de identificação visual do sistema operacional
function OsCor({ os }) {
  const color = OS_COLORS[os] || 'os-badge default'
  return <span className={color}>{os}</span>
}

export default function MachineCard({ machine, onRunCommand, loading, result }) {
  const [copiedField, setCopiedField] = useState(null)

  // Move a cadeia de caracteres para a área de transferência do sistema operacional
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Define os sinalizadores lógicos para segmentação do ecossistema multiplataforma
  const isWindows = machine.operationSystem === 'Windows';
  const isMac = machine.operationSystem === 'Darwin' || machine.operationSystem === 'macOS';
  const isLinux = machine.operationSystem === 'Linux';

  // Define as instruções de rede, reinicialização e desligamento por plataforma
  const cmdNet = isWindows ? 'ipconfig' : (isMac ? 'ifconfig' : (isLinux ? 'ip a' : 'ip a'));
  const cmdReboot = isWindows ? 'shutdown /r /t 0' : (isMac ? 'sudo shutdown -r now' : (isLinux ? 'sudo reboot' : 'sudo reboot'));
  const cmdShutdown = isWindows ? 'shutdown /s /t 0' : (isMac ? 'sudo shutdown -h now' : (isLinux ? 'sudo poweroff' : 'sudo poweroff'));

  // Determina a rotina de extração do tempo de atividade do host de destino
  const cmdUptime = isWindows 
    ? 'powershell -Command "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime | Select-Object -Property Days, Hours, Minutes | Format-List"' 
    : (isMac ? 'uptime' : (isLinux ? 'uptime -p' : 'uptime'));
  
  // Mapeia a busca por sessões de usuários ativas concorrentes no terminal
  const cmdUsers = isWindows ? 'query user' : 'who';
  
  // Captura as especificações de hardware e versão do núcleo operacional
  const cmdHardware = isWindows 
    ? 'wmic os get Caption, Version /value && wmic computersystem get TotalPhysicalMemory /value' 
    : (isMac ? 'sw_vers && sysctl -n hw.memsize' : 'uname -sm && free -h | grep -E "(Mem|Total|..:)"');

  // Trata e limpa a resposta de saída do terminal contida na carga útil JSON
  const parseTerminalOutput = (rawResult) => {
    if (!rawResult) return '';
    
    if (typeof rawResult === 'object' && rawResult !== null) {
      return rawResult.output || rawResult.error || JSON.stringify(rawResult);
    }

    try {
      const parsed = JSON.parse(rawResult);
      return parsed.output || rawResult;
    } catch (e) {
      return rawResult;
    }
  };

  return (
    <div className="machine-card">
      {/* Cabeçalho informativo e identificação visual do SO */}
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

      {/* Detalhes de endereçamento do socket e UUID identificador */}
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

      {/* Seção 1 de Ações Rápidas: Comandos operacionais e de energia */}
      <div className="machine-quick-actions">
        <button 
          onClick={() => onRunCommand('whoami', machine.uuid)} 
          disabled={loading} 
          className="quick-action-btn"
        >
          Whoami
        </button>
        <button 
          onClick={() => onRunCommand(cmdNet, machine.uuid)} 
          disabled={loading} 
          className="quick-action-btn"
        >
          Rede ({isWindows ? 'Ipconfig' : (isMac ? 'Ifconfig' : 'IP')})
        </button>
        <button 
          onClick={() => { if(confirm(`Confirmar REINICIALIZAÇÃO de ${machine.hostname}?`)) onRunCommand(cmdReboot, machine.uuid) }} 
          disabled={loading} 
          className="quick-action-btn btn-warning"
        >
          Reiniciar
        </button>
        <button 
          onClick={() => { if(confirm(`Confirmar DESLIGAMENTO de ${machine.hostname}?`)) onRunCommand(cmdShutdown, machine.uuid) }} 
          disabled={loading} 
          className="quick-action-btn btn-danger"
        >
          Desligar
        </button>
      </div>

      {/* Seção 2 de Ações Rápidas: Diagnósticos Padronizados Visualmente */}
      <div className="machine-quick-actions">
        <button 
          onClick={() => onRunCommand(cmdUptime, machine.uuid)} 
          disabled={loading} 
          className="quick-action-btn"
          title="Verificar há quanto tempo a máquina está ligada"
        >
          Uptime
        </button>
        <button 
          onClick={() => onRunCommand(cmdUsers, machine.uuid)} 
          disabled={loading} 
          className="quick-action-btn"
          title="Listar sessões de usuários ativas no terminal"
        >
          Usuários
        </button>
        <button 
          onClick={() => onRunCommand(cmdHardware, machine.uuid)} 
          disabled={loading} 
          className="quick-action-btn"
          title="Obter resumo do hardware e versão operacional"
        >
          Hardware/SO
        </button>
      </div>

      {/* Bloco de terminal isolado para exibição e decodificação do resultado */}
      {result && (
        <div className="machine-card-result">
          <div className="result-header">
            <span className="result-label">📋 Output do Terminal:</span>
            <button
              onClick={() => copyToClipboard(parseTerminalOutput(result))}
              className="copy-result-button"
              title="Copiar resultado"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="result-output">{parseTerminalOutput(result)}</pre>
        </div>
      )}
    </div>
  )
}