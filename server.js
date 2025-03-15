const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/studentDatab', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  grade: String,
  address: String,
});

const Student = mongoose.model('Student', studentSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/students', async (req, res) => {
    console.log("Post request received");
    console.log(req.body); // Log the request body

  const student = new Student({
    name: req.body.name,
    rollNumber: req.body.rollNumber,
    grade: req.body.grade,
    address: req.body.address,
  });

  try {
    console.log("Attempting to save student");
    const newStudent = await student.save();
    console.log("Student saved successfully:", newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error saving student:", err);
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
