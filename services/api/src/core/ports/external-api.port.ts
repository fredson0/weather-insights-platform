/**
 * Interface port para clientes de APIs externas
 * Permite que o domínio busque dados de APIs externas
 */
export interface IExternalAPIClient {
  /**
   * Buscar dados de API externa
   */
  fetch<T>(endpoint: string, options?: RequestOptions): Promise<T>;

  /**
   * Enviar dados para API externa
   */
  post<T>(endpoint: string, data: any, options?: RequestOptions): Promise<T>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}
