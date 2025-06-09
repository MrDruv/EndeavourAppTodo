const http = require("http");
const url = require("url");

const todos = [];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*"); // For simplicity, allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (path === "/todos") {
    switch (req.method) {
      case "GET":
        res.statusCode = 200;
        res.end(JSON.stringify(todos));
        break;

      case "POST":
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const newTodo = JSON.parse(body);
            todos.push(newTodo);
            res.statusCode = 201;
            res.end(JSON.stringify(newTodo));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        break;

      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  } else if (path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2]);

    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid Todo ID" }));
      return;
    }

    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Todo Not Found" }));
      return;
    }

    switch (req.method) {
      case "PUT":
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const updatedTodo = JSON.parse(body);
            todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
            res.statusCode = 200;
            res.end(JSON.stringify(todos[todoIndex]));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        break;
      case "DELETE":
        todos.splice(todoIndex, 1);
        res.statusCode = 204;
        res.end();
        break;
      case "GET":
        res.statusCode = 200;
        res.end(JSON.stringify(todos[todoIndex]));
        break;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
