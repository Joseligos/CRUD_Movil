const { Heroe, GrupoMultimedia, Multimedia, MultimediaHeroe } = require('../models');
/**
 * Heroe
 */
const existeHeroePorId = async (id) => {
  // Verificar si el correo existe
    const existeHeroe = await Heroe.findById(id);
    if (!existeHeroe) {
        throw new Error(`El id no existe ${id}`);
    }
};


/**
 * GrupoMultimedia
 */
const existeGrupoMultimediaPorId = async (id) => {
  // Verificar si el correo existe
    const existeGrupoMultimedia = await GrupoMultimedia.findById(id);
    if (!existeGrupoMultimedia) {
        throw new Error(`El id no existe ${id}`);
    }
};

/**
 * Multimedia
 */
const existeMultimediaPorId = async (id) => {
  // Verificar si el correo existe
    const existeMultimedia = await Multimedia.findById(id);
    if (!existeMultimedia) {
        throw new Error(`El id no existe ${id}`);
    }
};


/**
 * MultimediaHeroe
 */
const existeMultimediaHeroePorId = async (id) => {
  // Verificar si el correo existe
    const existeMultimediaHeroe = await MultimediaHeroe.findById(id);
    if (!existeMultimediaHeroe) {
        throw new Error(`El id no existe ${id}`);
    }
};


/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}

module.exports = {

    coleccionesPermitidas,

    existeHeroePorId,

    existeGrupoMultimediaPorId,
    existeMultimediaPorId,
    existeMultimediaHeroePorId,
};