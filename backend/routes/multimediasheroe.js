const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos} = require('../middlewares');

const { obtenerMultimediaHeroe,
        crearMultimediaHeroe,
        actualizarMultimediaHeroe, 
        obtenerMultimediasPorHeroe,
        obtenerMultimediasHeroes,
        borrarMultimediaHeroe } = require('../controllers/multimediasHeroe');
const { existeMultimediaPorId,existeHeroePorId,existeMultimediaHeroePorId } = require('../helpers/db-validators');

const router = Router();

// Ruta para obtener todos los registros
router.get('/', (req, res, next) => {
    console.log('Request recibida para obtener todas las asociaciones multimedia-héroe');
    next();
}, obtenerMultimediasHeroes);

// Ruta para obtener un registro específico
router.get('/multimedia/:id', (req, res, next) => {
    console.log(`Request recibida para obtener detalles de la asociación con ID: ${req.params.id}`);
    next();
}, obtenerMultimediaHeroe);

// Rutas específicas primero
router.get('/heroe/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    //check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeMultimediaHeroePorId ),
    //validarCampos
],obtenerMultimediasPorHeroe );

// Ruta genérica después
//router.get('/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
//    check('id', 'No es un id de Mongo válido').isMongoId(),
//    check('id').custom( existeMultimediaHeroePorId ),    validarCampos
//],obtenerMultimediaHeroe );

// Crear Multimedia - privado - cualquier persona con un token válido
router.post('/', [ 
    //check('url','La URL obligatoria').not().isEmpty(),
    check('IdMultimedia','No es un id de Mongo').isMongoId(),
    check('IdMultimedia').custom( existeMultimediaPorId ),
    check('IdHeroe','No es un id de Mongo').isMongoId(),
    check('IdHeroe').custom( existeHeroePorId ),
    validarCampos
], crearMultimediaHeroe );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaHeroePorId ),
    validarCampos
],actualizarMultimediaHeroe );

// Borrar una Multimedia - Admin
router.delete('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaHeroePorId ),
    validarCampos,
],borrarMultimediaHeroe);


module.exports = router;