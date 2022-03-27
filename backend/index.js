const path = require('path');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const methodOverride = require('method-override');
const port = 5000;
const app = express();
require('dotenv').config();

const router = require('./routers');
const db = require('./config/db');

// Conect to db
db.connect();

app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'uploads')));

// HTTP logger
app.use(morgan('combined'));

// Route
router(app);


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});