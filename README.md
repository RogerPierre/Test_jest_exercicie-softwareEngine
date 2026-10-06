# Compra Certa

Aplicativo didático de lista de compras com orçamento, construído com React Native, Expo e TypeScript para Android e iOS. Esta é a versão inicial **sem testes automatizados**, sem bibliotecas de teste e sem gabarito: os testes serão desenvolvidos durante as aulas.

## Executar

Pré-requisitos: Node.js LTS compatível com o Expo SDK 57, npm e Expo Go compatível com SDK 57 no celular. O projeto foi gerado a partir do template oficial `blank-typescript`; as versões exatas estão em `package-lock.json`.

```sh
cd compra-certa
npm ci
npm start
```

Com o computador e celular na mesma rede, escaneie o QR Code pelo Expo Go no Android ou pela câmera no iOS. Se a versão do Expo Go não suportar o SDK do projeto, consulte https://expo.dev/go para as opções compatíveis.

Com os ambientes nativos instalados, use `npm run android` para Android ou `npm run ios` para o simulador iOS no macOS. Não é necessário backend, conta ou chave de API.

## Funcionalidades

- Definir e editar o orçamento da compra.
- Adicionar, editar e excluir produtos com confirmação de exclusão.
- Informar quantidade inteira e preço unitário em reais.
- Marcar e desmarcar produtos comprados.
- Filtrar todos os produtos, pendentes ou comprados.
- Consultar total previsto, total no carrinho e saldo do orçamento.
- Salvar a lista automaticamente no celular com AsyncStorage.
- Exibir estados vazios, validações, carregamento e falhas de armazenamento.

## Regras de negócio

A lista começa vazia e sem orçamento. Orçamento zero significa ausência de limite. O total previsto considera todos os produtos; o total no carrinho considera apenas os marcados como comprados. Ultrapassar o orçamento exibe a diferença, mas não bloqueia a inclusão de produtos.

O nome deve ter de 1 a 60 caracteres após remover espaços nas pontas. A quantidade é inteira, de 1 a 999. O preço deve ser positivo; o orçamento pode ser zero. Valores monetários aceitam vírgula ou ponto decimal, até duas casas decimais e no máximo sete dígitos inteiros, sem separadores de milhares. Os cálculos e o armazenamento usam centavos inteiros. Produtos de mesmo nome são permitidos.

Há uma única lista local. Os dados permanecem ao reiniciar o app, mas não são sincronizados entre celulares. Excluir os dados do aplicativo pode apagar a lista. Não há login, descontos, histórico, API externa ou conclusão de compra nesta versão.

## Organização para as aulas

```text
App.tsx                       Tela principal e ações da lista
src/components/ItemForm.tsx    Formulário de inclusão e edição
src/hooks/useShoppingList.ts   Estado, carregamento e gravações em sequência
src/services/storage.ts       Leitura, validação e gravação no AsyncStorage
src/types/shopping.ts          Tipos de produto e lista
src/utils/shopping.ts          Conversão monetária, totais e validação
src/theme.ts                  Cores e estilos compartilhados
```

O projeto usa hooks do React e componentes nativos, sem biblioteca de estado global ou navegação, para manter a base pequena. A separação permite introduzir testes gradualmente: funções de negócio, formulário, armazenamento e fluxos completos. Nenhuma dessas suítes está implementada.

## Verificação manual sugerida

1. Abrir o app e definir orçamento de R$ 100,00.
2. Adicionar Arroz, quantidade 2, preço R$ 25,50. Total previsto: R$ 51,00; saldo: R$ 49,00.
3. Marcar Arroz como comprado. Total no carrinho: R$ 51,00. Conferir os três filtros.
4. Editar a quantidade para 4. Total previsto: R$ 102,00, ultrapassando o orçamento em R$ 2,00.
5. Tentar salvar um produto sem nome, com quantidade zero ou preço inválido. Conferir as mensagens.
6. Cancelar a exclusão e verificar que o produto permanece; confirmar a exclusão e verificar os totais.
7. Adicionar produtos novamente, fechar e reabrir o app e conferir a persistência.

## Verificações de desenvolvimento

```sh
npm run typecheck
npx expo install --check
npx expo export --platform android --platform ios
```

Esses comandos verificam tipos, compatibilidade de dependências e geração dos bundles. Não substituem a execução no celular nem constituem uma suíte de testes automatizados.

Documentação do template: https://docs.expo.dev/more/create-expo/
