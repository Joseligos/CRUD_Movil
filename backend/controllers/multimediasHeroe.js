const { response } = require("express");
const { MultimediaHeroe } = require("../models");

//const { isValidObjectId } = require("../helpers/mongo-verify");
//const { now } = require("mongoose");


const obtenerMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      const multimediaHeroe = await MultimediaHeroe.findById(id)
        //.populate("usuario", "nombre")
        //.populate("IdGrupoMultimedia", "nombre");
  
        res.json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }
  };

const obtenerMultimediasPorHeroe = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      const multimediasHeroe = await MultimediaHeroe.find({ IdHeroe: id })
        .populate("IdMultimedia", "url")
        .populate("IdHeroe", "nombre");
  
        res.json({ Ok: true, resp: multimediasHeroe });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }
  };

// Método para obtener todos los registros
const obtenerMultimediasHeroes = async (req, res = response) => {
  const { limite = 10, desde = 0 } = req.query;
  const query = {};

  try {
    console.log('GET /api/multimediasheroe - Obteniendo lista de asociaciones multimedia-héroe');
    
    const [total, multimediasHeroe] = await Promise.all([
      MultimediaHeroe.countDocuments(query),
      MultimediaHeroe.find(query)
        .populate("IdMultimedia", "url")
        .populate("IdHeroe", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    console.log(`Se encontraron ${total} asociaciones multimedia-héroe`);
    
    res.json({ Ok: true, total, resp: multimediasHeroe });
  } catch (error) {
    console.error('Error en obtenerMultimediasHeroes:', error);
    res.status(500).json({ Ok: false, msg: "Error al obtener multimedias heroes", error });
  }
};


const crearMultimediaHeroe = async (req, res = response) => {
    const { estado, ...body } = req.body;

    try {
        console.log('POST /api/multimediasheroe - Creando nueva asociación multimedia-héroe');
        console.log('Datos recibidos:', body);
        
        const multimediaHeroeDB = await MultimediaHeroe.findOne({ IdHeroe: body.IdHeroe, IdMultimedia: body.IdMultimedia });

        if (multimediaHeroeDB) {
            console.log('Error: La asociación ya existe para este héroe y multimedia');
            return res.status(400).json({
                msg: `La multimedia, ya existe para este Heroe`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
            //usuario: req.usuario._id,
        };

        const multimediaHeroe = new MultimediaHeroe(data);

        // Guardar DB
        await multimediaHeroe.save();
        console.log('Asociación creada correctamente con ID:', multimediaHeroe._id);

        res.status(201).json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
        console.error('Error en crearMultimediaHeroe:', error);
        res.json({ Ok: false, resp: error });
    }
};

const actualizarMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;
    const { estado, ...data } = req.body;

    try {

        //Verifica que la URL existe
        //const multimediaHeroeDB = await Multimedia.findOne({ url: data.url });
        const multimediaHeroeDB = await MultimediaHeroe.findOne({ IdHeroe: data.IdHeroe, IdMultimedia: data.IdMultimedia });

        if (multimediaHeroeDB) {
            return res.status(400).json({
                msg: `La multimedia, ya existe para este Heroe`,
            });
        }


        /*
        //Verifica que la Multimedia Exista
        if (data.IdMultimedia) {
            if (isValidObjectId(data.IdMultimedia)) {
                const existeMultimedia = await Multimedia.findById(
                    data.IdMultimedia
                );

                if (!existeMultimedia) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Multimedia ${data.IdMultimedia}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Multimedia ${data.IdMultimedia}, no es un MongoBDId`,
                });
            }
        }

        //Verifica que el Heroe Exista
        if (data.IdHeroe) {
            if (isValidObjectId(data.IdHeroe)) {
                const existeHeroe = await Heroe.findById(
                    data.IdHeroe
                );

                if (!existeHeroe) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Heroe ${data.IdHeroe}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Heroe ${data.IdHeroe}, no es un MongoBDId`,
                });
            }
        }
        */

        //data.usuario = req.usuario._id;
        //data.fecha_actualizacion = now();

        const multimediaHeroe = await MultimediaHeroe.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const borrarMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;

    try {

        const multimediaHeroeBorrado = await MultimediaHeroe.findByIdAndDelete(id);

        /*
        const multimediaHeroeBorrado = await MultimediaHeroe.findByIdAndUpdate(
          id,
          { estado: false, fecha_actualizacion: now() },
          { new: true }
        );
        */

        res.json({ Ok: true, resp: multimediaHeroeBorrado });

    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {
    obtenerMultimediaHeroe,
    crearMultimediaHeroe,
    actualizarMultimediaHeroe,
    borrarMultimediaHeroe,
    obtenerMultimediasPorHeroe,
    obtenerMultimediasHeroes
};
