import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Películas y Series
        </Link>

        <div className="navbar-nav">
          <Link className="nav-link" to="/generos">
            Géneros
          </Link>

          <Link className="nav-link" to="/directores">
            Directores
          </Link>

          <Link className="nav-link" to="/productoras">
            Productoras
          </Link>

          <Link className="nav-link" to="/tipos">
            Tipos
          </Link>

          <Link className="nav-link" to="/medias">
            Media
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar