const { response } = require("express");
const { GrupoMultimedia } = require("../models");
const { now } = require("mongoose");

const obtenerGrupoMultimedias = async (req, res = response) => {
  console.log('obtenerGrupoMultimedias endpoint called');
  console.log('Query params:', req.query);
  
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    console.log('Ejecutando consulta con parámetros:', { query, limite, desde });
    const [total, grupomultimedias] = await Promise.all([
      GrupoMultimedia.countDocuments(query),
      GrupoMultimedia.find(query)
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    console.log(`Encontrados ${total} grupos multimedia`);
    res.json({ Ok: true, total: total, resp: grupomultimedias });
  } catch (error) {
    console.error('Error en obtenerGrupoMultimedias:', error);
    res.status(500).json({ Ok: false, msg: 'Error al obtener grupos multimedia', resp: error.message });
  }
};

const obtenerGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;

  console.log('obtenerGrupoMultimedia called with id:', id);

  try {
    // Validar que id sea un ObjectId de MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        Ok: false, 
        msg: 'ID no válido',
        resp: `El ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    const grupomultimedia = await GrupoMultimedia.findById(id);
    
    if (!grupomultimedia) {
      return res.status(404).json({ 
        Ok: false, 
        msg: 'Grupo multimedia no encontrado',
        resp: `No se encontró un grupo multimedia con el id ${id}`
      });
    }

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    console.error('Error en obtenerGrupoMultimedia:', error);
    res.status(500).json({ 
      Ok: false, 
      msg: 'Error al obtener grupo multimedia',
      resp: error.message
    });
  }
};

const crearGrupoMultimedia = async (req, res = response) => {
  console.log('crearGrupoMultimedia endpoint called');
  console.log('Request body:', req.body);
  
  const { estado, ...body } = req.body;

  if (!body.nombre) {
    return res.status(400).json({
      Ok: false,
      msg: 'El nombre es obligatorio'
    });
  }

  body.nombre = body.nombre.toUpperCase();

  try {
    //Verifica si la categoria existe
    const grupomultimediaDB = await GrupoMultimedia.findOne({
      nombre: body.nombre,
    });

    if (grupomultimediaDB) {
      return res.status(400).json({
        Ok: false,
        msg: `El grupomultimedia ${body.nombre}, ya existe`,
      });
    }    //Pasa a mayuscula el dato de la categoria
    const nombre = req.body.nombre.toUpperCase();

    // Generar la data a guardar
    const data = {
      nombre,
      fecha_actualizacion: null,
    };

    const grupomultimedia = new GrupoMultimedia(data);

    // Guardar DB
    await grupomultimedia.save();

    console.log('Grupo multimedia created successfully:', grupomultimedia);
    res.status(201).json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    console.error('Error in crearGrupoMultimedia:', error);
    res.status(500).json({ Ok: false, msg: 'Error al crear grupo multimedia', resp: error.message });
  }
};

const actualizarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  try {
    //Verifica el cambio de Grupo Categoria
    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();

      //Verifica si la categoria existe
      const grupomultimediaDB = await GrupoMultimedia.findOne({
        nombre: data.nombre,
      });

      if (grupomultimediaDB) {
        return res.status(400).json({
          msg: `La categoria ${data.nombre}, ya existe`,
        });
      }
    }

    data.usuario = req.usuario._id;
    data.fecha_actualizacion = now();

    const grupomultimedia = await GrupoMultimedia.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const borrarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  try {
    const grupomultimediaBorrada = await GrupoMultimedia.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );

    res.json({ Ok: true, resp: grupomultimediaBorrada });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  crearGrupoMultimedia,
  obtenerGrupoMultimedias,
  obtenerGrupoMultimedia,
  actualizarGrupoMultimedia,
  borrarGrupoMultimedia,
};
