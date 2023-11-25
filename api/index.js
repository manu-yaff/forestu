import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import groupsController from './modules/groups/controllers/groups.controller.js';
import studentsController from './modules/students/students.controller.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', async (_, res) => {
  res.json({
    mensaje: 'hello world, forestu',
  });
});

app.get('/groups', groupsController.findAll);
app.get('/groups/:id/students', groupsController.findStudents);

app.get('/students/:id', studentsController.findOne);
app.get('/students/:id/periods', studentsController.findPeriods);
app.get('/students/:id/faults', studentsController.findFaults);
app.post('/students/:id/faults', studentsController.createFault);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
