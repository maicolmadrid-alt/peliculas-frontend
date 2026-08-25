import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import api from '../services/api'

function Medias() {
  const [medias, setMedias] = useState([])
  const [generos, setGeneros] = useState([])
  const [directores, setDirectores] = useState([])
  const [productoras, setProductoras] = useState([])
  const [tipos, setTipos] = useState([])

  const [form, setForm] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    url: '',
    imagen: '',
    anioEstreno: '',
    genero: '',
    director: '',
    productora: '',
    tipo: '',
  })

  const [editando, setEditando] = useState(null)

  const extraerDatos = (respuesta, propiedad) => {
    if (Array.isArray(respuesta.data)) {
      return respuesta.data
    }

    return respuesta.data[propiedad] || respuesta.data.data || []
  }

  const obtenerMedias = async () => {
    try {
      const respuesta = await api.get('/media')
      setMedias(extraerDatos(respuesta, 'medias'))
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar las películas y series.',
      })
    }
  }

  const obtenerCatalogos = async () => {
    try {
      const [
        respuestaGeneros,
        respuestaDirectores,
        respuestaProductoras,
        respuestaTipos,
      ] = await Promise.all([
        api.get('/generos'),
        api.get('/directores'),
        api.get('/productoras'),
        api.get('/tipos'),
      ])

      const listaGeneros = extraerDatos(respuestaGeneros, 'generos')
      const listaDirectores = extraerDatos(
        respuestaDirectores,
        'directores'
      )
      const listaProductoras = extraerDatos(
        respuestaProductoras,
        'productoras'
      )
      const listaTipos = extraerDatos(respuestaTipos, 'tipos')

      setGeneros(
        listaGeneros.filter((genero) => genero.estado === 'Activo')
      )

      setDirectores(
        listaDirectores.filter(
          (director) => director.estado === 'Activo'
        )
      )

      setProductoras(
        listaProductoras.filter(
          (productora) => productora.estado === 'Activo'
        )
      )

      setTipos(listaTipos)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No fue posible cargar los catálogos.',
      })
    }
  }

  useEffect(() => {
    obtenerMedias()
    obtenerCatalogos()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const limpiarFormulario = () => {
    setForm({
      serial: '',
      titulo: '',
      sinopsis: '',
      url: '',
      imagen: '',
      anioEstreno: '',
      genero: '',
      director: '',
      productora: '',
      tipo: '',
    })

    setEditando(null)
  }

  const guardarMedia = async (e) => {
    e.preventDefault()

    if (
      !form.serial ||
      !form.titulo ||
      !form.sinopsis ||
      !form.url ||
      !form.imagen ||
      !form.anioEstreno ||
      !form.genero ||
      !form.director ||
      !form.productora ||
      !form.tipo
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debes completar todos los campos.',
      })

      return
    }

    try {
      const datos = {
        ...form,
        anioEstreno: Number(form.anioEstreno),
      }

      if (editando) {
        await api.put(`/media/${editando}`, datos)

        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'La película o serie fue actualizada correctamente.',
        })
      } else {
        await api.post('/media', datos)

        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'La película o serie fue creada correctamente.',
        })
      }

      limpiarFormulario()
      obtenerMedias()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'No fue posible guardar la película o serie.',
      })
    }
  }

  const editarMedia = (media) => {
    setForm({
      serial: media.serial || '',
      titulo: media.titulo || '',
      sinopsis: media.sinopsis || '',
      url: media.url || '',
      imagen: media.imagen || '',
      anioEstreno: media.anioEstreno || '',

      genero:
        typeof media.genero === 'object'
          ? media.genero?._id || ''
          : media.genero || '',

      director:
        typeof media.director === 'object'
          ? media.director?._id || ''
          : media.director || '',

      productora:
        typeof media.productora === 'object'
          ? media.productora?._id || ''
          : media.productora || '',

      tipo:
        typeof media.tipo === 'object'
          ? media.tipo?._id || ''
          : media.tipo || '',
    })

    setEditando(media._id)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const eliminarMedia = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar registro?',
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
      await api.delete(`/media/${id}`)

      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El registro fue eliminado correctamente.',
      })

      obtenerMedias()
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.message ||
          'No fue posible eliminar el registro.',
      })
    }
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Películas y Series</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            {editando
              ? 'Editar película o serie'
              : 'Nueva película o serie'}
          </h5>

          <form onSubmit={guardarMedia}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Serial</label>

                <input
                  type="text"
                  className="form-control"
                  name="serial"
                  value={form.serial}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Título</label>

                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Sinopsis</label>

              <textarea
                className="form-control"
                name="sinopsis"
                value={form.sinopsis}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">URL</label>

                <input
                  type="url"
                  className="form-control"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Imagen</label>

                <input
                  type="url"
                  className="form-control"
                  name="imagen"
                  value={form.imagen}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Año de estreno
              </label>

              <input
                type="number"
                className="form-control"
                name="anioEstreno"
                value={form.anioEstreno}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Género</label>

                <select
                  className="form-select"
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccione un género
                  </option>

                  {generos.map((genero) => (
                    <option
                      key={genero._id}
                      value={genero._id}
                    >
                      {genero.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Director
                </label>

                <select
                  className="form-select"
                  name="director"
                  value={form.director}
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccione un director
                  </option>

                  {directores.map((director) => (
                    <option
                      key={director._id}
                      value={director._id}
                    >
                      {director.nombres}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Productora
                </label>

                <select
                  className="form-select"
                  name="productora"
                  value={form.productora}
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccione una productora
                  </option>

                  {productoras.map((productora) => (
                    <option
                      key={productora._id}
                      value={productora._id}
                    >
                      {productora.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo</label>

                <select
                  className="form-select"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option value="">
                    Seleccione un tipo
                  </option>

                  {tipos.map((tipo) => (
                    <option key={tipo._id} value={tipo._id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
            >
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

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">
            Listado de películas y series
          </h5>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Título</th>
                  <th>Año</th>
                  <th>Género</th>
                  <th>Director</th>
                  <th>Productora</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {medias.length > 0 ? (
                  medias.map((media) => (
                    <tr key={media._id}>
                      <td>{media.serial}</td>

                      <td>{media.titulo}</td>

                      <td>{media.anioEstreno}</td>

                      <td>
                        {media.genero?.nombre || '-'}
                      </td>

                      <td>
                        {media.director?.nombres || '-'}
                      </td>

                      <td>
                        {media.productora?.nombre || '-'}
                      </td>

                      <td>
                        {media.tipo?.nombre || '-'}
                      </td>

                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editarMedia(media)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            eliminarMedia(media._id)
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center"
                    >
                      No hay películas o series registradas.
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

export default Medias