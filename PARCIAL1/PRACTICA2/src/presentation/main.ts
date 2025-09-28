import { ProductoService } from "../application/services/ProductoService";

async function main() {
  const productoService = new ProductoService();
  await productoService.probarCRUD();
}

main();
