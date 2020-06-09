# Criar API REST e CRUD em NODEJS sem nenhum framework

Neste post, vamos construir APIs REST no NODEJS do zero, sem nenhum framework e implementar a funcionalidade CRUD (CREATE, READ, UPDATE e DELETE).

## Exigências

- Baixar e instalar [Node Js](https://nodejs.org/en/download/).
- Baixar e instalar [Post Man](https://www.postman.com/downloads/)
- Você deve ter algum conhecimento básico sobre [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) e [ES6](http://es6-features.org/#Constants).
- Curiosidade e interesse ;)

## Configuração do servidor

Vamos chamar o módulo http no arquivo app.js e atribuí-lo à variável http.

```js
const http = require("http");
```

Agora vamos criar nosso servidor chamando a função createServer () do módulo http, que é uma função assíncrona e aceita uma função de retorno de chamada como parâmetro, onde vamos passar dois parâmetros `request` e `response` em seguida, atribua essa função CreateServer () ao `const = server` variável.

```js
const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify(JSON.stringify({ message: "Hello World!" })));
  response.end();
});
```

`request` e `response` são variáveis que fornecem a funcionalidade de ler uma request do nosso cliente e enviar uma response ao cliente, respectivamente. A request e a response não mantêm seus próprios estados para armazenar dados.

Na função acima, estamos enviando uma response, onde primeiro escrevemos o cabeçalho da response, que tipo de response estamos enviando para o navegador ou cliente. No cabeçalho, estamos enviando 200, que é um código de status.

O código de status define o tipo de response que você deseja enviar, se não encontrou nenhum usuário no banco de dados, conforme a request do usuário, você pode enviar 404, o que significa que não foi encontrado. Código de status 200 significa bem-sucedido. Você pode ler mais sobre os códigos de status em [Official Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

E outro parâmetro no cabeçalho é que tipo de dados enviaremos como JSON, texto sem formatação ou HTML. Então, vamos enviar json que definimos `application/json`.

Agora na próxima linha `response.write()` estão passando o objeto json como uma String porque os dados viajam em conexão apenas no formato String.

Vamos terminar nosso fluxo de response chamando `response.end()` que diz que a response termina aqui para o cliente.

Depois disso, vamos vincular nossa variável de servidor a `Listening` evento será emitido para ouvir um número de porta específico.

```js
server.listen(9000, () => {
  console.log(`Server running on Port 9000`);
});
```

`.listen` é uma função assíncrona em que estamos passando uma função de retorno de chamada no console da string `Server running on Port 9000`.

Agora podemos executar nosso programa. Para executar um programa, abra um terminal e vá para o diretório do app.js e execute o node app.js

Sim!!! Agora nosso servidor está rodando

![node crud server running](https://codeparadox.in/static/54b6ef878927d31d40737890068d9803/c5009/node-crud-server-running.png "node crud server running")

podemos acessar o URL `http://localhost:9000` no postman. vamos ver a response.

![node crud json request](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud json request")

Sim !!!!! nosso servidor está enviando response também.

Agora podemos ver os cabeçalhos de nossa response. No cabeçalho, o Content-Type de nosso aplicativo é application/json/ e algumas outras coisas

![node crud headers response](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud headers response")

## Criando API

Vamos começar a criar uma API. Para a API, precisamos definir o [HTTP Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methodss) e [HTTP Url](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL).

Podemos obter URL e é o método por Request Parameter

```js
const server = http.createServer((request, response) => {
  console.log(`Url is ${request.url} and Method is ${request.method}`);
});
```

Request:

![node crud server get method](https://codeparadox.in/static/c68ba8d67d5d76454b8c9b1915c17ecc/861bd/node-crud-server-get-method.png "node crud server get method")

Console:

![node crud response get method](https://codeparadox.in/static/d2b5581ec7f6a4b591285a7e983fe656/b40ed/node-crud-response-get-method.png "node crud response get method")

Podemos diferenciar entre URLs com a ajuda de Method e URL.

```js
const server = http.createServer((request, response) => {
  let url = request.url;
  let method = request.method;

  switch (method) {
    case "GET":
      if (url === "/") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ message: "Hello World" }));
        response.end();
      }
      break;

    default:
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.write("Url Not Found");
      response.end();
  }
});
```

Response:

![node crud create api response](https://codeparadox.in/static/dc27bd1d1431c5e3b64ea3bd0e36ec06/861bd/node-crud-create-api-response.png "node crud create api response")

## Crud Aplicação

Vamos criar APIs REST para pequenas aplicações de contato, nas quais vamos executar operações CRUD.

Para o banco de dados, vamos usar uma matriz que declararemos no escopo global. Mas lembre-se sempre de que, se formos reiniciar nosso aplicativo, nossa matriz estará vazia toda vez.

### Criar :

Agora vamos criar um objeto de contato do usuário para o qual usaremos o post Http method. No caso de opção de nossa função createServer, precisamos defender uma post request.

```js
switch (method) {
case "POST":
if (url === "/post") {
response.writeHead(200, { "Content-Type": "application/json" });
response.write(JSON.stringify({ message: "Hello From Post" }));
response.end();
}
break;
default:
response.writeHead(200, { "Content-Type": "text/plain" });
response.write("Url Not Found");
response.end();
}
});
```

E para recuperar os dados do lado do cliente. podemos fazer nosso próprio body-parser não ser o mesmo, apenas uma pequena réplica

Se você trabalhou com express js, provavelmente conhece o body-parser. Caso contrário, simplesmente entenda que body-parser é uma biblioteca que extrai toda a parte do corpo de um fluxo de requests recebidas e a expõe no `req.body` como algo mais fácil de interagir com.

Então, vamos implementar nossa função.

```js
async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let totalChunked = "";
    request
      .on("error", (err) => {
        console.error(err);
        reject();
      })
      .on("data", (chunk) => {
        totalChunked += chunk; // Data is in chunks, concatenating in totalChunked
      })
      .on("end", () => {
        request.body = JSON.parse(totalChunked); // Adding Parsed Chunked into request.body
        resolve();
      });
  });
}
```

Aqui no código acima, criamos uma função assíncrona bodyParser, na qual estamos retornando uma nova promessa na qual declaramos uma variável em partes total, que é um tipo de string.

O Node é um event-driven io. Portanto, a função bodyParser está ouvindo o erro primeiro, se recebermos um erro do que o prometido será rejeitado, caso contrário, no evento de dados, vamos concatenar todos os dados provenientes do cliente que estão em forma de buffer, portanto, são dados de partes.

Depois que esse evento de request termina, analisamos nossa cadeia total de partes em um objeto JSON, que é uma forma legível e compreensível para nós e, em seguida, atribuímos esse objeto a `request.body`.

Agora, criamos uma função separada postHandler, na qual temos que aguardar bodyParser depois de enviarmos as informações de contato do usuário de request.body para nossa matriz global ou banco de dados e enviar nossa response.

```js
/_
handles post request
_/
async function postHandler(request, response) {
try {
await bodyParser(request)
db.push(request.body)
response.writeHead(200, { "Content-Type": "application/json" })
response.write(JSON.stringify(db))
response.end()
} catch (err) {
response.writeHead(400, { "Content-type": "text/plain" })
response.write("Invalid body data was provided")
response.end()
}
}

// Server configuration
const server = http.createServer((request, response) => {
let url = request.url
let method = request.method

switch (method) {
case "POST":
if (url === "/post") {
postHandler(request, response)
}
break
default:
response.writeHead(200, { "Content-Type": "text/plain" })
response.write("Url Not Found")
response.end()
}
})
```

Na função do servidor, estamos apenas chamando postHandler no caso Post em que passamos request e response no método POST.

![node crud post method request response](https://codeparadox.in/static/643d0afaf5b1e587a5fb5913666028ab/861bd/node-crud-post-method-request-response.png "node crud post method request response")

Agora nosso Post está funcionando. Vamos para o Read.

### Read :

Na leitura, basicamente temos que retornar nosso banco de dados ou matriz.

```js
const server = http.createServer((request, response) => {
  let url = request.url;
  let method = request.method;

  switch (method) {
    case "POST":
      if (url === "/post") {
        postHandler(request, response);
      }
      break;
    // Get Case where we are handling /post url
    case "GET":
      if (url === "/post") {
        getPosts(request, response);
      }
      break;

    default:
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid URL");
      response.end();
  }
});

// Returning the DB array.
const getPosts = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify(db));
  response.end();
};
```

Acabamos de criar o caso para o método GET, em que caso GET estamos chamando o método `getPosts`, onde estamos passando a request e response.

E no método `getPosts`, estamos apenas escrevendo Headers e Stringfy nosso JSON em String, depois escrevendo Responses for Client e retornando essa response.

![node crud response get method response](https://codeparadox.in/static/913dc04120dd9e1c9defe77de7e85e24/861bd/node-crud-response-get-method-response.png "node crud response get method response")

### Update :

Em request Put Http, vamos atualizar o banco de dados para contato específico pelo índice de banco de dados.

Essa não é uma maneira eficiente de atualizar o banco de dados por índice, mas aqui vamos fazer isso e podemos atualizar o ID do contato, mas não criamos um campo de ID no início. Vamos continuar com o índice, mas você pode melhorar fazendo com a identificação de um contato específico.

Portanto, o URL não será corrigido, portanto não verificaremos o URL fixo no caso PUT.

```js
const server = http.createServer((request, response) => {
  let url = request.url;
  let method = request.method;

  switch (method) {
    case "POST":
      if (url === "/post") {
        postHandler(request, response);
      }
      break;

    case "GET":
      if (url === "/post") {
        getPosts(request, response);
      }
      break;

    // Case for PUT HTTP request
    case "PUT":
      putPosts(request, response);
      break;

    default:
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid URL");
      response.end();
  }
});

// putPosts Handler Function which is going to handle put requests.
async function putPosts(request, response) {
  try {
    // Getting url for request stream.
    let url = request.url;

    // Js string function to split url
    let idQuery = url.split("?")[1];
    let idKey = idQuery.split("=")[0]; // index of our DB array which will be id
    let idValue = idQuery.split("=")[1]; // Index Value

    if (idKey === "id") {
      // Calling bodyParser to get Data from request stream
      await bodyParser(request);

      // Appending Request body into provided index
      db[idValue - 1] = request.body;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(db));
      response.end();
    } else {
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid Query");
      response.end();
    }
  } catch (err) {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid body data was provided", err.message);
    response.end();
  }
}
```

Estamos chamando a função putPosts, na qual é nossa função de manipulador para manipular a request de put onde estamos passando a request e a response a ela.

outPosts é assíncrono, onde dividimos o URL para obter o valor do seu ID, que nos ajudará a encontrar informações de contato para um usuário específico.

Depois de verificarmos que param é `id` ', chamaremos nosso analisador de corpo e depois atribuímos valor a esse valor de índice específico do que retornar nosso banco de dados como response ao cliente.

![node crud json request](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud json request")

### Delete :

Da mesma forma que implementamos o caso PUT e vamos implementar o caso DELETE com um pequeno ajuste na função do manipulador `deletePost`, vamos dividir a matriz no índice solicitado em particular.

```js
const deletePost = (request, response) => {
  let url = request.url;

  let idQuery = url.split("?")[1];
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];

  if (idKey === "id") {
    db.splice(idValue - 1, 1);
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Delete Success");
    response.end();
  } else {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid Query");
    response.end();
  }
};
const server = http.createServer((request, response) => {
  let url = request.url;
  let method = request.method;
  console.log(method, url);
  switch (method) {
    case "POST":
      if (url === "/post") {
        postHandler(request, response);
      }
      break;

    case "GET":
      if (url === "/post") {
        getPosts(request, response);
      }
      break;

    case "PUT":
      putPosts(request, response);
      break;

    // Delete Case
    case "DELETE":
      deletePost(request, response);
      break;

    default:
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid URL");
      response.end();
  }
});
server.listen(9000, () => {
  console.log(`Server running on Port 9000`);
});

// Delete Post Handler
const deletePost = (request, response) => {
  let url = request.url;

  let idQuery = url.split("?")[1];
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];

  if (idKey === "id") {
    db.splice(idValue - 1, 1); // Splicing Array or DB.

    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Delete Success");
    response.end();
  } else {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid Query");
    response.end();
  }
};
```

### Conclusão

Implementamos a API REST e a funcionalidade Crud no NODEJS sem nenhum framework. Não usei de maneira otimizada. Foi uma das maneiras de implementar. Obrigado pela leitura. Se você encontrou algum problema ou tiver alguma dúvida, por favor [contact](https://codeparadox.in/contact/).

### Código Fonte

#### App.js

```js
const http = require("http");

let db = [];

async function bodyParser(request) {
  return new Promise((resolve, reject) => {
    let totalChunked = "";
    request
      .on("error", (err) => {
        console.error(err);
        reject();
      })
      .on("data", (chunk) => {
        totalChunked += chunk;
      })
      .on("end", () => {
        request.body = JSON.parse(totalChunked);
        resolve();
      });
  });
}
async function postHandler(request, response) {
  try {
    await bodyParser(request);

    db.push(request.body);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(db));
    response.end();
  } catch (err) {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid body data was provided", err.message);
    response.end();
  }
}
const getPosts = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify(db));
  response.end();
};

async function putPosts(request, response) {
  try {
    let url = request.url;

    let idQuery = url.split("?")[1];
    let idKey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];

    if (idKey === "id") {
      await bodyParser(request);

      db[idValue - 1] = request.body;
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(db));
      response.end();
    } else {
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid Query");
      response.end();
    }
  } catch (err) {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid body data was provided", err.message);
    response.end();
  }
}
const deletePost = (request, response) => {
  let url = request.url;

  let idQuery = url.split("?")[1];
  let idKey = idQuery.split("=")[0];
  let idValue = idQuery.split("=")[1];

  if (idKey === "id") {
    db.splice(idValue - 1, 1);
    response.writeHead(200, { "Content-type": "text/plain" });
    response.write("Delete Success");
    response.end();
  } else {
    response.writeHead(400, { "Content-type": "text/plain" });
    response.write("Invalid Query");
    response.end();
  }
};
const server = http.createServer((request, response) => {
  let url = request.url;
  let method = request.method;
  console.log(method, url);
  switch (method) {
    case "POST":
      if (url === "/post") {
        postHandler(request, response);
      }
      break;

    case "GET":
      if (url === "/post") {
        getPosts(request, response);
      }
      break;

    case "PUT":
      putPosts(request, response);
      break;

    case "DELETE":
      deletePost(request, response);
      break;

    default:
      response.writeHead(400, { "Content-type": "text/plain" });
      response.write("Invalid URL");
      response.end();
  }
});
server.listen(9000, () => {
  console.log(`Server running on Port 9000`);
});
```
