const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos} = require('../middlewares');

const { crearGrupoMultimedia,
        obtenerGrupoMultimedias,
        obtenerGrupoMultimedia,
        actualizarGrupoMultimedia, 
        borrarGrupoMultimedia } = require('../controllers/grupomultimedias');
const { existeGrupoMultimediaPorId } = require('../helpers/db-validators');

const router = Router();


/**
 * {{url}}/api/grupomultimedias
 */

//  Obtener todas las GrupoMultimedias - publico
router.get('/grupomultimedias', obtenerGrupoMultimedias );


// Obtener una GrupoMultimedia por id - publico
router.get('/grupomultimedias/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerGrupoMultimedia );

// Crear GrupoMultimedia - privado - cualquier persona con un token válido
router.post('/grupomultimedias', [ 
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearGrupoMultimedia );

// Actualizar - privado - cualquiera con token válido
router.put('/grupomultimedias/:id',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos
],actualizarGrupoMultimedia );

// Borrar una GrupoMultimedia - Admin
router.delete('/grupomultimedias/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
],borrarGrupoMultimedia);


module.exports = router;