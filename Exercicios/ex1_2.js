// Para usar o prompt no nodejs é preciso instalar essa lib 'prompt-sync'

let prompt = require("prompt-sync");
prompt = prompt();

// const n1 =prompt("Digite o primeiro número");
// console.log(n1);

 let value = parseFloat(prompt("Qual é o preço do produto: "));
 let desconto = parseFloat(prompt("Qual é o valor do desconto: "));

 function calcularDesconto(preco, desconto){
     const resultado = preco - (preco * desconto / 100);
     console.log("O valor com desconto é:", resultado);
}