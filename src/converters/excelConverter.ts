import * as XLSX from "xlsx";

/**
 * Converts Excel buffer to JSON.
 * @param buffer The Excel file buffer.
 * @returns A JSON object or array representing the Excel data.
 */
export async function excelToJson(buffer: Buffer): Promise<any> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const result: Record<string, any[]> = {};

  workbook.SheetNames.forEach((sheetName) => {
    const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length) result[sheetName] = roa;
  });

  return result;
}

/**
 * Converts JSON to Excel buffer.
 * @param data The JSON data (object or array).
 * @returns A Buffer containing the Excel file.
 */
export async function jsonToExcel(data: any): Promise<Buffer> {
  const wb = XLSX.utils.book_new();
  
  if (Array.isArray(data)) {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  } else if (typeof data === 'object') {
    Object.keys(data).forEach(sheetName => {
      const ws = XLSX.utils.json_to_sheet(data[sheetName]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
  }

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buf;
}

/**
 * Converts Excel buffer to CSV string.
 */
export async function excelToCsv(buffer: Buffer): Promise<string> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_csv(worksheet);
}
