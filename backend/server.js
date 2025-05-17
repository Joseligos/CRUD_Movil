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

// Request logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request body:', JSON.stringify(req.body));
    }
    // Add this line to log query parameters
    if (Object.keys(req.query).length > 0) {
        console.log('Query params:', JSON.stringify(req.query));
    }
    // Add this line to log route parameters
    if (req.params && Object.keys(req.params).length > 0) {
        console.log('Route params:', JSON.stringify(req.params));
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
console.log('Registering routes');
app.use('/api/heroes', require('./routes/heroes'));
console.log('Registered: /api/heroes');
app.use('/api/multimedias', require('./routes/multimedias'));
console.log('Registered: /api/multimedias');
app.use('/api/multimediasheroe', require('./routes/multimediasheroe'));
console.log('Registered: /api/multimediasheroe');
app.use('/api/grupomultimedias', require('./routes/grupomultimedias'));
console.log('Registered: /api/grupomultimedias');