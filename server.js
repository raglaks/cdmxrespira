const express = require('express');
const Twit = require('twit');
const port = process.env.PORT || 4000;
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({path: '/Users/raglaks/Desktop/PROJECTS/mexres/.env'});

const stations = ['Acolman', 'Nezahualcóyotl', 'Villa de las Flores', 'Cuautitlán', 'San Agustín', 'FES Acatlán', 'Gustavo A. Madero', 'Merced', 'Iztacalco', 'UAM Xochimilco', 'Tlahuac', 'Milpa Alta', 'Ajusco', 'Ajusco Medio', 'Centro de Ciencias de la Atmosfera', 'Benito Juárez', 'Pedregal', 'Miguel Hidalgo', 'Santa FE', 'Investigaciones Nucleares'];

let count = 0;

const app = express();

const T = new Twit({

	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,

});

function goodAir(aqi, name, url) {

    let string = `${name}\n💚💚💚 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Buena\n#CDMXrespira\nhttps://aqicn.org/city/${url}`; 

    tweet(string);

}

function modAir(aqi, name, url) {

    let string = `${name}\n🚧🚧🚧 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Moderada\n#CDMXrespira\nhttps://aqicn.org/city/${url}`; 

    tweet(string);
    
}

function sensAir(aqi, name, url) {

    let string = `${name}\n💊💊💊 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Dañina a la salud de los grupos sensibles\n#CDMXrespira\nhttps://aqicn.org/city/${url}`; 

    tweet(string);
    
}

function harmAir(aqi, name, url) {

    let string = `${name}\n😟😟😟 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Dañina a la salud\n#CDMXrespira\nhttps://aqicn.org/city/${url}`; 

    tweet(string);
    
}

function vHarmAir(aqi, name, url) {

    let string = `${name}\n😷😷😷 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Muy dañina a la salud\n#CDMXrespira\nhttps://aqicn.org/city/${url}`;
    
    tweet(string);
    
}

function risky(aqi, name, url) {

    let string = `${name}\n🚨🚨🚨 Índice de la Calidad de Aire: ${aqi}\nCalidad del aire: Peligrosa\n#CDMXrespira\nhttps://aqicn.org/city/${url}`; 

    tweet(string);
    
}

function tweet(string) {

    console.log(string);

    T.post('statuses/update', { status: string }, function(err, data, response) {

        console.log("chirp");

    });

}

app.get('/ping', (req, res) => {

    return res.send('pong');

});

app.get('/tweet', (req, res) => {

    setInterval(()=>{

        getAQI(stations[count]);

        count++;

        if (count === 20) {

            count = 0;

        }

    }, 10000);


});


function getAQI(station) {

    return axios.get(`https://api.waqi.info/search/?`, {

        params: {
            token: process.env.token,
            keyword: station
        }

    }).then(data => {

        let resArr = data.data.data;

        resArr.map(el=>{

            if (el.station.url.includes("mexico/mexico/")) {

                let aqiVal = parseInt(el.aqi);

                if (aqiVal <= 50) {

                    goodAir(aqiVal, el.station.name, el.station.url);

                } else if (aqiVal <= 100) {

                    modAir(aqiVal, el.station.name, el.station.url);

                } else if (aqiVal <= 150) {

                    sensAir(aqiVal, el.station.name, el.station.url);

                } else if (aqiVal <= 200) {

                    harmAir(aqiVal, el.station.name, el.station.url);

                } else if (aqiVal <= 300) {

                    vHarmAir(aqiVal, el.station.name, el.station.url);

                } else if (aqiVal > 300) {

                    risky(aqiVal, el.station.name, el.station.url);

                } 
    
            } 

        });
 
    }).catch((err) => {

        console.log(err);

    }); 
}

app.listen(port, () => console.log(`app is listening on ${port}`));