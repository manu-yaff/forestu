import express from 'express';
import cors from 'cors';
import groupsService from './modules/groups/services/groups.service.js';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', async (_, res) => {
  res.json({
    mensaje: 'hello world, forestu',
  });
});

app.get('/groups', groupsService.find);
app.get('/groups/:id/students', groupsService.findStudents);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
