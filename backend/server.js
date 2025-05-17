const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`)
})

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://joseligo:JuanJose142006@db.7jvy7.mongodb.net/Heroes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB Heroes'))
    .catch((error) => console.error('Error al conectar a MongoDB', error))

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

app.use('/api', require('./routes/heroes'));
app.use('/api', require('./routes/multimedias'));
app.use('/api', require('./routes/multimediasheroe'));
app.use('/api', require('./routes/grupomultimedias'));