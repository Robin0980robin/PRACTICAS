import { Producto } from "../entities/Producto";

export interface IProductoRepository {
  create(producto: Producto, callback: (err: Error | null, result?: Producto) => void): void;
  findAll(): Promise<Producto[]>;
  findById(id: string): Promise<Producto | undefined>;
  update(id: string, data: Partial<Producto>): Promise<Producto>;
  delete(id: string): Promise<boolean>;
}
