const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errores de validación:', errors.array());
        return res.status(400).json({
            Ok: false,
            msg: 'Error de validación',
            errores: errors.array().map(err => ({
                campo: err.param,
                mensaje: err.msg
            }))
        });
    }

    next();
}

module.exports = {
    validarCampos
};
