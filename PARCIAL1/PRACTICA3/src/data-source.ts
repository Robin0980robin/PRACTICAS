import "reflect-metadata";
import { DataSource } from "typeorm";
import { Receta } from "./entities/Receta";
import { DetalleReceta } from "./entities/DetalleReceta";
import { Busqueda } from "./entities/Busqueda";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "practica3123",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [Receta, DetalleReceta, Busqueda],
});
