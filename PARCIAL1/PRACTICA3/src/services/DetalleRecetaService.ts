import { AppDataSource } from "../data-source";
import { DetalleReceta } from "../entities/DetalleReceta";

export class DetalleRecetaService {
  private repo = AppDataSource.getRepository(DetalleReceta);

  async create(data: Partial<DetalleReceta>) {
    const detalle = this.repo.create(data);
    return await this.repo.save(detalle);
  }

  async findAll() {
    return await this.repo.find({ relations: ["receta"] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id_detalle_receta: id }, relations: ["receta"] });
  }

  async update(id: number, data: Partial<DetalleReceta>) {
    await this.repo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
