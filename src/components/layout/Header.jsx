import { Server } from 'lucide-react'
 
export default function Header({ serverOnline = true }) {
  return (
    <header className="w-full border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <Server size={20} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-none">Commander</h1>
          <p className="text-xs text-gray-400 mt-0.5">Painel de controle do Laboratório</p>
        </div>
      </div>
 
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5">
        <span
          className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-green-500' : 'bg-gray-400'}`}
        />
        <span className="text-sm text-gray-700">
          {serverOnline ? 'Servidor Online' : 'Servidor Offline'}
        </span>
      </div>
    </header>
  )
}