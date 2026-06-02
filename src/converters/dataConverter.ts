import Papa from "papaparse";
import xml2js from "xml2js";
import YAML from "yaml";

/**
 * Converts CSV buffer to JSON.
 */
export async function csvToJson(buffer: Buffer): Promise<any> {
  const csvString = buffer.toString("utf8");
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error: any) => reject(error),
    });
  });
}

/**
 * Converts JSON to CSV string.
 */
export async function jsonToCsv(data: any): Promise<string> {
  return Papa.unparse(data);
}

/**
 * Converts XML buffer to JSON.
 */
export async function xmlToJson(buffer: Buffer): Promise<any> {
  const xmlString = buffer.toString("utf8");
  const parser = new xml2js.Parser({ explicitArray: false });
  return await parser.parseStringPromise(xmlString);
}

/**
 * Converts JSON to XML string.
 */
export async function jsonToXml(data: any): Promise<string> {
  const builder = new xml2js.Builder();
  return builder.buildObject(data);
}

/**
 * Converts YAML buffer to JSON.
 */
export async function yamlToJson(buffer: Buffer): Promise<any> {
  const yamlString = buffer.toString("utf8");
  return YAML.parse(yamlString);
}
