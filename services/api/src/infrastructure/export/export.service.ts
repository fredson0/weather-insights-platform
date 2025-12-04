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
  /**
   * Exporta dados climáticos para formato CSV
   */
  async exportToCSV(data: WeatherData[]): Promise<Buffer> {
    try {
      // Definir campos para o CSV
      const fields = [
        { label: 'Localização', value: 'location' },
        { label: 'Data/Hora', value: 'timestamp' },
        { label: 'Temperatura (°C)', value: 'temperature' },
        { label: 'Umidade (%)', value: 'humidity' },
        { label: 'Velocidade do Vento (km/h)', value: 'windSpeed' },
        { label: 'Precipitação (mm)', value: 'precipitation' },
        { label: 'Código Climático', value: 'weatherCode' },
      ];

      // Criar parser CSV
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      // Retornar como Buffer
      return Buffer.from(csv, 'utf-8');
    } catch (error) {
      throw new Error(`Erro ao gerar CSV: ${error.message}`);
    }
  }

  /**
   * Exporta dados climáticos para formato XLSX
   */
  async exportToXLSX(data: WeatherData[]): Promise<Buffer> {
    try {
      // Criar workbook e worksheet
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Dados Climáticos');

      // Definir colunas
      worksheet.columns = [
        { header: 'Localização', key: 'location', width: 20 },
        { header: 'Data/Hora', key: 'timestamp', width: 20 },
        { header: 'Temperatura (°C)', key: 'temperature', width: 18 },
        { header: 'Umidade (%)', key: 'humidity', width: 15 },
        { header: 'Velocidade do Vento (km/h)', key: 'windSpeed', width: 25 },
        { header: 'Precipitação (mm)', key: 'precipitation', width: 18 },
        { header: 'Código Climático', key: 'weatherCode', width: 18 },
      ];

      // Adicionar linhas de dados
      data.forEach((item) => {
        worksheet.addRow({
          location: item.location,
          timestamp: new Date(item.timestamp),
          temperature: item.temperature,
          humidity: item.humidity,
          windSpeed: item.windSpeed,
          precipitation: item.precipitation,
          weatherCode: item.weatherCode,
        });
      });

      // Estilizar cabeçalho
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' },
      };

      // Gerar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      throw new Error(`Erro ao gerar XLSX: ${error.message}`);
    }
  }
}
