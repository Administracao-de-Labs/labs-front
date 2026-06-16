import './machineCard.css'
import { Monitor, Terminal, Loader } from 'lucide-react'

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






