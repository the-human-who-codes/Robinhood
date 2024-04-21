const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCdFoWKRZQuKnjv20ry0tfdF-N70Pe5JiQ",
    authDomain: "letsgo-946e6.firebaseapp.com",
    databaseURL: "https://letsgo-946e6-default-rtdb.firebaseio.com",
    projectId: "letsgo-946e6",
    storageBucket: "letsgo-946e6.appspot.com",
    messagingSenderId: "41559700737",
    appId: "1:41559700737:web:ea3c57df878a3826281700",
    measurementId: "G-6W1NY2T4DW"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const fundingOpportunitiesRef = db.ref('funding-opportunities');

// POST: Create a new funding opportunity
app.post('/api/funding-opportunities', (req, res) => {
    const { title, description, deadline, motivation } = req.body;

    if (!title || !description || !deadline || !motivation) {
        return res.status(400).json({ error: 'Title, description, deadline, and motivation are required' });
    }

    const newFundingOpportunity = {
        title,
        description,
        deadline,
        motivation,
    };

    fundingOpportunitiesRef.push(newFundingOpportunity, (error) => {
        if (error) {
            return res.status(500).json({ error: 'Error creating funding opportunity' });
        } else {
            return res.status(201).json(newFundingOpportunity);
        }
    });
});

// GET: Get all funding opportunities
app.get('/api/funding-opportunities', (req, res) => {
    fundingOpportunitiesRef.once('value', (snapshot) => {
        const fundingOpportunities = snapshot.val();
        return res.json(fundingOpportunities);
    }, (error) => {
        return res.status(500).json({ error: 'Error fetching funding opportunities' });
    });
});

// GET, PUT, DELETE: Individual funding opportunity
app.route('/api/funding-opportunities/:id')
    .get((req, res) => {
        const { id } = req.params;
        fundingOpportunitiesRef.child(id).once('value', (snapshot) => {
            const fundingOpportunity = snapshot.val();
            if (!fundingOpportunity) {
                return res.status(404).json({ error: 'Funding opportunity not found' });
            }
            return res.json(fundingOpportunity);
        }, (error) => {
            return res.status(500).json({ error: 'Error fetching funding opportunity' });
        });
    })
    .put((req, res) => {
        const { id } = req.params;
        const { title, description, deadline, motivation } = req.body;

        fundingOpportunitiesRef.child(id).update({ title, description, deadline, motivation }, (error) => {
            if (error) {
                return res.status(500).json({ error: 'Error updating funding opportunity' });
            } else {
                return res.json({ message: 'Funding opportunity updated successfully' });
            }
        });
    })
    .delete((req, res) => {
        const { id } = req.params;
        fundingOpportunitiesRef.child(id).remove((error) => {
            if (error) {
                return res.status(500).json({ error: 'Error deleting funding opportunity' });
            } else {
                return res.sendStatus(204);
            }
        });
    });

