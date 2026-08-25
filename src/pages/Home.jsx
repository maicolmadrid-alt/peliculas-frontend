function Home() {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1>Gestión de Películas y Series</h1>

        <p className="lead">
          Aplicación web desarrollada con ReactJs para la gestión de
          información de películas y series mediante una API REST.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Géneros</h5>
              <p className="card-text">
                Administración de los géneros utilizados para clasificar
                películas y series.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Directores</h5>
              <p className="card-text">
                Registro y actualización de los directores asociados a las
                producciones.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Productoras</h5>
              <p className="card-text">
                Gestión de las compañías productoras de contenido
                audiovisual.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Tipos</h5>
              <p className="card-text">
                Administración de los tipos de contenido registrados en el
                sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Películas y Series</h5>
              <p className="card-text">
                Gestión de producciones relacionando género, director,
                productora y tipo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home