// Script de diagnóstico para verificar multimedia-heroe
const { MultimediaHeroe } = require('../models');

// Función de diagnóstico
const diagnoseMultimediaHeroe = async () => {
  try {
    console.log('\n=== DIAGNÓSTICO DE MULTIMEDIA-HEROE ===');
    console.log('Verificando registros en la colección MultimediaHeroe...');
    
    // Contar registros
    const totalCount = await MultimediaHeroe.countDocuments({});
    console.log(`Total de registros encontrados: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('⚠️ NO HAY REGISTROS en la colección MultimediaHeroe.');
      console.log('Posibles causas:');
      console.log('1. No se ha creado ninguna asociación multimedia-héroe todavía.');
      console.log('2. Hay un problema con la conexión a la base de datos.');
      console.log('3. Los registros podrían haberse eliminado accidentalmente.');
    } else {
      console.log('✅ Se encontraron registros en la colección MultimediaHeroe.');
      
      // Obtener registros con populate para verificar relaciones
      const records = await MultimediaHeroe.find({})
        .populate('IdHeroe', 'nombre')
        .populate('IdMultimedia', 'url')
        .limit(5);
      
      console.log('\nPrimeros 5 registros (o todos si hay menos):');
      records.forEach((record, index) => {
        console.log(`\nRegistro #${index + 1}:`);
        console.log(`ID: ${record._id}`);
        console.log(`Héroe: ${record.IdHeroe ? record.IdHeroe.nombre || record.IdHeroe : 'No disponible 🔴'}`);
        console.log(`Multimedia: ${record.IdMultimedia ? record.IdMultimedia.url || record.IdMultimedia : 'No disponible 🔴'}`);
        
        // Verificar integridad de relaciones
        if (!record.IdHeroe || !record.IdMultimedia) {
          console.log('⚠️ ADVERTENCIA: Este registro tiene referencias faltantes o inválidas.');
        }
      });
      
      console.log('\nResultado del diagnóstico:');
      if (records.every(r => r.IdHeroe && r.IdMultimedia)) {
        console.log('✅ Todos los registros verificados tienen referencias válidas.');
      } else {
        console.log('⚠️ Se encontraron registros con referencias faltantes o inválidas.');
        console.log('Esto podría causar problemas al mostrar la lista de asociaciones.');
      }
    }
    
    console.log('\nVerificando rutas API...');
    console.log('Ruta base para MultimediaHeroe: /api/multimediasheroe');
    console.log('Ruta para obtener todas las asociaciones: GET /api/multimediasheroe');
    console.log('Ruta para obtener asociaciones por héroe: GET /api/multimediasheroe/heroe/:id');
    
    console.log('\n=== FIN DEL DIAGNÓSTICO ===');
    
  } catch (error) {
    console.error('Error durante el diagnóstico:', error);
  }
};

// Ejecutar diagnóstico al iniciar el servidor
module.exports = { diagnoseMultimediaHeroe };
