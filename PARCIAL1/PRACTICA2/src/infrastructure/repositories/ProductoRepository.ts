import { Producto } from "../../domain/entities/Producto";

export class ProductoRepository {
  private productos: Producto[] = [];

  // CREATE -> Callback
  create(producto: Producto, callback: (err: Error | null, result?: Producto) => void): void {
    setTimeout(() => {
      try {
        this.productos.push(producto);
        callback(null, producto);
      } catch (error) {
        callback(error as Error);
      }
    }, 500);
  }

  // READ -> Async/Await
  async findAll(): Promise<Producto[]> {
    return this.productos;
  }

  async findById(id: string): Promise<Producto | null> {
    return this.productos.find(p => p.id === id) || null;
  }

  // UPDATE -> Promise
  update(id: string, data: Partial<Producto>): Promise<Producto> {
    return new Promise((resolve, reject) => {
      const index = this.productos.findIndex(p => p.id === id);
      if (index === -1) {
        reject(new Error("Producto no encontrado"));
      } else {
        this.productos[index] = { ...this.productos[index], ...data } as Producto;
        resolve(this.productos[index]);
      }
    });
  }

  // DELETE -> Async/Await
  async delete(id: string): Promise<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.productos.splice(index, 1);
    return true;
  }
}
