import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

/**
 * Cliente HTTP para comunicarse con el Backend (comparador-service)
 * Abstrae las llamadas REST a los microservicios
 */
export class BackendClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para logging
    this.client.interceptors.request.use((config) => {
      logger.info(`🔹 Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
      });
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        logger.info(`✅ Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        const errorDetails = {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          code: error.code,
          message: error.message,
        };
        logger.error(`❌ Error HTTP:`, errorDetails);
        throw error;
      }
    );
  }

  /**
   * Buscar productos por nombre o código
   */
  async buscarProductos(query: string): Promise<any[]> {
    try {
      logger.info(`🔍 Buscando productos con query: "${query}"`);
      const { data } = await this.client.get('/productos', {
        params: { search: query },
      });
      logger.info(`📦 Productos encontrados: ${Array.isArray(data) ? data.length : 1}`);
      return Array.isArray(data) ? data : [data];
    } catch (error: any) {
      if (error.response?.status === 404) {
        logger.info(`🔍 No se encontraron productos para: "${query}"`);
        return [];
      }
      const errorMsg = `Error buscando productos: ${error.code || error.message} - ${error.response?.status || 'No response'}`;
      logger.error(errorMsg, { query, error: error.message });
      throw new Error(errorMsg);
    }
  }

  /**
   * Obtener producto específico por ID
   */
  async obtenerProducto(id: number): Promise<any> {
    const { data } = await this.client.get(`/productos/${id}`);
    return data;
  }

  /**
   * Validar stock disponible de un producto
   */
  async validarStock(productoId: number, cantidadRequerida: number): Promise<boolean> {
    try {
      const producto = await this.obtenerProducto(productoId);
      return producto.stock >= cantidadRequerida;
    } catch (error: any) {
      throw new Error(`Error validando stock: ${error.message}`);
    }
  }

  /**
   * Buscar prescripciones médicas
   */
  async buscarPrescripciones(filtros?: any): Promise<any[]> {
    const { data } = await this.client.get('/prescripciones', { params: filtros });
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Crear una comparación de precios
   */
  async crearComparacion(prescripcionId: number): Promise<any> {
    const { data } = await this.client.post('/comparador/comparar', {
      prescripcionId,
    });
    return data;
  }

  /**
   * Obtener comparaciones existentes
   */
  async obtenerComparaciones(prescripcionId?: number): Promise<any[]> {
    const params = prescripcionId ? { prescripcionId } : {};
    const { data } = await this.client.get('/comparador/comparaciones', { params });
    return Array.isArray(data) ? data : [data];
  }
}
