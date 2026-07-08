const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const dataFile = path.resolve(__dirname, '../data/data.json');
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../client')));
app.use(bodyParser.json());

function readDataFile() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to read data file:', error);
    return { projects: [], tasks: [], timeEntries: [], settings: {} };
  }
}

function writeDataFile(data) {
  const safeTempFile = `${dataFile}.tmp`;
  fs.writeFileSync(safeTempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(safeTempFile, dataFile);
}

app.get('/data', (req, res) => {
  const data = readDataFile();
  res.json(data);
});

app.post('/data', (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).send('Invalid payload');
  }

  const data = {
    projects: Array.isArray(payload.projects) ? payload.projects : [],
    tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
    timeEntries: Array.isArray(payload.timeEntries) ? payload.timeEntries : [],
    settings: typeof payload.settings === 'object' && payload.settings !== null ? payload.settings : {}
  };

  try {
    writeDataFile(data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to write data:', error);
    res.status(500).send('Failed to save data');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
