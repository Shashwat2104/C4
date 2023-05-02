
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../helpers/redis");



const signup = async (req, res) => {

    try {
        const { name, email, password, IP } = req.body;
        const isUserPresent = await user.findOne({ email });
        if (isUserPresent) return res.send("User already Present, login please");

        const hash = await bcrypt.hash(password, 6);

        const newUser = new user({ name, email, password: hash, IP });

        await newUser.save();

        res.send("Signup Successful")

    } catch (err) {

        res.send(err.message);
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isUserPresent = await user.findOne({ email });

        if (!isUserPresent) return res.send("user not Login, Register First");

        const isPasswordCorrect = await bcrypt.compare(password, isUserPresent.password);

        if (!isPasswordCorrect) return res.send("Invalid Credentials");

        const token = await jwt.sign({ userId: isUserPresent._id, IP: isUserPresent.IP }, process.env.JWT_SECRET, { expiresIn: "1hr" })

        res.send({ message: "Login Success", token });


    } catch (err) {
        res.send(err.message)
    }

}

const logout = async (req, res) => {

    try {

        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) return res.status(403);

        await redisClient.set(token, token);
        res.send("logout successful");


    } catch (err) {
        res.send(err.message)
    }
}

module.exports = { login, logout, signup }