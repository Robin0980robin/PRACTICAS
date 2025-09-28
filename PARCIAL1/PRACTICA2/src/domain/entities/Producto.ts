export interface IProducto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
}

export class Producto implements IProducto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;

  constructor(id: string, nombre: string, descripcion: string, precio: number) {
    if (!nombre || nombre.trim() === "") {
      throw new Error("El nombre del producto es obligatorio");
    }
    if (precio <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }

    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
  }
}
