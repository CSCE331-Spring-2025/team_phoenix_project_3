import express from 'express';

const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY; // Store your API key in .env

router.get('/current', async (req, res) => {
    const { city = 'Galveston' } = req.query; // Default city if none is provided
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`; // raaaaaaa freedom units

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;