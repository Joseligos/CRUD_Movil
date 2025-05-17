const { Schema, model } = require('mongoose');

const MultimediaHeroeSchema = Schema({
    IdHeroe: {
        type: Schema.Types.ObjectId,
        ref: 'Heroe'
    },    
    IdMultimedia: {
        type: Schema.Types.ObjectId,
        ref: 'Multimedia'
    },    
 });


 
 MultimediaHeroeSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'MultimediaHeroe', MultimediaHeroeSchema );

