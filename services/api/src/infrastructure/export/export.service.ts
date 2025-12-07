import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Parser } from 'json2csv';
import { WeatherData } from '../../core/domain/entities/weather.entity';
import { IExportService } from '../../core/ports/export.port';

/**
 * Serviço de exportação de dados
 * 
 * RESPONSABILIDADE: Gerar arquivos CSV e XLSX para download
 */
@Injectable()
export class ExportService implements IExportService {
  async exportToCSV(data: any[], filename: string): Promise<Buffer> {
    try {
      const fields = [
        { label: 'Localização', value: 'location' },
        { label: 'Data/Hora', value: 'timestamp' },
        { label: 'Temperatura (°C)', value: 'temperature' },
        { label: 'Umidade (%)', value: 'humidity' },
        { label: 'Velocidade do Vento (km/h)', value: 'windSpeed' },
        { label: 'Precipitação (mm)', value: 'precipitation' },
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      return Buffer.from(csv, 'utf-8');
    } catch (error) {
      throw new Error(`Erro ao gerar CSV: ${error.message}`);
    }
  }

  async exportToJSON(data: any[], filename: string): Promise<Buffer> {
    try {
      const json = JSON.stringify(data, null, 2);
      return Buffer.from(json, 'utf-8');
    } catch (error) {
      throw new Error(`Erro ao gerar JSON: ${error.message}`);
    }
  }

  async exportToExcel(data: any[], filename: string): Promise<Buffer> {
    try {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Dados Climáticos');

      worksheet.columns = [
        { header: 'Localização', key: 'location', width: 20 },
        { header: 'Data/Hora', key: 'timestamp', width: 20 },
        { header: 'Temperatura (°C)', key: 'temperature', width: 18 },
        { header: 'Umidade (%)', key: 'humidity', width: 15 },
        { header: 'Velocidade do Vento (km/h)', key: 'windSpeed', width: 25 },
        { header: 'Precipitação (mm)', key: 'precipitation', width: 18 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          location: item.location,
          timestamp: new Date(item.timestamp),
          temperature: item.temperature,
          humidity: item.humidity,
          windSpeed: item.windSpeed,
          precipitation: item.precipitation,
        });
      });

      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      throw new Error(`Erro ao gerar XLSX: ${error.message}`);
    }
  }

  /**
   * @deprecated Use exportToExcel instead
   */
  async exportToXLSX(data: WeatherData[]): Promise<Buffer> {
    return this.exportToExcel(data, 'weather-data.xlsx');
  }
}
