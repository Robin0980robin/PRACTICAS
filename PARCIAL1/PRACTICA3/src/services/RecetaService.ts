import { AppDataSource } from "../data-source";
import { Receta } from "../entities/Receta";

export class RecetaService {
  private repo = AppDataSource.getRepository(Receta);

  async create(data: Partial<Receta>) {
    const receta = this.repo.create(data);
    return await this.repo.save(receta);
  }

  async findAll() {
    return await this.repo.find({ relations: ["detalles"] });
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id_receta: id }, relations: ["detalles"] });
  }

  async update(id: number, data: Partial<Receta>) {
    await this.repo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
