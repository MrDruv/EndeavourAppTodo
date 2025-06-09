const http = require('http');
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'todos.json');
const PORT = process.env.PORT || 5000;

function readTodos() {
  const data = fs.readFileSync(file, 'utf-8');
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(file, JSON.stringify(todos, null, 2));
}

const server = http.createServer((req, res) => {
  const [_, base, id] = req.url.split('/');
  
  if (base === 'todos') {
    if (req.method === 'GET' && !id) {
      const todos = readTodos();
      return res.writeHead(200, {'Content-Type':'application/json'}).end(JSON.stringify(todos));
    }

    if (req.method === 'POST' && !id) {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', () => {
        const todos = readTodos();
        const newTodo = { id: Date.now().toString(), title: JSON.parse(body).title, completed: false };
        todos.push(newTodo);
        writeTodos(todos);
        res.writeHead(201, {'Content-Type':'application/json'}).end(JSON.stringify(newTodo));
      });
      return;
    }

    if (id) {
      const todos = readTodos();
      const idx = todos.findIndex(t => t.id === id);
      if (idx === -1) return res.writeHead(404).end('Not found');

      if (req.method === 'PUT') {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
          const { completed, title } = JSON.parse(body);
          todos[idx] = { ...todos[idx], completed: completed ?? todos[idx].completed, title: title ?? todos[idx].title };
          writeTodos(todos);
          res.writeHead(200, {'Content-Type':'application/json'}).end(JSON.stringify(todos[idx]));
        });
        return;
      }

      if (req.method === 'DELETE') {
        todos.splice(idx, 1);
        writeTodos(todos);
        return res.writeHead(204).end();
      }
    }
  }
  
  // If none match:
  res.writeHead(404, {'Content-Type':'application/json'}).end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
