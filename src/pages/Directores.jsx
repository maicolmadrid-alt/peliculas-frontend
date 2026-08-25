import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../services/api'

function Directores() {
  const [directores, setDirectores] = useState([])

  const [form, setForm] = useState({
    nombres: '',
    estado: 'Activo',
  })

  const [editando, setEditando] = useState(null)

  const obtenerDirectores = async () => {
    try {
      const respuesta = await api.get('/directores')

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : respuesta.data.directores || respuesta.data.data || []

      setDirectores(datos)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar los directores.',
      })
    }
  }

  useEffect(() => {
    obtenerDirectores()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const limpiarFormulario = () => {
    setForm({
      nombres: '',
      estado: 'Activo',
    })

    setEditando(null)
  }

  const guardarDirector = async (e) => {
    e.preventDefault()

    if (!form.nombres.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debes ingresar el nombre del director.',
      })

      return
    }

    try {
      if (editando) {
        await api.put(`/directores/${editando}`, form)

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El director fue actualizado correctamente.',
        })
      } else {
        await api.post('/directores', form)

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El director fue creado correctamente.',
        })
      }

      limpiarFormulario()
      obtenerDirectores()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'No fue posible guardar el director.',
      })
    }
  }

  const editarDirector = (director) => {
    setForm({
      nombres: director.nombres || '',
      estado: director.estado || 'Activo',
    })

    setEditando(director._id)
  }

  const eliminarDirector = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar director?',
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
      await api.delete(`/directores/${id}`)

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El director fue eliminado correctamente.',
      })

      obtenerDirectores()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text:
          error.response?.data?.message ||
          'El director puede estar relacionado con una película o serie.',
      })
    }
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Directores</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editando ? 'Editar director' : 'Nuevo director'}
          </h5>

          <form onSubmit={guardarDirector}>
            <div className="mb-3">
              <label className="form-label">Nombres</label>

              <input
                type="text"
                className="form-control"
                name="nombres"
                value={form.nombres}
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
          <h5 className="card-title">Listado de directores</h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {directores.length > 0 ? (
                  directores.map((director) => (
                    <tr key={director._id}>
                      <td>{director.nombres}</td>
                      <td>{director.estado}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarDirector(director)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarDirector(director._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay directores registrados.
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

export default Directores