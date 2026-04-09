const E164_PHONE = "19567032804";

export function buildWhatsAppLink(message: string) {
  const url = new URL(`https://wa.me/${E164_PHONE}`);
  const trimmed = message.trim();
  if (trimmed.length > 0) url.searchParams.set("text", trimmed);
  return url.toString();
}

