import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

export function formatPhone(phone: string): string {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function generateOrderWhatsAppMessage(order: {
  orderNumber: string;
  customerName: string;
  items: Array<{ product_name: string; quantity: number; price: number }>;
  total: number;
  notes?: string;
}): string {
  let message = `🛒 *Novo Pedido - ${order.orderNumber}*\n\n`;
  message += `👤 *Cliente:* ${order.customerName}\n\n`;
  message += `*Itens do Pedido:*\n`;

  order.items.forEach((item, index) => {
    message += `${index + 1}. ${item.product_name}\n`;
    message += `   Qtd: ${item.quantity} | Valor: ${formatPrice(item.price)}\n`;
    message += `   Subtotal: ${formatPrice(item.quantity * item.price)}\n\n`;
  });

  message += `💰 *Total: ${formatPrice(order.total)}*\n`;

  if (order.notes) {
    message += `\n📝 *Observações:*\n${order.notes}\n`;
  }

  message += `\n✅ Gostaria de confirmar este pedido?`;

  return message;
}

export function parseImages(imagesJson?: string): string[] {
  if (!imagesJson) return [];
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
