const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3123;
const app = express();

app.use(bodyParser.json());

const api = require("./routes/api");
app.use("/api", api);

app.get("/", (req, res) => res.send("Hello from Express server"));

app.listen(PORT, () => console.log("Server is running on localhost:" + PORT));
