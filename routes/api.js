const express = require("express");
const router = express.Router();

const list = [
  { id: 1, email: "aaa@aaa.com", password: "1234" },
  { id: 2, email: "bbb@bbb.com", password: "1111" },
];

router.get("/", (req, res) => {
  // console.log("Hello from API");
  res.send("Hello from API");
});

router.get("/:id", (req, res) => {
  const user = list.find((u) => u.id === +req.params.id);
  res.send(user);
});

module.exports = router;
