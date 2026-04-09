import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ContractRow } from "@/lib/contracts/repo";
import { rowPayload } from "@/lib/contracts/repo";
import type { AppLocale } from "../../../i18n/locales";
import type { LineItem } from "@/lib/contracts/schema";

function money(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function dataUrlToPngBytes(dataUrl: string): Uint8Array {
  const m = dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if (!m?.[1]) throw new Error("Invalid signature image");
  return Uint8Array.from(Buffer.from(m[1], "base64"));
}

function wrapLine(text: string, maxWidth: number, font: import("pdf-lib").PDFFont, size: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function pdfCopy(locale: AppLocale) {
  if (locale === "es") {
    return {
      title: "Ohana Events — Contrato de servicio",
      phone: "Teléfono",
      name: "Nombre",
      date: "Fecha",
      time: "Hora",
      address: "Dirección",
      description: "Descripción",
      price: "Precio",
      total: "Total",
      deposit: "Depósito",
      paymentMethod: "Método de pago (pago fuera de línea)",
      paymentCash: "Efectivo",
      paymentCashApp: "Cash App",
      paymentZelle: "Zelle",
      notes: "Notas",
      legalDeposit:
        "Depósito de $25.00 USD: el cliente reconoce que el depósito no es reembolsable si cancela el evento.",
      legalAgreement:
        "Al firmar, el cliente acepta los términos anteriores y el total indicado (sujeto a los servicios descritos).",
      clientSigned: "Firma del cliente",
      ownerSigned: "Firma de Ohana Events",
      version: "Versión legal",
    };
  }
  return {
    title: "Ohana Events — Service agreement",
    phone: "Phone",
    name: "Name",
    date: "Date",
    time: "Time",
    address: "Address",
    description: "Description",
    price: "Price",
    total: "Total",
    deposit: "Deposit",
    paymentMethod: "Payment method (paid off-site)",
    paymentCash: "Cash",
    paymentCashApp: "Cash App",
    paymentZelle: "Zelle",
    notes: "Notes",
    legalDeposit:
      "Deposit of $25.00 USD: the client acknowledges the deposit is non-refundable if the event is cancelled.",
    legalAgreement:
      "By signing, the client accepts the terms above and the total shown (for the services described).",
    clientSigned: "Client signature",
    ownerSigned: "Ohana Events signature",
    version: "Legal version",
  };
}

function paymentLabel(
  method: string,
  c: ReturnType<typeof pdfCopy>
): string {
  if (method === "cash") return c.paymentCash;
  if (method === "cashapp") return c.paymentCashApp;
  if (method === "zelle") return c.paymentZelle;
  return "—";
}

export async function buildContractPdf(row: ContractRow): Promise<Uint8Array> {
  const payload = rowPayload(row);
  const c = pdfCopy(row.locale);
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([612, 792]);
  const margin = 48;
  let y = 760;
  const w = 612 - margin * 2;
  const lineH = 14;
  const small = 10;
  const body = 11;

  const draw = (text: string, size: number, bold = false, color = rgb(0.1, 0.1, 0.1)) => {
    const f = bold ? fontBold : font;
    for (const ln of wrapLine(text, w, f, size)) {
      if (y < 80) {
        page = doc.addPage([612, 792]);
        y = 760;
      }
      page.drawText(ln, { x: margin, y, size, font: f, color });
      y -= size + 4;
    }
  };

  draw(c.title, 16, true);
  y -= 4;
  draw(`${c.phone}: (956) 703-2804`, body);
  y -= 8;
  draw(`${c.version}: ${row.legal_version}`, small);
  y -= 12;

  draw(`${c.name}: ${payload.clientName || "—"}`, body);
  draw(`${c.date}: ${payload.eventDate || "—"}`, body);
  draw(`${c.phone}: ${payload.phone || "—"}`, body);
  draw(`${c.time}: ${payload.timeRange || "—"}`, body);
  draw(`${c.address}: ${payload.address || "—"}`, body);
  if (payload.notes) draw(`${c.notes}: ${payload.notes}`, body);
  y -= 8;

  draw(`${c.description} / ${c.price} / ${c.total}`, body, true);
  let subtotal = 0;
  const items: LineItem[] = payload.lineItems?.length ? payload.lineItems : [];
  for (const item of items) {
    subtotal += item.lineTotalCents;
    draw(`${item.description} — ${money(item.lineTotalCents)}`, body);
  }
  if (items.length === 0) {
    draw("—", body);
  }
  y -= 4;
  draw(`Subtotal: ${money(subtotal)}`, body, true);
  draw(`${c.deposit}: ${money(payload.depositCents)}`, body, true);
  draw(`${c.paymentMethod}: ${paymentLabel(payload.paymentMethod, c)}`, body);
  y -= 12;

  for (const part of c.legalDeposit.split(". ").filter(Boolean)) {
    draw(part.endsWith(".") ? part : `${part}.`, small);
  }
  y -= 4;
  for (const part of c.legalAgreement.split(". ").filter(Boolean)) {
    draw(part.endsWith(".") ? part : `${part}.`, small);
  }
  y -= 16;

  if (row.client_signature_data_url) {
    try {
      const png = await doc.embedPng(dataUrlToPngBytes(row.client_signature_data_url));
      const maxW = 220;
      const scale = Math.min(maxW / png.width, 80 / png.height);
      const pw = png.width * scale;
      const ph = png.height * scale;
      if (y < ph + 60) {
        page = doc.addPage([612, 792]);
        y = 760;
      }
      page.drawText(`${c.clientSigned}:`, { x: margin, y, size: body, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= lineH;
      page.drawImage(png, { x: margin, y: y - ph, width: pw, height: ph });
      y -= ph + 16;
      if (row.client_signed_at) {
        draw(`Signed: ${new Date(row.client_signed_at).toISOString()}`, small);
      }
    } catch {
      draw(`${c.clientSigned}: (on file)`, body);
    }
  }

  if (row.owner_signature_data_url) {
    try {
      const png = await doc.embedPng(dataUrlToPngBytes(row.owner_signature_data_url));
      const maxW = 220;
      const scale = Math.min(maxW / png.width, 80 / png.height);
      const pw = png.width * scale;
      const ph = png.height * scale;
      if (y < ph + 60) {
        page = doc.addPage([612, 792]);
        y = 760;
      }
      page.drawText(`${c.ownerSigned}:`, { x: margin, y, size: body, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      y -= lineH;
      page.drawImage(png, { x: margin, y: y - ph, width: pw, height: ph });
      y -= ph + 16;
      if (row.owner_signed_at) {
        draw(`Signed: ${new Date(row.owner_signed_at).toISOString()}`, small);
      }
    } catch {
      draw(`${c.ownerSigned}: (on file)`, body);
    }
  }

  return doc.save();
}
