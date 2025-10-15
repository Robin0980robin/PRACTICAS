import { AppDataSource } from "./data-source";
import { RecetaService } from "./services/RecetaService";
import { DetalleRecetaService } from "./services/DetalleRecetaService";
import { BusquedaService } from "./services/BusquedaService";

AppDataSource.initialize().then(async () => {
  console.log("Conexión establecida con la base de datos");

  const recetaService = new RecetaService();
  const detalleService = new DetalleRecetaService();
  const busquedaService = new BusquedaService();

  // Crear una receta
  const receta = await recetaService.create({
    fecha_emision: new Date(),
    diagnostico: "Gripe común",
    observaciones: "Paciente con síntomas leves",
    ubicacion_emision: "Quito",
  });
  console.log("Receta creada:", receta);

  // Crear un detalle de receta
  const detalle = await detalleService.create({
    receta,
    id_producto: 101,
    cantidad: 2,
    dosis: "1 tableta cada 8h",
    presentacion: "Tabletas",
    duracion_tratamiento: "5 días",
    instrucciones: "Tomar después de las comidas",
  });
  console.log("Detalle creado:", detalle);

  // Crear una búsqueda
  const busqueda = await busquedaService.create({
    termino_busqueda: "Paracetamol",
    fecha_hora: new Date(),
    resultados_mostrados: 5,
    farmacia_seleccionada: "Farmacia SanaSana",
    geolocalizacion: "-0.1807, -78.4678",
  });
  console.log("Búsqueda registrada:", busqueda);

  // Consultar todas las recetas
  const recetas = await recetaService.findAll();
  console.log("Todas las recetas:", recetas);

  process.exit(0);
});
