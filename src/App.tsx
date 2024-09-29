import { AppProviders } from "./AppProviders"
import MainVisualizer from "./components/MainVisualizer"

function App() {

  return (
   <AppProviders>
    <div className="min-h-screen w-full">

    <MainVisualizer/>
    </div>
   </AppProviders>
  )
}

export default App
