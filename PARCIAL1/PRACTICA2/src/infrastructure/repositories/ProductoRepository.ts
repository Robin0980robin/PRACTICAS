import { Producto } from "../../domain/entities/Producto";
import { IProductoRepository } from "../../domain/interfaces/IProductoRepository";

export class ProductoRepository implements IProductoRepository {
  private productos: Producto[] = [];

  create(producto: Producto, callback: (err: Error | null, result?: Producto) => void): void {
    setTimeout(() => {
      try {
        this.productos.push(producto);
        callback(null, producto);
      } catch (error: any) {
        callback(error);
      }
    }, 200);
  }

  async findAll(): Promise<Producto[]> {
    return this.productos;
  }

  async findById(id: string): Promise<Producto | undefined> {
    return this.productos.find(p => p.id === id);
  }

  update(id: string, data: Partial<Producto>): Promise<Producto> {
    return new Promise((resolve, reject) => {
      const producto = this.productos.find(p => p.id === id);
      if (!producto) {
        return reject(new Error("Producto no encontrado"));
      }
      Object.assign(producto, data);
      resolve(producto);
    });
  }

  async delete(id: string): Promise<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.productos.splice(index, 1);
    return true;
  }
}
