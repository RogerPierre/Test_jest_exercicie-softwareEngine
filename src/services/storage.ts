import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingItem, ShoppingList } from "../types/shopping";

const STORAGE_KEY = "@compra-certa:list:v1";
const isMoney = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= 0 &&
  value <= 999999999;

function isItem(value: unknown): value is ShoppingItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as ShoppingItem;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    item.name.length <= 60 &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1 &&
    item.quantity <= 999 &&
    isMoney(item.priceInCents) &&
    item.priceInCents > 0 &&
    typeof item.purchased === "boolean"
  );
}

export async function loadList(): Promise<ShoppingList> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { budgetInCents: 0, items: [] };
  const value = JSON.parse(raw);
  if (
    !value ||
    !isMoney(value.budgetInCents) ||
    !Array.isArray(value.items) ||
    !value.items.every(isItem)
  )
    throw new Error("Lista salva inválida.");
  return value;
}

export async function saveList(list: ShoppingList) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
