const http = require("http");
const url = require("url");
const { Pool } = require("pg");

const pool = new Pool({
  user: "druva",
  host: "localhost",
  database: "todo_db",
  password: "8055",
  port: 5432,
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  // === ROUTE: /todos ===
  if (path === "/todos") {
    switch (req.method) {
      case "GET":
        pool.query("SELECT * FROM todo ORDER BY id", (err, result) => {
          res.statusCode = err ? 500 : 200;
          res.end(JSON.stringify(err ? { error: err.message } : result.rows));
        });
        break;

      case "POST":
        let postBody = "";
        req.on("data", (chunk) => {
          postBody += chunk.toString();
        });
        req.on("end", () => {
          try {
            const {
              text,
              completed = false,
              due_date = "",
              notes = "",
            } = JSON.parse(postBody);

            const formattedDueDate = due_date === "" ? null : due_date;
            pool.query(
              "INSERT INTO todo (text, completed, due_date, notes) VALUES ($1, $2, $3, $4) RETURNING *",
              [text, completed, formattedDueDate, notes],
              (err, result) => {
                res.statusCode = err ? 500 : 201;
                res.end(
                  JSON.stringify(err ? { error: err.message } : result.rows[0]),
                );
              },
            );
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

    // === ROUTE: /todos/:id ===
  } else if (path.startsWith("/todos/")) {
    const id = parseInt(path.split("/")[2]);

    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid Todo ID" }));
      return;
    }

    switch (req.method) {
      case "PUT":
        let putBody = "";
        req.on("data", (chunk) => {
          putBody += chunk.toString();
        });
        req.on("end", () => {
          try {
            const { text, completed, due_date, notes } = JSON.parse(putBody);
            const formattedDueDate = due_date === "" ? null : due_date;
            pool.query(
              "UPDATE todo SET text = $1, completed = $2, due_date = $3, notes = $4 WHERE id = $5 RETURNING *",
              [text, completed, formattedDueDate, notes, id],
              (err, result) => {
                res.statusCode = err ? 500 : result.rows.length ? 200 : 404;
                res.end(
                  JSON.stringify(
                    err
                      ? { error: err.message }
                      : result.rows.length
                        ? result.rows[0]
                        : { error: "Todo Not Found" },
                  ),
                );
              },
            );
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        break;

      case "DELETE":
        pool.query("DELETE FROM todo WHERE id = $1", [id], (err) => {
          res.statusCode = err ? 500 : 204;
          res.end(err ? JSON.stringify({ error: err.message }) : "");
        });
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

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
