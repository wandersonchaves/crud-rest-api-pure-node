# Criar API REST e CRUD em NODEJS sem nenhum framework

Neste post, vamos construir APIs REST no NODEJS do zero, sem nenhum framework e implementar a funcionalidade CRUD (CREATE, READ, UPDATE e DELETE).

## Exigências

- Baixar e instalar [Node Js](https://nodejs.org/en/download/).
- Baixar e instalar [Post Man](https://www.postman.com/downloads/)
- Você deve ter algum conhecimento básico sobre [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) e [ES6](http://es6-features.org/#Constants).
- Curiosidade e interesse ;)

## Configuração do servidor

Vamos requerer o módulo http no arquivo app.js e atribuí-lo à variável http.

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

`request` and `response` variables provide the functionality to read a request from our client and send back a response to the client respectively. Both request and response don’t maintain their own states to store data.

In the above function, we are sending a response where first we are writing the response header what kind of response we are sending to the browser or client. In the header, we are sending 200 which is a status code.

Status code defines what kind of response you want to send like if you didn’t find any user in database as per user's request you can send 404 which means not found. 200 status code means successful. You can read more about the status codes in [Official Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

And another parameter in the header is what kind of data we are going to send like JSON, plain text or HTML. So we are going to send json we had defined `application/json`.

Now in next line `response.write()` are passing json object as a String because data travels in connection only in String form.

Let's end our response stream by calling `response.end()` which tells that response ends here to the client.

After that let's bound our server variable to `Listening` event will be emitted to listen to a specific port number.

```js
server.listen(9000, () => {
  console.log(`Server running on Port 9000`);
});
```

`.listen` is an asynchronous function where we are passing a callback function that will console the string `Server running on Port 9000`.

We can now run our program. To run a program open a terminal and go to the app.js's directory and run node app.js

Yeah!!! Now our server is running

![node crud server running](https://codeparadox.in/static/54b6ef878927d31d40737890068d9803/c5009/node-crud-server-running.png "node crud server running")

we can hit the URL `http://localhost:9000` in postman. let's see the response.

![node crud json request](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud json request")

Yess!!!!! our server is sending response too.

Now we can see our response's Headers. In Header Content-Type of our application is application/json/ and some other stuff.

![node crud headers response](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud headers response")

## Creating API

Let’s move to create an API. For API we need to define the [HTTP Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methodss) and [HTTP Url](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL).

We can Get Url and it’s Method By Request Parameter.

```js
const server = http.createServer((request, response) => {
  console.log(`Url is ${request.url} and Method is ${request.method}`);
});
```

Request:

![node crud server get method](https://codeparadox.in/static/c68ba8d67d5d76454b8c9b1915c17ecc/861bd/node-crud-server-get-method.png "node crud server get method")

Console:

![node crud response get method](https://codeparadox.in/static/d2b5581ec7f6a4b591285a7e983fe656/b40ed/node-crud-response-get-method.png "node crud response get method")

We can differentiate between in URLs with the help of Method and URL.

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

## Crud Application

We are going to create REST APIs for small Contact Application where we are going to perform CRUD operations.

For Database let's take an array which we are going to declare at Global Scope. But always remember that if we are going to restart our application then our array will be empty every time.

### Create :

Now let’s create a user contact object for that we are going to use the post Http method. In the switch case of our createServer function, we need to make a case for post request.

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

And to retrieve the data from client side. we can make our own body-parser not the same just a small replica.

If you have worked with express js then you probably familiar with body-parser. If not then just simply understand that body-parser is a library that extracts the entire body portion of an incoming request stream and exposes it on `req.body` as something easier to interface with.

So let's implement our function.

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

Here in the above code, we made an async bodyParser Function in which we are returning a new Promise in which we have declared a total chunked variable which is a string type.

Node is an event-driven io. So bodyParser Function is listening on error first if we got an error than promise will be rejected if not then on data event we are going to concatenate all data which is coming from the client which is in a buffered form so it is a chunk data.

After that request event is going to end than we parsed our total chunked string into a JSON object which is a readable and understandable form for us then assigning that object into `request.body`.

Now we have created a separate function postHandler where we have to await for bodyParser after we are pushing our user contact info from request.body into our global array or DB and sending our response.

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

In the server function, we are only calling postHandler in Post case where we have passed request and response in POST method.

![node crud post method request response](https://codeparadox.in/static/643d0afaf5b1e587a5fb5913666028ab/861bd/node-crud-post-method-request-response.png "node crud post method request response")

Now our Post is working. Let's move on to Read.

### Read :

In read we just basically have to return our DB or array.

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

We just created the case for GET method wherein GET case we are calling the `getPosts` Method where we are passing the request and response.

And In `getPosts` Method we are just writing Headers and Stringfy our JSON into String then writing Responses for Client and returning that response.

![node crud response get method response](https://codeparadox.in/static/913dc04120dd9e1c9defe77de7e85e24/861bd/node-crud-response-get-method-response.png "node crud response get method response")

### Update :

In Put Http Request we are going to update the db for specific contact by db index.

This is not an efficient way to update DB by index but here we are going to do that and we can update on the id of contact but we didn't make an id field in starting so let's continue with the index but you can improve by doing with the id of a particular contact.

So Url is not going to fixed so we are not going to check for fixed url in PUT case.

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

We are calling putPosts function in which is our handler function to handle put request where we are passing request and response to it.

putPosts is asynchronous where we are splitting the URL to get our id's value that id will help us to find contact info for a specific user.

After we check that param is `id` then we are calling our body-parser after that we just assigning value to that particular index value than returning our DB as a response to the client.

![node crud json request](https://codeparadox.in/static/5bb4312567653d1feb85f8685570b99c/861bd/node-crud-json-request.png "node crud json request")

### Delete :

So similarly like we implemented PUT case and we going to implement DELETE case with a little tweak in `deletePost` handler function we are going to splice array on the particular requested index.

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

### Conclusion

We have implemented REST API and Crud Functionality in Node Js without any framework. I didn't use an optimized way. It was one of the ways to implement. Thanks for reading. if you found any issues or you have any query please [contact](https://codeparadox.in/contact/).

### Source Code

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
