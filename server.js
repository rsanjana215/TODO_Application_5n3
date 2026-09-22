// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory "database" (Resets whenever the server restarts)
const registrations = [];

// Route: Handle Event Registration Form Submission
app.post('/api/register', (req, res) => {
    const { eventId, attendeeName, attendeeEmail } = req.body;

    // Validation
    if (!eventId || !attendeeName || !attendeeEmail) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create a new registration object with a fake unique ID and timestamp
    const newRegistration = {
        id: Math.random().toString(36).substr(2, 9),
        eventId,
        attendeeName,
        attendeeEmail,
        registeredAt: new Date()
    };

    // Save to our in-memory array
    registrations.push(newRegistration);

    console.log('Current Registrations:', registrations); // View data in your terminal

    return res.status(201).json({
        success: true,
        message: 'Successfully registered for the event!',
        data: newRegistration
    });
});

// Route: Optional helper to view all registrations via browser or Postman
app.get('/api/registrations', (req, res) => {
    res.json(registrations);
});

// Start Service
app.listen(PORT, () => {
    console.log(`🚀 Registration Microservice (In-Memory) running on port ${PORT}`);
});