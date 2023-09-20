require("dotenv").config();
const express = require("express")
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')

const corsOptions = {
        origin: '*',
        credentials: true,
};

app.use(cors(corsOptions));

app.use('/static/uploads', express.static('uploads'))
app.use('/static/images', express.static('images'))
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// router 
app.use('/', require('./routes'))

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Listening on port 3001'));
