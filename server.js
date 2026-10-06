const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Serve index.html
app.use(express.static(__dirname));

// Persistent data location
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "registrations.json");

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

// Read registrations
function getRegistrations() {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// Save registrations
function saveRegistrations(registrations) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(registrations, null, 2)
    );
}

// Register for an event
app.post("/api/register", (req, res) => {

    const { eventId, attendeeName, attendeeEmail } = req.body;

    if (!eventId || !attendeeName || !attendeeEmail) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const registrations = getRegistrations();

    const registration = {
        id: registrations.length + 1,
        eventId: eventId,
        attendeeName: attendeeName,
        attendeeEmail: attendeeEmail,
        registeredAt: new Date().toISOString()
    };

    registrations.push(registration);

    saveRegistrations(registrations);

    res.status(201).json({
        success: true,
        message: "Registration successful!",
        registration: registration
    });
});

// View all registrations
app.get("/api/registrations", (req, res) => {
    res.json(getRegistrations());
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
