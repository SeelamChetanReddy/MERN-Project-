import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", rollNumber: "", grade: "", address: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/students", formData);
      fetchStudents();
      setFormData({ name: "", rollNumber: "", grade: "", address: "" });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="container">
      <h1>Student Management</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} required />
        <input type="text" name="grade" placeholder="Grade" value={formData.grade} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <button type="submit">Add Student</button>
      </form>

      <div className="student-list">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <p><strong>{student.name}</strong> - {student.rollNumber} - {student.grade} - {student.address}</p>
            <button onClick={() => handleDelete(student._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
