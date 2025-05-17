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

  try {
    // Convertir a mayúsculas
    const nombre = body.nombre.toUpperCase();

    // Verificar si el grupo ya existe
    const grupomultimediaDB = await GrupoMultimedia.findOne({ nombre });

    if (grupomultimediaDB) {
      return res.status(400).json({
        Ok: false,
        msg: `El grupo multimedia ${nombre} ya existe`
      });
    }

    // Generar la data a guardar
    const data = {
      nombre,
      fecha_actualizacion: null
    };

    const grupomultimedia = new GrupoMultimedia(data);

    // Guardar en la base de datos
    await grupomultimedia.save();

    console.log('Grupo multimedia created successfully:', grupomultimedia);
    res.status(201).json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    console.error('Error in crearGrupoMultimedia:', error);
    res.status(500).json({ 
      Ok: false, 
      msg: 'Error al crear grupo multimedia', 
      resp: error.message 
    });
  }
};

const actualizarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  console.log('actualizarGrupoMultimedia endpoint called');
  console.log('ID:', id);
  console.log('Request body:', req.body);
  console.log('Data to update:', data);

  try {
    // Verificar si el ID es válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        Ok: false, 
        msg: 'ID no válido',
        resp: `El ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    // Verificar si el grupo multimedia existe
    const grupoExistente = await GrupoMultimedia.findById(id);
    if (!grupoExistente) {
      return res.status(404).json({
        Ok: false,
        msg: `No se encontró un grupo multimedia con el ID ${id}`
      });
    }

    // Si se actualiza el nombre, verificar que no exista otro grupo con ese nombre
    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();
      console.log('Nombre normalizado:', data.nombre);

      // Verificar si existe otro grupo con el mismo nombre pero diferente ID
      const grupomultimediaDB = await GrupoMultimedia.findOne({
        nombre: data.nombre,
        _id: { $ne: id } // Excluir el grupo actual
      });

      if (grupomultimediaDB) {
        return res.status(400).json({
          Ok: false,
          msg: `Ya existe un grupo multimedia con el nombre ${data.nombre}`
        });
      }
    } else {
      return res.status(400).json({
        Ok: false,
        msg: 'El nombre es obligatorio para actualizar'
      });
    }    // Agregar fecha de actualización
    data.fecha_actualizacion = new Date();

    console.log('Data being sent to update:', data);

    try {
      // Actualizar el grupo multimedia
      const grupomultimedia = await GrupoMultimedia.findByIdAndUpdate(
        id, 
        data, 
        { new: true, runValidators: true } // Devolver el documento actualizado y ejecutar validadores
      );

      if (!grupomultimedia) {
        return res.status(404).json({
          Ok: false,
          msg: `No se pudo actualizar el grupo multimedia con ID ${id}`
        });
      }

      console.log('Grupo multimedia updated successfully:', grupomultimedia);
      return res.json({ Ok: true, resp: grupomultimedia });
    } catch (dbError) {
      console.error('Error in database update operation:', dbError);
      return res.status(500).json({ 
        Ok: false, 
        msg: 'Error en la operación de actualización en la base de datos', 
        resp: dbError.message 
      });
    }
  } catch (error) {
    console.error('Error in actualizarGrupoMultimedia:', error);
    return res.status(500).json({ 
      Ok: false, 
      msg: 'Error al actualizar el grupo multimedia', 
      resp: error.message 
    });
  }
};

const borrarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  
  console.log('borrarGrupoMultimedia endpoint called');
  console.log('ID:', id);
  
  try {
    // Verificar si el ID es válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        Ok: false, 
        msg: 'ID no válido',
        resp: `El ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    // Verificar si el grupo multimedia existe
    const grupoExistente = await GrupoMultimedia.findById(id);
    if (!grupoExistente) {
      return res.status(404).json({
        Ok: false,
        msg: `No se encontró un grupo multimedia con el ID ${id}`
      });
    }
    
    // Marcar como inactivo (borrado lógico)
    const grupomultimediaBorrada = await GrupoMultimedia.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: new Date() },
      { new: true }
    );

    console.log('Grupo multimedia deleted successfully:', grupomultimediaBorrada);
    res.json({ Ok: true, resp: grupomultimediaBorrada });
  } catch (error) {
    console.error('Error in borrarGrupoMultimedia:', error);
    res.status(500).json({ 
      Ok: false, 
      msg: 'Error al eliminar el grupo multimedia', 
      resp: error.message 
    });
  }
};

module.exports = {
  crearGrupoMultimedia,
  obtenerGrupoMultimedias,
  obtenerGrupoMultimedia,
  actualizarGrupoMultimedia,
  borrarGrupoMultimedia,
};