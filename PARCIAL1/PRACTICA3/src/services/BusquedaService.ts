import { AppDataSource } from "../data-source";
import { Busqueda } from "../entities/Busqueda";

export class BusquedaService {
  private repo = AppDataSource.getRepository(Busqueda);

  async create(data: Partial<Busqueda>) {
    const busqueda = this.repo.create(data);
    return await this.repo.save(busqueda);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id_busqueda: id });
  }

  async update(id: number, data: Partial<Busqueda>) {
    await this.repo.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
