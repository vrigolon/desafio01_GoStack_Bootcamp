const express = require('express');

const server = express();

server.use(express.json())

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Vitor", "email": "blablabla@email.com" }

const projects = []

var requestCounter = 0

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(element => element.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exist' });
  }

  return next();
}

function requestsLog(req, res, next) {
  requestCounter++;
  console.log(`requisiçoes ${requestCounter}`);
  return next();
}
server.use(requestsLog);


server.get('/projects', (req, res) => {
  return res.json(projects);
});


server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => element.id == id);

  project.title = title;
  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(element => element.id == id);

  projects.splice(projectIndex, 1);
  return res.send();
});



server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(element => element.id == id);
  project.tasks.push(title);
  return res.json(project);
});


server.listen(3000);