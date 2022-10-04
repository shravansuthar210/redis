const express = require("express");
const redis = require("redis");
const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

(async () => {
  await client.connect();
})();

const axios = require("axios");
const USERS_API = "https://jsonplaceholder.typicode.com/users/";

const app = express();
const port = 6000;

app.get("/users", async (req, res) => {
  try {
    const date = new Date();
    const response = await axios.get(`${USERS_API}`);
    const users = await response.data;
    await client.set("user", JSON.stringify(users));
    console.log("Users retrieved from the API");
    const newdate = new Date();
    console.log("28",newdate-date);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.get("/users-cache", async (req, res) => {
  try {
    const date = new Date();
    const users = await client.get("user");
    console.log("Users retrieved from the API");
    const newdate = new Date();
    console.log("40",newdate-date);
    res.status(200).json({ data: JSON.parse(users) });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`server are running on ${port}`);
});
