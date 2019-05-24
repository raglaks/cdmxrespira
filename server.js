const express = require('express');
const Twit = require('twit');
const port = process.env.PORT || 4000;
const axios = require('axios');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config({path: '/Users/raglaks/Desktop/PROJECTS/mexres/.env'});

const stations = ['Nezahualcóyotl', 'UAM Iztapalapa', 'Acolman', 'Villa de las Flores', 'Cuautitlán', 'San Agustín', 'FES Acatlán', 'Gustavo A. Madero', 'Merced', 'UAM Xochimilco', 'Tlahuac', 'Milpa Alta', 'Ajusco', 'Centro de Ciencias de la Atmosfera', 'Benito Juárez', 'Pedregal', 'Miguel Hidalgo', 'Santa FE', 'Investigaciones Nucleares'];

let count = 0;

const app = express();

const T = new Twit({

	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,

});

function goodAir(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Buena 💚💚💚\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);

}

function modAir(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Moderada 🚧🚧🚧\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);
    
}

function sensAir(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Dañina a la salud de los grupos sensibles 💊💊💊\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);
    
}

function harmAir(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Dañina a la salud 😟😟😟\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);
    
}

function vHarmAir(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Muy dañina a la salud 😷😷😷\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`;
    
    tweet(string);
    
}

function risky(aqi, name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nÍndice de la Calidad del Aire: ${aqi}\nCalidad del aire: Peligrosa 🚨🚨🚨\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);
    
}

function apiErr(name, url) {

    let string = `${name} | ${moment().format('DD-MM-YYYY, hh:mm:ss')}\nERROR DE API, CHEQUE EL RESULTADO EN EL LINK ABAJO 🔽🔽🔽\n#CDMXrespira\nhttps://aqicn.org/city/${url}/es/`; 

    tweet(string);

}

function tweet(string) {

    console.log(string);

    T.post('statuses/update', { status: string }, function(err, data, response) {

        if (err) {

            console.log(err);

        } else {

            console.log('Success: ' + data.text);
            
        }

    });

}

app.get('/ping', (req, res) => {

    return res.send('pong');

});

function getAQI(station) {

    return axios.get(`https://api.waqi.info/search/?`, {

        params: {
            token: process.env.token,
            keyword: station
        }

    }).then(data => {

        let resArr = data.data.data;

        resArr.map((el,key)=>{

            if (el.station.url.includes("mexico/mexico/")) {

                if (el.station.name.includes("San Agunstín") === false) {

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

                    } else {

                        apiErr(el.station.name, el.station.url)

                    }

                }
    
            } 

        });
 
    }).catch((err) => {

        console.log(err);

    }); 
}

app.listen(port, () => {

    console.log(`app is listening on ${port}`);

    setInterval(()=>{

        getAQI(stations[count]);

        count++;

        console.log(count);

        if (count === 19) {

            count = 0;

        }

    }, 360000);

});


