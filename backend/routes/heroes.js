const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');

const { crearHeroe,
        obtenerHeroes,
        obtenerHeroe,
        actualizarHeroe, 
        borrarHeroe } = require('../controllers/heroes');
const { existeHeroePorId } = require('../helpers/db-validators');

const router = Router();

//  Obtener todas las Opciones - publico
router.get('/heroes', obtenerHeroes );


// Obtener una Opcion por id - publico
router.get('/heroes/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
], obtenerHeroe );

// Crear Opcion - privado - cualquier persona con un token válido
router.post('/heroes', [ 
    //validarJWT,
    check('nombre','El nombre del heroe es obligatorio').not().isEmpty(),
    validarCampos
], crearHeroe );

// Actualizar Role- privado - cualquiera con token válido
router.put('/heroes/:id',[
    //validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos
],actualizarHeroe );

// Borrar un Role - Admin
router.delete('/heroes/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeHeroePorId ),
    validarCampos,
],borrarHeroe);

module.exports = router;