const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/events', async (req, res) => {
    const { month, day } = req.body;

    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
        const events = response.data.events;
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
