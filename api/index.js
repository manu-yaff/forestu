import express from 'express';
import cors from 'cors';
import groupsController from './modules/groups/controllers/groups.controller.js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', async (_, res) => {
  res.json({
    mensaje: 'hello world, forestu',
  });
});

app.get('/groups', groupsController.findAll);
app.get('/groups/:id/students', groupsController.findStudents);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
