document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const studentForm = document.getElementById('studentForm');

    async function fetchStudents() {
        const response = await fetch('/api/students');
        const students = await response.json();
        studentList.innerHTML = students.map(student => 
            `<p>${student.name} - ${student.rollNumber} - ${student.grade} - ${student.address} 
            <button data-id="${student._id}" class="delete-btn">Delete</button></p>`
        ).join('');

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                await fetch(`/api/students/${id}`, { method: 'DELETE' });
                fetchStudents();
            });
        });
    }

    fetchStudents();

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const rollNumber = document.getElementById('rollNumber').value;
        const grade = document.getElementById('grade').value;
        const address = document.getElementById('address').value;

        try {
            console.log("Sending request to add student...");
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, rollNumber, grade, address })
            });

            if (response.ok) {
                console.log("Student added successfully!");
                fetchStudents();
                studentForm.reset();
            } else {
                console.error("Failed to add student");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
