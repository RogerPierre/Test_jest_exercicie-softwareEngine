import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ItemForm } from "./src/components/ItemForm";
import { useShoppingList } from "./src/hooks/useShoppingList";
import { ShoppingItem } from "./src/types/shopping";
import { formatMoney, parseMoney, totalInCents } from "./src/utils/shopping";
import { colors, styles as s } from "./src/theme";

type Filter = "Todos" | "Pendentes" | "Comprados";
type Editor = { kind: "item"; item?: ShoppingItem } | { kind: "budget" } | null;

function ShoppingScreen() {
  const {
    list,
    setList,
    loading,
    loadError,
    saveError,
    saving,
    reload,
    retrySave,
  } = useShoppingList();
  const [filter, setFilter] = useState<Filter>("Todos");
  const [editor, setEditor] = useState<Editor>(null);
  const [budget, setBudget] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const total = totalInCents(list.items);
  const purchased = list.items.filter((item) => item.purchased);
  const spent = totalInCents(purchased);
  const remaining = list.budgetInCents - total;
  const hasBudget = list.budgetInCents > 0;
  const visible = list.items.filter(
    (item) =>
      filter === "Todos" ||
      (filter === "Comprados" ? item.purchased : !item.purchased),
  );

  function saveItem(values: Omit<ShoppingItem, "id" | "purchased">) {
    const edited = editor?.kind === "item" ? editor.item : undefined;
    setList((previous) => ({
      ...previous,
      items: edited
        ? previous.items.map((item) =>
            item.id === edited.id ? { ...item, ...values } : item,
          )
        : [
            ...previous.items,
            {
              ...values,
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              purchased: false,
            },
          ],
    }));
    setEditor(null);
  }
  function removeItem(item: ShoppingItem) {
    Alert.alert("Excluir produto?", `Remover ${item.name} da lista?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () =>
          setList((previous) => ({
            ...previous,
            items: previous.items.filter((value) => value.id !== item.id),
          })),
      },
    ]);
  }
  function openBudget() {
    setBudget(
      hasBudget ? (list.budgetInCents / 100).toFixed(2).replace(".", ",") : "",
    );
    setBudgetError("");
    setEditor({ kind: "budget" });
  }
  function saveBudget() {
    const value = parseMoney(budget);
    if (value === null) {
      setBudgetError("Informe um valor válido, como 250,00.");
      return;
    }
    setList((previous) => ({ ...previous, budgetInCents: value }));
    setEditor(null);
  }

  if (loading)
    return (
      <SafeAreaView style={s.page}>
        <View style={s.center}>
          <ActivityIndicator color={colors.green} />
          <Text style={s.muted}>Abrindo sua lista…</Text>
        </View>
      </SafeAreaView>
    );
  if (loadError)
    return (
      <SafeAreaView style={s.page}>
        <View style={s.center}>
          <Text style={s.heading}>Não foi possível abrir a lista</Text>
          <Text style={s.muted}>
            Seus dados foram preservados. Tente carregar novamente.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={s.button}
            onPress={reload}
          >
            <Text style={s.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={s.page}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: 8 }}>
          <Text style={s.eyebrow}>MENOS IMPULSO, MAIS PLANEJAMENTO</Text>
          <Text style={s.title}>
            Compra Certa<Text style={{ color: colors.green }}>.</Text>
          </Text>
          <Text style={s.muted}>
            Sua lista organizada. Seu bolso tranquilo.
          </Text>
        </View>
        <View
          style={[
            s.card,
            { backgroundColor: colors.ink, borderColor: colors.ink },
          ]}
        >
          <View style={s.between}>
            <Text style={{ color: "#C2D5C8", fontSize: 14 }}>
              ORÇAMENTO DA COMPRA
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar orçamento"
              onPress={openBudget}
              style={{ padding: 10 }}
            >
              <Text style={{ color: "#C5F1AC", fontWeight: "700" }}>
                Editar
              </Text>
            </Pressable>
          </View>
          <Text style={{ color: "white", fontSize: 36, fontWeight: "800" }}>
            {hasBudget ? formatMoney(list.budgetInCents) : "Vamos planejar?"}
          </Text>
          <Text style={{ color: "#DAE6DE", lineHeight: 22 }}>
            {hasBudget
              ? remaining >= 0
                ? `${formatMoney(remaining)} disponíveis após os itens da lista`
                : `${formatMoney(-remaining)} acima do orçamento`
              : "Defina quanto você pretende gastar nesta compra."}
          </Text>
          {hasBudget && (
            <View
              style={{
                height: 7,
                borderRadius: 4,
                backgroundColor: "#41544A",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 7,
                  width: `${Math.min((total / list.budgetInCents) * 100, 100)}%`,
                  backgroundColor: remaining < 0 ? "#FFB4A5" : "#C5F1AC",
                }}
              />
            </View>
          )}
          <View
            style={[
              s.between,
              { borderTopWidth: 1, borderTopColor: "#41544A", paddingTop: 16 },
            ]}
          >
            <View>
              <Text style={{ color: "#C2D5C8" }}>Total previsto</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "700",
                  marginTop: 6,
                }}
              >
                {formatMoney(total)}
              </Text>
            </View>
            <View>
              <Text style={{ color: "#C2D5C8" }}>Já no carrinho</Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: "700",
                  marginTop: 6,
                }}
              >
                {formatMoney(spent)}
              </Text>
            </View>
          </View>
        </View>
        {saveError && (
          <View style={s.card}>
            <Text accessibilityRole="alert" style={s.error}>
              Não conseguimos salvar as últimas alterações no celular. Mantenha
              o app aberto e tente novamente.
            </Text>
            <Pressable accessibilityRole="button" onPress={retrySave}>
              <Text style={s.link}>Tentar salvar novamente</Text>
            </Pressable>
          </View>
        )}
        <View style={s.between}>
          <View>
            <Text style={s.heading}>Minha lista</Text>
            <Text style={s.muted}>
              {purchased.length} de {list.items.length} produtos comprados
            </Text>
          </View>
          <Text style={s.muted}>
            {saving
              ? "Salvando…"
              : saveError
                ? "Não salvo"
                : "Salvo no celular"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {(["Todos", "Pendentes", "Comprados"] as Filter[]).map((value) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: filter === value }}
              key={value}
              onPress={() => setFilter(value)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 24,
                backgroundColor: filter === value ? colors.green : colors.light,
              }}
            >
              <Text
                style={{
                  color: filter === value ? "white" : colors.ink,
                  fontWeight: "600",
                }}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </View>
        {visible.length === 0 ? (
          <View style={[s.card, { alignItems: "center", paddingVertical: 32 }]}>
            <Text style={{ fontSize: 36 }}>🛒</Text>
            <Text style={s.heading}>
              {list.items.length
                ? "Tudo em ordem por aqui"
                : "Sua próxima compra começa aqui"}
            </Text>
            <Text style={[s.muted, { textAlign: "center" }]}>
              {list.items.length
                ? "Nenhum produto neste filtro."
                : "Adicione o primeiro produto e acompanhe o total antes de chegar ao caixa."}
            </Text>
          </View>
        ) : (
          visible.map((item) => (
            <View key={item.id} style={s.card}>
              <View style={s.row}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Marcar ${item.name} como ${item.purchased ? "pendente" : "comprado"}`}
                  accessibilityState={{ checked: item.purchased }}
                  onPress={() =>
                    setList((previous) => ({
                      ...previous,
                      items: previous.items.map((value) =>
                        value.id === item.id
                          ? { ...value, purchased: !value.purchased }
                          : value,
                      ),
                    }))
                  }
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    backgroundColor: item.purchased
                      ? colors.green
                      : colors.light,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 24 }}>
                    {item.purchased ? "✓" : ""}
                  </Text>
                </Pressable>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={[
                      s.text,
                      {
                        fontWeight: "700",
                        textDecorationLine: item.purchased
                          ? "line-through"
                          : "none",
                        color: item.purchased ? colors.muted : colors.ink,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={s.muted}>
                    {item.quantity} × {formatMoney(item.priceInCents)}
                  </Text>
                </View>
                <Text style={[s.text, { fontWeight: "700", flexShrink: 1 }]}>
                  {formatMoney(item.quantity * item.priceInCents)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 20,
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${item.name}`}
                  onPress={() => setEditor({ kind: "item", item })}
                  style={{ padding: 10 }}
                >
                  <Text style={s.link}>Editar</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${item.name}`}
                  onPress={() => removeItem(item)}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: colors.red, fontWeight: "600" }}>
                    Excluir
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
        <Pressable
          accessibilityRole="button"
          style={s.button}
          onPress={() => setEditor({ kind: "item" })}
        >
          <Text style={s.buttonText}>+ Adicionar produto</Text>
        </Pressable>
        <Text style={[s.muted, { textAlign: "center", fontSize: 12 }]}>
          Uma compra de cada vez, dentro do seu orçamento.
        </Text>
      </ScrollView>
      <Modal
        visible={editor !== null}
        animationType="slide"
        onRequestClose={() => setEditor(null)}
      >
        <SafeAreaView style={s.page}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={s.content}
            >
              <View style={s.between}>
                <Text style={[s.heading, { flex: 1 }]}>
                  {editor?.kind === "budget"
                    ? "Seu orçamento"
                    : editor?.kind === "item" && editor.item
                      ? "Editar produto"
                      : "Novo produto"}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setEditor(null)}
                  style={{ padding: 12 }}
                >
                  <Text style={s.link}>Cancelar</Text>
                </Pressable>
              </View>
              {editor?.kind === "item" && (
                <ItemForm
                  key={editor.item?.id ?? "new"}
                  item={editor.item}
                  onSave={saveItem}
                />
              )}
              {editor?.kind === "budget" && (
                <View style={{ gap: 20 }}>
                  <Text style={s.muted}>
                    Quanto você quer gastar? O total previsto inclui todos os
                    produtos, mesmo os que ainda não foram comprados.
                  </Text>
                  <View>
                    <Text style={s.label}>Limite da compra (R$)</Text>
                    <TextInput
                      accessibilityLabel="Orçamento em reais"
                      autoFocus
                      style={s.input}
                      keyboardType="decimal-pad"
                      placeholder="Ex.: 250,00"
                      value={budget}
                      onChangeText={setBudget}
                      maxLength={10}
                    />
                  </View>
                  <Text style={s.muted}>
                    Digite 0 para deixar a lista sem limite definido.
                  </Text>
                  {!!budgetError && (
                    <Text accessibilityRole="alert" style={s.error}>
                      {budgetError}
                    </Text>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    style={s.button}
                    onPress={saveBudget}
                  >
                    <Text style={s.buttonText}>Salvar orçamento</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <ShoppingScreen />
    </SafeAreaProvider>
  );
}
