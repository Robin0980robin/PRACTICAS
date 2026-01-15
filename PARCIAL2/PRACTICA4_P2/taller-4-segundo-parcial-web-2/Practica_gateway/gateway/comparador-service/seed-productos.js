const axios = require('axios');

const productos = [
  {
    nombre_generico: 'Paracetamol',
    nombre_comercial: 'Tylenol',
    principio_activo: 'Paracetamol',
    categoria: 'Analgésico',
    presentacion: 'Tabletas',
    concentracion: '500mg',
    requiere_receta: false
  },
  {
    nombre_generico: 'Ibuprofeno',
    nombre_comercial: 'Advil',
    principio_activo: 'Ibuprofeno',
    categoria: 'Antiinflamatorio',
    presentacion: 'Tabletas',
    concentracion: '400mg',
    requiere_receta: false
  },
  {
    nombre_generico: 'Amoxicilina',
    nombre_comercial: 'Amoxil',
    principio_activo: 'Amoxicilina',
    categoria: 'Antibiótico',
    presentacion: 'Cápsulas',
    concentracion: '500mg',
    requiere_receta: true
  },
  {
    nombre_generico: 'Omeprazol',
    nombre_comercial: 'Prilosec',
    principio_activo: 'Omeprazol',
    categoria: 'Antiácido',
    presentacion: 'Cápsulas',
    concentracion: '20mg',
    requiere_receta: false
  },
  {
    nombre_generico: 'Loratadina',
    nombre_comercial: 'Claritin',
    principio_activo: 'Loratadina',
    categoria: 'Antihistamínico',
    presentacion: 'Tabletas',
    concentracion: '10mg',
    requiere_receta: false
  }
];

async function seedProductos() {
  console.log('🌱 Iniciando seed de productos...');
  
  for (const producto of productos) {
    try {
      const response = await axios.post('http://localhost:3003/productos', producto);
      console.log(`✅ Producto creado: ${producto.nombre_comercial} (${producto.nombre_generico})`);
    } catch (error) {
      console.error(`❌ Error al crear ${producto.nombre_comercial}:`, error.message);
    }
  }
  
  console.log('\n✨ Seed completado!');
}

seedProductos();
