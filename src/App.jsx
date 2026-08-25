import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Generos from './pages/Generos'
import Directores from './pages/Directores'
import Productoras from './pages/Productoras'
import Tipos from './pages/Tipos'
import Medias from './pages/Medias'

function App() {
  return (
    <Router>
      <Navbar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/generos" component={Generos} />
        <Route path="/directores" component={Directores} />
        <Route path="/productoras" component={Productoras} />
        <Route path="/tipos" component={Tipos} />
        <Route path="/medias" component={Medias} />
      </Switch>
    </Router>
  )
}

export default App