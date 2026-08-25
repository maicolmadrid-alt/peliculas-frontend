import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../services/api'

function Productoras() {
  const [productoras, setProductoras] = useState([])

  const [form, setForm] = useState({
    nombre: '',
    estado: 'Activo',
    slogan: '',
    descripcion: '',
  })

  const [editando, setEditando] = useState(null)

  const obtenerProductoras = async () => {
    try {
      const respuesta = await api.get('/productoras')

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : respuesta.data.productoras || respuesta.data.data || []

      setProductoras(datos)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar las productoras.',
      })
    }
  }

  useEffect(() => {
    obtenerProductoras()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      estado: 'Activo',
      slogan: '',
      descripcion: '',
    })

    setEditando(null)
  }

  const guardarProductora = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debes ingresar el nombre de la productora.',
      })

      return
    }

    try {
      if (editando) {
        await api.put(`/productoras/${editando}`, form)

        Swal.fire({
          icon: 'success',
          title: 'Actualizada',
          text: 'La productora fue actualizada correctamente.',
        })
      } else {
        await api.post('/productoras', form)

        Swal.fire({
          icon: 'success',
          title: 'Creada',
          text: 'La productora fue creada correctamente.',
        })
      }

      limpiarFormulario()
      obtenerProductoras()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'No fue posible guardar la productora.',
      })
    }
  }

  const editarProductora = (productora) => {
    setForm({
      nombre: productora.nombre || '',
      estado: productora.estado || 'Activo',
      slogan: productora.slogan || '',
      descripcion: productora.descripcion || '',
    })

    setEditando(productora._id)
  }

  const eliminarProductora = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar productora?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (!resultado.isConfirmed) {
      return
    }

    try {
      await api.delete(`/productoras/${id}`)

      Swal.fire({
        icon: 'success',
        title: 'Eliminada',
        text: 'La productora fue eliminada correctamente.',
      })

      obtenerProductoras()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text:
          error.response?.data?.message ||
          'La productora puede estar relacionada con una película o serie.',
      })
    }
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Productoras</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editando ? 'Editar productora' : 'Nueva productora'}
          </h5>

          <form onSubmit={guardarProductora}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>

              <input
                type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Estado</label>

              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Slogan</label>

              <input
                type="text"
                className="form-control"
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>

              <textarea
                className="form-control"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editando ? 'Actualizar' : 'Guardar'}
            </button>

            {editando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Listado de productoras</h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Slogan</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productoras.length > 0 ? (
                  productoras.map((productora) => (
                    <tr key={productora._id}>
                      <td>{productora.nombre}</td>
                      <td>{productora.estado}</td>
                      <td>{productora.slogan}</td>
                      <td>{productora.descripcion}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarProductora(productora)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProductora(productora._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay productoras registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Productoras