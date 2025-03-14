const express = require("express");

// Porta TCP do servidor HTTP da aplicação
const port = 3000;

const app = express();

const index = "<a href='/sobre'> Sobre</a><a href='/info'> Info</a>";
const sobre = 'Vc está na página "sobre"<br><a href="/">Voltar</a>';
const info = 'Vc está na página "info"<br><a href="/">Voltar</a>';

/*étodo express.get necessita de dois parametros
Na ARRW FUNCTION, o primeiro são os dados do servidor 
(REQUISITION -'req') o segundo, são os dados que serão
enviados ap cliente (RESULT -'res')*/
app.get('/', (req, res) => {
    res.send(index);
});

app.get("/sobre", (req,res) => {
    res.send(sobre);
});

app.get("/info", (req, res) => {
    res.send(info);
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}!`);
}); 
