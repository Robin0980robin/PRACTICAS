import { ProductoRepository } from "../infrastructure/repositories/ProductoRepository";
import { ProductoService } from "../application/services/ProductoService";

async function main() {
  const repo = new ProductoRepository();      // implementación concreta
  const service = new ProductoService(repo);  // inyección de dependencias

  await service.probarCRUD();
}

main();
