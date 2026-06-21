import Layout from './components/layout/Layout'
import MachineList from './components/machineList/machineList'

export default function App() {
  return (
    <Layout serverOnline={true}>
      <MachineList />
    </Layout>
  )
}