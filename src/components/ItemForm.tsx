import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ShoppingItem } from "../types/shopping";
import { parseMoney, validateItem } from "../utils/shopping";
import { styles as s } from "../theme";


export function ItemForm() {
  return (
    <View style={{ gap: 20 }}>
      <Text>Testando minha tela </Text>
        <Text style={s.label}>Produto</Text>
      <Pressable testID="button-test" accessibilityRole="button" style={s.button} onPress={() => console.log('retorna nda')}>
        <Text style={s.buttonText}>
          {"Adicionar à lista"}
        </Text>
      </Pressable>
    </View>
  );
}


