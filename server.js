const express = require('express');
const Twit = require('twit');
const port = process.env.PORT || 8080;
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({path: '/Users/raglaks/Desktop/PROJECTS/mexres/.env'});

const stations = ['Nezahualcóyotl', 'Acolman', 'Villa de las Flores', 'Cuatitlán', 'San Agustín', 'FES Acatlán', 'Gustavo A. Madero', 'Merced', 'Iztacalco', 'UAM Xochimilco', 'Tlahuac', 'Milpa Alta', 'Ajusco', 'Ajusco Medio', 'Centro de Ciencias de la Atmosfera', 'Benito Juárez', 'Pedregal', 'Miguel Hidalgo', 'Santa FE', 'Investigaciones Nucleares'];


const app = express();

const T = new Twit({

	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,

});

app.get('/ping', (req, res) => {

    return res.send('pong');

});

app.get('/tweet', (req, res) => {

    getAQI(stations[18]);

});

function getAQI(station) {

    axios.get(`api.waqi.info/search/?token=${process.env.token}&keyword=${station}`), (data)=>{

        console.log(data);

    }

}

app.listen(port, () => console.log(`app is listening on ${port}`));