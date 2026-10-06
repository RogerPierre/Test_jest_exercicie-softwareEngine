import { ShoppingItem } from "../types/shopping";

export function formatMoney(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function recebeNumero(number: number) {
  return String(number * 2)
}

// A entrada aceita vírgula ou ponto decimal, sem separador de milhares.
export function parseMoney(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function totalInCents(items: ShoppingItem[]) {
  return items.reduce(
    (total, item) => total + item.quantity * item.priceInCents,
    0,
  );
}

export function validateItem(
  name: string,
  quantity: string,
  price: string,
): string | null {
  if (!name.trim()) return "Informe o nome do produto.";
  if (name.trim().length > 60) return "Use até 60 caracteres no nome.";
  if (
    !/^\d+$/.test(quantity.trim()) ||
    Number(quantity) < 1 ||
    Number(quantity) > 999
  )
    return "A quantidade deve ser um número inteiro entre 1 e 999.";
  const cents = parseMoney(price);
  if (cents === null || cents <= 0)
    return "Informe um preço maior que zero, com até duas casas decimais.";
  return null;
}
