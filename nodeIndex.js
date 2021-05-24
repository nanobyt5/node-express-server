const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: false }));

const fs = require('fs');
const { string, ValidationError } = require('joi');

let heroes;

fs.readFile('heroes.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    heroes = JSON.parse(data);
});

app.get('/api/heroes', (req, res) => {
    res.send(heroes);
});

app.get('/api/heroes/:name', (req, res) => {
    const hero = heroes.members.find(h => h.name === req.params.name);
    if (!hero) {
        res.status(404).send('The hero is not in database!');
        return;
    }
    console.log(`Hero ${hero.name} found!`);
    res.send(hero);
});

app.post('/api/heroes', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().positive().required(),
        secretIdentity: Joi.string().required(),
        powers: Joi.array().required()
    });
    const validateResult = schema.validate(req.body);
    console.log(validateResult.error);

    if (validateResult.error) {
        return res.status(400).json({
            message: validateResult.error.details[0].message
        })
    }

    const hero = {
        name: req.body.name,
        age: req.body.age,
        secretIdentity: req.body.secretIdentity,
        powers: req.body.powers
    };
    heroes.members.push(hero);

    fs.writeFile('heroes.json', JSON.stringify(heroes, null, 4), function (err) {
        if (err) throw err;
        console.log(`Added ${hero.name} to JSON file!`);
        res.send(JSON.stringify({ status: 'Great Success!' }));
    });
});

// PORT "set PORT=3001"
const port = process.env.PORT | 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
