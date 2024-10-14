const express = require('express');
const axios = require('axios');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use((req, res, next) => {
    const ip = req.ip;
    console.log(`Visitor IP: ${ip}`);
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/download', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const apiUrl = `https://ccprojectsjonellapis-production.up.railway.app/api/tikdl?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.url && response.data.url.data) {
            const videoData = response.data.url.data;

            res.json({
                author: videoData.author.nickname,
                video_url: videoData.video,
                title: videoData.title,
                view_count: videoData.view,
                download_count: videoData.download,
                duration: videoData.duration
            });
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching video' });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
