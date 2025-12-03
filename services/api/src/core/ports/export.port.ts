/**
 * Interface port para serviço de exportação de dados
 * Permite que o domínio exporte dados sem depender de formatos específicos
 */
export interface IExportService {
  /**
   * Exportar dados para formato CSV
   */
  exportToCSV(data: any[], filename: string): Promise<Buffer>;

  /**
   * Exportar dados para formato JSON
   */
  exportToJSON(data: any[], filename: string): Promise<Buffer>;

  /**
   * Exportar dados para formato Excel
   */
  exportToExcel(data: any[], filename: string): Promise<Buffer>;
}
