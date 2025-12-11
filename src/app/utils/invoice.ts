import PDFDocument from "pdfkit";

export interface IInvoiceData {
  transaction_id: string;
  user_name: string;
  price: number;
  download_link: string;
}

export const generatePdf = async (
  invoiceData: IInvoiceData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffer: Uint8Array[] = [];

    doc.on("data", (chunk: any) => buffer.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffer)));
    doc.on("error", (err: any) => reject(err));

    // PDF Content
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Transaction ID: ${invoiceData.transaction_id}`);
    doc.text(`Customer: ${invoiceData.user_name}`);
    doc.moveDown();
    doc.text(`Price: $${invoiceData.price.toFixed(2)}`);
    doc.moveDown();
    doc.text("Thank you for using Go Journey!", { align: "center" });

    doc.end();
  });
};
