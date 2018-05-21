const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRouter = require('./game');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use('/game', gameRouter);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
