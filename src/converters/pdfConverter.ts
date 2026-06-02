import { jsPDF } from "jspdf";
import "jspdf-autotable";

export async function jsonToPdf(data: any): Promise<Buffer> {
  const doc = new jsPDF() as any;
  
  const content = Array.isArray(data) ? data : [data];
  
  if (content.length > 0) {
    const headers = Object.keys(content[0]);
    const body = content.map(item => headers.map(header => String(item[header] || "")));
    
    doc.autoTable({
      head: [headers],
      body: body,
    });
  } else {
    doc.text("No data available", 10, 10);
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
