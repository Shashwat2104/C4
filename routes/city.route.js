
const {Router } = require("express");
const { authenticator } = require("../middlewares/auth");
const { getCityData, mostSearchedCity } = require("../controllers/city.controller");


const cityRouter = Router();


cityRouter.get("/:IP",authenticator,getCityData);

module.exports = cityRouter;

