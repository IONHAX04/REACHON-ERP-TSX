import { HashRouter as Router } from 'react-router-dom'
import './index.css'

import MainRoutes from './components/00-MainRoutes/MainRoutes'

function App(): JSX.Element {
  return (
    <>
      <Router>
        <MainRoutes />
      </Router>
    </>
  )
}

export default App
