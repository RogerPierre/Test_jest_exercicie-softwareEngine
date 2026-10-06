import { formatMoney, parseMoney } from "./shopping";


describe("testes de formatação de valores monetarios",()=>{
    const testNumber:number=1050
    const textTest="10,50"
    const textTestModify:string=(testNumber).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
    it("testar a função parseMoney retorna numero valido",()=>{
        expect(parseMoney(textTest)).toBe(testNumber)
    })
    it("testar a função parseMoney retorna null quando invalido",()=>{
        expect(parseMoney("Texto Invalido para teste")).toBe(null)
    })

})
