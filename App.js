const express = require("express");

// Porta TCP do servidor HTTP da aplicação
const port = 3000; 

const app = express();

/*étodo express.get necessita de dois parametros
Na ARRW FUNCTION, o primeiro são os dados do servidor 
(REQUISITION -'req') o segundo, são os dados que serão
enviados ap cliente (RESULT -'res')*/
app.get('/', (req, res) => {
    res.send("Olá Sesi!");
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}!`);

}); 
