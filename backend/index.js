// 1) cd backend 2) npm init -y 3) npm i express
// add express
// get endpoint to be edited

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json()); // really important!!!

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`)); // add the path to index.html
});

app.use(
  "/public",
  express.static(path.join(`${__dirname}/../frontend/static`))
);

app.get("/api/users", (req, res) => {
  res.sendFile(path.join(`${__dirname}/data.json`));
});

app.post("/api/users", (req, res) => {
  console.log(req.body);

  fs.readFile(`${__dirname}/data.json`, (err, rawData) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    const currentData = JSON.parse(rawData);
    const newData = {
      id: currentData[currentData.length - 1].id + 1,
      ...req.body,
    };

    currentData.push(newData);

    fs.writeFile(
      `${__dirname}/data.json`,
      JSON.stringify(currentData, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Error writing file" });
        }
        res.json(`New data has been added with id ${newData.id}`);
      }
    );
  });
});

/* app.get("/script.js", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/static/script.js`)); // add the path to script.js
}); */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
