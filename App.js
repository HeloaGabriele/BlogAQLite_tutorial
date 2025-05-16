const express = require("express"); // Importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
// const bodyParser = require("body-parser"); // Importa o body-parser
const session = require("express-session");

// Porta TCP do servidor HTTP da aplicação
const port = 3000;

let config = { Title: "", footer: "" };

const app = express(); // Instancia para uso do Express

// Instancia para o uso do sqlite3, e usa o arquivo 'user.db'
const db = new sqlite3.Database("user.db");

// ESte método permite enviar comandos SQL em modo 'sequencial'
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT,
        email TEXT, tel TEXT, cpf TEXT, rg TEXT)`
  );
});

// Configuração para uso de sessão (cookies) com Express
app.use(
  session({
    secret: "qualquersenha",
    resave: true,
    saveUninitialized: true,
  })
);

// __dirname é a variável interna do nodejs que guarda o caminho absoluto do projeto, no SO
// console.log(__dirname + "/static");

// Aqui será acrescentado uma rota "/static", para a pasta __dirname + "/static"
// O app.use é usado para acrescentar rotas novas para o  Express gerenciar e pode usar
// Middleware para isto, que neste caso é o express.static, que gerencia rotas esáticas
app.use("/static", express.static(__dirname + "/static"));

// Middleware para processar as requisições do Body Parameters do cliente
app.use(express.urlencoded({ extended: true }));

// Configurar EJS como motor de visualização
app.set("view engine", "ejs");

// Cria conexão com o banco de dados

// const index = "<a href='/sobre'> Sobre</a><<a href='/login'> login</a><a href='/cadastro'> cadastro</a>";
// const sobre = 'Vc está na página "sobre"<br><a href="/">Voltar</a>';
// const login = 'Vc está na página "login"<br><a href="/">Voltar</a>';
// const cadastro = 'Vc está na página "cadastro"<br><a href="/">Voltar</a>';

/* Método express.get necessita de dois parametros
Na ARRW FUNCTION, o primeiro são os dados do servidor 
(REQUISITION -'req') o segundo, são os dados que serão
enviados ap cliente (RESULT -'res') */
app.get("/", (req, res) => {
  // res.send(index);
  console.log("GET /index");
  config = { Title: "Blog da Turma I2HNA -  Sesi de Nova Odessa", footer: "" };
  // res.render("pages/index", config);
  // console.log(`${JSON.stringify({...config, req: req})}`);
  res.render("pages/index", { ...config, req: req });

  // res.redirect("/cadastro")//Redireciona para a ROTA cadastro.
});

app.get("/usuarios", (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, (err, row) => {
    console.log(`GET /usuarios ${JSON.stringify(row)}`);
    // res.send("Lista de Usuários.");
    res.render("partials/usertable", { ...config, req: req });
  });
});

app.get("/dashboard", (req, res) => {
  console.log("GET /dashboard");
  console.log(`req.body: ${JSON.stringify(req.body)}`);
  // config = { Title: "Página de Dashboard", footer: "" };
  // res.render("pages/dashboard", { ...config, req: req });

  if (req.session.loggedin) {
    db.all("SELECT * FROM users", [], (err, row) => {
      if (err) throw err;

      console.log(JSON.stringify(row));
      
      res.render("pages/dashboard", { ...config,
        titulo: "DASHBOARD",
        dados: row,
        req: req,
      });
    });
  } else {
    console.log("Tentativa de acesso a área restrita");
    res.redirect("/");
  }
});

app.get("/sobre", (req, res) => {
  console.log("GET /sobre");
  config = { Title: "Página de Informações", footer: "" };
  res.render("pages/sobre", { ...config, req: req });
});

app.get("/login", (req, res) => {
  console.log("GET /login");
  config = { Title: "Página de Login", footer: "" };
  res.render("pages/login", { ...config, req: req });
});

app.post("/login", (req, res) => {
  console.log("POST /login");
  const { username, password } = req.body;
  console.log(`req.body: ${JSON.stringify(req.body)}`)

  // Consultar o usuário no banco de dados
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  db.get(query, [username, password], (err, row) => {
    if (err) throw err;
    console.log(`row: ${JSON.stringify(row)}`)
    // Se usuário válido -> registra a sessão e redireciona para o dashboard
    if (row) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect("/dashboard");
    } // Se não, envia mensagem de erro (Usuário Inválido)
    else {
      res.send("Usuário Inválido.");
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/cadastro", (req, res) => {
  console.log("GET /cadastro");
  config = { Title: "Página de Cadastro", footer: "" };
  res.render("pages/cadastro", { ...config, req: req });
});

app.post("/cadastro", (req, res) => {
  console.log("POST /cadastro");
  req.body
    ? console.log(JSON.stringify(req.body))
    : console.log(`Body vazio: ${req.body}`);

  const { username, password, email, tel, cpf, rg } = req.body;

  //colocar aqui as validações e inclusão no banco de dados do cadastro do usuário
  // 1. Validar campos

  // 2. Verificar se ele ja existe no banco
  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], (err, row) => {
    if (err) throw err;

    if (row) {
      // A variável 'row' irá retornar os dados do banco de dados
      // Executado atráves do SQL, variável query
      res.send("Usuário já cadastrado! Por favor refaça o cadastro");
    } else {
      // 3. Se o usuário não existe no banco cadastrar
      const insertQuery =
        "INSERT INTO users (username, password, email, tel, cpf, rg) VALUES (?,?,?,?,?,?)";
      db.run(insertQuery, [username, password, email, tel, cpf, rg], (err) => {
        // Inserir a lógica INSERT
        if (err) throw err;
        res.send("Usuário cadastrado com sucesso!");
      });
    }
  });
  // res.send(`Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email}`);
});

app.use("*", (req, res) => {
  config = {Title: "Error 404", footer: ""};
  res.status(404).render("pages/404", {...config, req: req});
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(port, () => {
  console.log(`Servidor sendo executado na porta ${port}!`);
});
