const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "auth_db_demo",
});

const SK = "secretKey";

router.get("/from_db", (req, res) => {
  connection.connect();

  connection.query("select * from users", function (err, rows, fields) {
    if (err) throw err;

    res.send(rows);
  });
  connection.end();
});

const users = [
  { id: 1, email: "aaa@aaa.com", password: "1234" },
  { id: 2, email: "bbb@bbb.com", password: "1111" },
];

router.get("/products", (req, res) => {
  const list = [
    { id: 1, name: "Pizza", price: 7.55 },
    { id: 2, name: "Pasta", price: 8.99 },
  ];

  res.status(200).send(list);
});

router.get("/premium", verifyToken, (req, res) => {
  const list = [
    { id: 1, name: "Pizza primium", price: 107.55 },
    { id: 2, name: "Pasta primium", price: 108.99 },
  ];

  res.status(200).send(list);
});

router.get("/users", (req, res) => {
  res.send(users);
});

router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === +req.params.id);
  res.send(user);
});

router.post("/register", (req, res) => {
  let userData = req.body;

  const id =
    Math.max.apply(
      Math,
      users.map((u) => u.id)
    ) + 1;
  userData["id"] = id;
  users.push(userData);

  const payload = { subject: id };
  const token = jwt.sign(payload, SK);
  res.send({ token });
});

router.post("/login", (req, res) => {
  const userData = req.body;
  const user = users.find((u) => u.email === userData["email"]);

  if (!user) {
    res.status(401).send("Incorrect email");
  } else if (user.password !== userData["password"]) {
    res.status(401).send("Incorrect password");
  } else {
    const payload = { subject: user.id };
    const token = jwt.sign(payload, SK);
    res.status(200).send({ token });
  }
});

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }

  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJpYXQiOjE2MzE4ODk1Mjl9.SCLpr_KWqiLynBO6tF_bZ3E7MLRkkhQ9yjrTE5j0gY4"
  const token = req.headers.authorization.split(" ")[1];

  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }

  try {
    const check = jwt.verify(token, SK);

    if (!check) {
      return res.status(401).send("Unauthorized request");
    }

    next();
  } catch (err) {
    return res.status(418).send("Somethig wrong with token");
  }
}

module.exports = router;
