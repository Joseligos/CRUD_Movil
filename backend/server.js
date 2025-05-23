const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const { diagnoseMultimediaHeroe } = require('./helpers/diagnostics')

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`)
    
    // Ejecutar diagnóstico después de que el servidor se inicie
    setTimeout(() => {
        diagnoseMultimediaHeroe();
    }, 2000);
})

app.use(cors())
app.use(express.json())

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', JSON.stringify(req.body));
    }
    next();
})

mongoose.connect("mongodb+srv://joseligo:JuanJose142006@db.7jvy7.mongodb.net/Heroes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB Heroes'))
    .catch((error) => console.error('Error al conectar a MongoDB', error))

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando correctamente!');
});

// Mount routes properly
app.use('/api/heroes', require('./routes/heroes'));
app.use('/api/multimedias', require('./routes/multimedias'));
app.use('/api/multimediasheroe', require('./routes/multimediasheroe'));
app.use('/api/grupomultimedias', require('./routes/grupomultimedias'));