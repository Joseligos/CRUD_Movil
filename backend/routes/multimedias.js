const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos} = require('../middlewares');

const { crearMultimedia,
        obtenerMultimedias,
        obtenerMultimedia,
        obtenerMultimediasXGrupoMultimedia,
        obtenerMultimediasXIdHeroe,
        obtenerFotosXIdHeroe,
        actualizarMultimedia, 
        borrarMultimedia } = require('../controllers/multimedias');
const { existeMultimediaPorId, existeGrupoMultimediaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/multimedias
 */

//  Obtener todas las Multimedias - publico
router.get('/multimedias', (req, res, next) => {
    console.log('GET request to /api/multimedias received');
    console.log('Query:', req.query);
    console.log('URL:', req.originalUrl);
    next();
}, obtenerMultimedias );

router.get('/grupomultimedia/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerMultimediasXGrupoMultimedia );

router.get('/heroe/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerMultimediasXIdHeroe);

router.get('/fotos/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerFotosXIdHeroe);

// Obtener una Multimedia por id - publico
router.get('/multimedias/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos,
], obtenerMultimedia );


// Crear Multimedia - privado - cualquier persona con un token válido
router.post('/multimedias', [ 
    //validarJWT,
    check('url','La URL obligatoria').not().isEmpty(),
    check('IdGrupoMultimedia','No es un id de Mongo').isMongoId(),
    check('IdGrupoMultimedia').custom( existeGrupoMultimediaPorId ),
    validarCampos
], crearMultimedia );

// Actualizar - privado - cualquiera con token válido
router.put('/multimedias/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos
],actualizarMultimedia );

// Borrar una Multimedia - Admin
router.delete('/multimedias/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos,
],borrarMultimedia);



module.exports = router;