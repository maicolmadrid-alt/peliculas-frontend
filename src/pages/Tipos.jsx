import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../services/api'

function Tipos() {
  const [tipos, setTipos] = useState([])

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
  })

  const [editando, setEditando] = useState(null)

  const obtenerTipos = async () => {
    try {
      const respuesta = await api.get('/tipos')

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : respuesta.data.tipos || respuesta.data.data || []

      setTipos(datos)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar los tipos.',
      })
    }
  }

  useEffect(() => {
    obtenerTipos()
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
      descripcion: '',
    })

    setEditando(null)
  }

  const guardarTipo = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debes ingresar el nombre del tipo.',
      })

      return
    }

    try {
      if (editando) {
        await api.put(`/tipos/${editando}`, form)

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El tipo fue actualizado correctamente.',
        })
      } else {
        await api.post('/tipos', form)

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El tipo fue creado correctamente.',
        })
      }

      limpiarFormulario()
      obtenerTipos()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'No fue posible guardar el tipo.',
      })
    }
  }

  const editarTipo = (tipo) => {
    setForm({
      nombre: tipo.nombre || '',
      descripcion: tipo.descripcion || '',
    })

    setEditando(tipo._id)
  }

  const eliminarTipo = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar tipo?',
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
      await api.delete(`/tipos/${id}`)

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El tipo fue eliminado correctamente.',
      })

      obtenerTipos()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text:
          error.response?.data?.message ||
          'El tipo puede estar relacionado con una película o serie.',
      })
    }
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Tipos</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editando ? 'Editar tipo' : 'Nuevo tipo'}
          </h5>

          <form onSubmit={guardarTipo}>
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
          <h5 className="card-title">Listado de tipos</h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {tipos.length > 0 ? (
                  tipos.map((tipo) => (
                    <tr key={tipo._id}>
                      <td>{tipo.nombre}</td>
                      <td>{tipo.descripcion}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarTipo(tipo)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarTipo(tipo._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay tipos registrados.
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

export default Tipos