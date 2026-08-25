import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../services/api'

function Generos() {
  const [generos, setGeneros] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    estado: 'Activo',
    descripcion: '',
  })

  const [editando, setEditando] = useState(null)

  const obtenerGeneros = async () => {
    try {
      const respuesta = await api.get('/generos')

      const datos = Array.isArray(respuesta.data)
        ? respuesta.data
        : respuesta.data.generos || respuesta.data.data || []

      setGeneros(datos)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar los géneros.',
      })
    }
  }

  useEffect(() => {
    obtenerGeneros()
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
      descripcion: '',
    })

    setEditando(null)
  }

  const guardarGenero = async (e) => {
    e.preventDefault()

    if (!form.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debes ingresar el nombre del género.',
      })

      return
    }

    try {
      if (editando) {
        await api.put(`/generos/${editando}`, form)

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El género fue actualizado correctamente.',
        })
      } else {
        await api.post('/generos', form)

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'El género fue creado correctamente.',
        })
      }

      limpiarFormulario()
      obtenerGeneros()
    } catch (error) {
      console.error(error)
      

      const mensajeError =
        error.response?.data?.errors?.[0]?.message
        error.response?.data?.message ||
        error.response?.data?.error ||
        'No fue posible guardar el género.'

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeError,
        })
    }
  }

  const editarGenero = (genero) => {
    setForm({
      nombre: genero.nombre || '',
      estado: genero.estado || 'Activo',
      descripcion: genero.descripcion || '',
    })

    setEditando(genero._id)
  }

  const eliminarGenero = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar género?',
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
      await api.delete(`/generos/${id}`)

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El género fue eliminado correctamente.',
      })

      obtenerGeneros()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'No se puede eliminar',
        text:
          error.response?.data?.message ||
          'El género puede estar siendo utilizado por una película o serie.',
      })
    }
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Géneros</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editando ? 'Editar género' : 'Nuevo género'}
          </h5>

          <form onSubmit={guardarGenero}>
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
          <h5 className="card-title">Listado de géneros</h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {generos.length > 0 ? (
                  generos.map((genero) => (
                    <tr key={genero._id}>
                      <td>{genero.nombre}</td>
                      <td>{genero.estado}</td>
                      <td>{genero.descripcion}</td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarGenero(genero)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarGenero(genero._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay géneros registrados.
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

export default Generos