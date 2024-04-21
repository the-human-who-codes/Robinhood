const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let applicants = [
    { id: '1', name: 'John Doe', status: 'pending' },
    { id: '2', name: 'Jane Smith', status: 'pending' },
    { id: '3', name: 'Alice Johnson', status: 'pending' }
];

app.get('/api/applicants/:id', (req, res) => {
    const { id } = req.params;
    const applicant = applicants.find(applicant => applicant.id === id);
    if (!applicant) {
        return res.status(404).json({ error: 'Applicant not found' });
    }
    res.json(applicant);
});

app.put('/api/applicants/approve/:id', (req, res) => {
    const { id } = req.params;
    const applicant = applicants.find(applicant => applicant.id === id);
    if (!applicant) {
        return res.status(404).json({ error: 'Applicant not found' });
    }
    applicant.status = 'approved';
    res.json({ message: 'Applicant approved successfully', applicant });
});

app.put('/api/applicants/reject/:id', (req, res) => {
    const { id } = req.params;
    const applicant = applicants.find(applicant => applicant.id === id);
    if (!applicant) {
        return res.status(404).json({ error: 'Applicant not found' });
    }
    applicant.status = 'rejected';
    res.json({ message: 'Applicant rejected successfully', applicant });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
