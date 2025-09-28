import { Producto } from "../../domain/entities/Producto";
import { ProductoRepository } from "../../infrastructure/repositories/ProductoRepository";
import { randomUUID } from "crypto";

export class ProductoService {
  private repo: ProductoRepository;

  constructor() {
    this.repo = new ProductoRepository();
  }

  // Método para insertar
  insertarProducto(nombre: string, descripcion: string, precio: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const producto = new Producto(randomUUID(), nombre, descripcion, precio);
      this.repo.create(producto, (err, result) => {
        if (err) {
          console.error("❌ Error al crear producto:", err.message);
          reject(err);
        } else {
          console.log("✅ Producto creado:", result?.nombre);
          resolve();
        }
      });
    });
  }

  // Método que inserta 10 productos realistas
  async seed() {
    const productos: [string, string, number] [] = [
      ["Paracetamol 500mg", "Analgésico y antipirético", 1.5],
      ["Ibuprofeno 400mg", "Antiinflamatorio no esteroideo", 2.8],
      ["Amoxicilina 500mg", "Antibiótico de amplio espectro", 4.5],
      ["Loratadina 10mg", "Antihistamínico para alergias", 3.2],
      ["Omeprazol 20mg", "Inhibidor de ácido gástrico", 2.9],
      ["Metformina 500mg", "Control de la diabetes tipo 2", 6.5],
      ["Aspirina 100mg", "Prevención de problemas cardiovasculares", 1.8],
      ["Diclofenaco 50mg", "Antiinflamatorio y analgésico", 3.4],
      ["Salbutamol inhalador", "Broncodilatador para asma", 7.0],
      ["Cetirizina 10mg", "Antialérgico para rinitis", 2.4],
    ];

    for (const [nombre, descripcion, precio] of productos) {
      await this.insertarProducto(nombre, descripcion, precio as number);
    }
  }

  // Método para probar todos los CRUD
  async probarCRUD() {
    console.log("\n=== PRUEBAS CRUD PRODUCTO ===");

    // CREATE
    await this.seed();

    // READ
    const productos = await this.repo.findAll();
    console.log("Productos disponibles:", productos);

    // UPDATE
    if (productos.length > 0) {
      const producto = productos[0];
      if (producto) {
        this.repo.update(producto.id, { precio: 2.8 })
          .then(p => console.log("Producto actualizado:", p))
          .catch(err => console.error(err.message));
      }
    }

    // DELETE
    if (productos.length > 1) {
      const productoAEliminar = productos[1];
      if (productoAEliminar) {
        const eliminado = await this.repo.delete(productoAEliminar.id);
        console.log("Eliminado:", eliminado);
      }
    }

    // PRUEBA DE ERROR: intentar actualizar un id inexistente
    try {
      await this.repo.update("id-invalido", { precio: 9.9 });
    } catch (err: any) {
      console.log("✅ Manejo de error OK:", err.message);
    }
  }
}
