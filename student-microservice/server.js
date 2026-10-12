
const express = require("express");

const app = express();
app.use(express.json());

let students = [
    { id: 1, name: "Sai", branch: "CSE", marks: 85 },
    { id: 2, name: "Ravi", branch: "ECE", marks: 90 }
];

app.get("/", (req, res) => {
    res.send("Student Microservice is running");
});

app.get("/students", (req, res) => {
    res.json(students);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
});

app.post("/students", (req, res) => {
    const { name, branch, marks } = req.body;

    if (typeof name !== "string" || !name.trim() ||
        typeof branch !== "string" || !branch.trim() ||
        typeof marks !== "number" || !Number.isFinite(marks) ||
        marks < 0 || marks > 100) {
        return res.status(400).json({
            message: "Provide name, branch and marks (0-100)"
        });
    }

    const id = students.length
        ? Math.max(...students.map(s => s.id)) + 1
        : 1;

    const student = { id, name: name.trim(), branch: branch.trim(), marks };
    students.push(student);

    res.status(201).json(student);
});

app.put("/students/:id", (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, branch, marks } = req.body;

    if (typeof name !== "string" || !name.trim() ||
        typeof branch !== "string" || !branch.trim() ||
        typeof marks !== "number" || !Number.isFinite(marks) ||
        marks < 0 || marks > 100) {
        return res.status(400).json({
            message: "Provide name, branch and marks (0-100)"
        });
    }

    student.name = name.trim();
    student.branch = branch.trim();
    student.marks = marks;

    res.json(student);
});

app.delete("/students/:id", (req, res) => {
    const index = students.findIndex(s => s.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deleted = students.splice(index, 1);
    res.json({ message: "Student deleted", student: deleted[0] });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
