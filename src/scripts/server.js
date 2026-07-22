const express = require('express');
const path = require('path');
const signupRouter = require('../routes/signup'); 

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../../')));

app.use('/pages', express.static(path.join(__dirname, '../../pages')));

app.use(signupRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));