const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.post('/bursary-advertisements', (req, res) => {
    const newAdvertisement = req.body;
    bursaryAdvertisements.push(newAdvertisement);
    res.status(201).json(newAdvertisement);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
