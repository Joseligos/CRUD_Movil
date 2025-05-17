const { Schema, model } = require('mongoose');

const MultimediaSchema = Schema({
    url: {
        type: String,
        required: [true, 'La url es obligatoria'],
    },
    tipo: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    IdGrupoMultimedia: {
        type: Schema.Types.ObjectId,
        ref: 'GrupoMultimedia'
    },    
   fecha_creacion: {
        type: Date,
		default: Date.now,
		required: 'Debe tener una fecha de Creacion.'
    },
    fecha_actualizacion: {type: Date},
 });


MultimediaSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Multimedia', MultimediaSchema );