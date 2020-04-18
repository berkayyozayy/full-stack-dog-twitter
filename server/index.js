const express = require('express');
const cors = require('cors');
const db = require('monk')('localhost/havhavs');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');
const app =  express();


app.use(cors());

const havs = db.get('havs'); //collection of database
const filter = new Filter();

app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message : "Hellooo"
    });
});

app.get('/havs', (req, res) => {
    havs
    .find()
    .then(havs => {
        res.json(havs); 
    });
});


function ifValidHav(hav){
    return hav.name && hav.name.toString().trim() !== '' && hav.content && hav.content.toString().trim() !== '';
}
app.use(rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1 //limit each IP to 1 request
}));

app.post('/havs', (req, res) => {
    if (ifValidHav(req.body)) {
        //insert database
        const hav = {
            name : filter.clean(req.body.name.toString()),
            content : filter.clean(req.body.content.toString()),
            created : new Date()
        };
        havs
        .insert(hav)
        .then(createdHav => { 
            res.json(createdHav); //created hav back to the client
        });
        

    } else {
        res.status(422); // HTTP 422 is the unprocessable content.
        res.json({
            message : 'Name and Content are required!'
        });

    }
});

app.listen(5000, () => {

    console.log("Listening on http://localhost:5000");

});