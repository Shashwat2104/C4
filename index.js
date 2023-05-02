const express = require("express");
const connection = require("./config/db");
const { userRouter } = require("./routes/user.route");
const cityRouter = require("./routes/city.route");
const redisClient = require("./helpers/redis");

const logger = require("./middlewares/logger");

require("dotenv").config()

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());


app.get("/", async (req, res) => {
  res.send(await redisClient.get("hello world"));
})

app.use("/API/users", userRouter)

app.use("/API/ip", cityRouter);


app.listen(PORT, async () => {
  try {
    await connection();
    console.log("connected to Server")
    logger.log("info", " Connected to DB")
  } catch (err) {
    console.log(err.message)
    logger.log("Connection failed")
  }
  console.log("server is running", PORT)
})


