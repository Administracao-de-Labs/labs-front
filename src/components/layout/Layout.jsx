import Header from './Header'
 
export default function Layout({ children, serverOnline }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header serverOnline={serverOnline} />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
 