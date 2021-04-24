const util = require("util");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

const readFileAsync = util.promisify(fs.readFile);

async function customReadFile() {
    const data = await readFileAsync(path.join(__dirname, "db.json"), "utf8");
    console.log(data);
    return JSON.parse(data);
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/npcs", async (req, res) => {
    const jsonData = await customReadFile();
    console.log(jsonData);
    res.json(jsonData);
});

app.get("/api/npcs/:name", async (req, res) => {
    console.log(req.params.name);
    const fileData = await customReadFile();

    fileData.forEach(item => {
        if (item["animalName"].toLowerCase() === req.params.name.trim()) {
            res.json(item);
        }
    });

    const chosenName = fileData.filter(item => item["animalName"].toLowerCase() === req.params.name.trim())[0];
    if (chosenName) {
        res.json(chosenName);
    }
    else {
        res.json({"message" : "NO ANIMALS with that name"});
    }
});

app.post("/api/addNpc", (req, res) => {
    console.log(req.body);
    console.log("THIS IS RUNNING");
    fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
        const jsonData = JSON.parse(data) || [];
        console.log(jsonData);
        console.log(req.body);
        jsonData.push(req.body);

        fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(jsonData), (err) => {
            if (err) console.log(err);
            res.sendStatus(200);
        });
    });
});

app.listen(PORT, () => {
    console.log("App listening on Port " + PORT);
})