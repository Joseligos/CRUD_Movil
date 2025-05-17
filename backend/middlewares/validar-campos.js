const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
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
