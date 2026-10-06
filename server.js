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

// Persistent data file
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "registrations.json");

// Create data directory and file if they don't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

// Read registrations from file
function getRegistrations() {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// Save registrations to file
function saveRegistrations(registrations) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(registrations, null, 2)
    );
}

// Register an event
app.post("/api/register", (req, res) => {
    const { event, name, email } = req.body;

    if (!event || !name || !email) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const registrations = getRegistrations();

    const registration = {
        id: registrations.length + 1,
        event,
        name,
        email,
        registeredAt: new Date().toISOString()
    };

    registrations.push(registration);
    saveRegistrations(registrations);

    res.status(201).json({
        message: "Registration successful",
        registration
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
});
