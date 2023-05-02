
const redisClient = require("../helpers/redis");
const axios = require("axios");
const userCitiesList = require("../models/city.model");
const user = require("../models/user.model");
const API_KEY = process.env.OW_API_KEY;

const getCityData = async (req, res) => {

    try {

        const IP = req.params.IP || req.body.IP;

        const isCityInCache = await redisClient.get(`${IP}`);

        if (isCityInCache) return res.status(200).send({ data: isCityInCache });

        const response = await axios.get(`https://ipinfo.io/${IP}?token=${API_KEY}`)

        const weatherData = response.data;

        redisClient.set(IP, JSON.stringify(weatherData), { EX: 21600 });


        await userCitiesList.findOneAndUpdate({ userId: req.body.userId }, {
            userId: req.body.userId, $push: { previousSearches: IP }
        }, { new: true, upsert: true, setDefaultsOnInsert: true })

        return res.send({ data: weatherData });

    } catch (err) {
        return res.status(500).send(err.messsage);
    }
}




module.exports = { getCityData };



