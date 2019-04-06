const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header ('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://iempadmin:iempadmin123@ds123259.mlab.com:23259/ie-marketpop', { useNewUrlParser: true }, () => {
    console.log('Database is connected');
});
mongoose.set('userCreateIndex', true);
mongoose.Promise = global.Promise;

const Estoque = require('./estoque');

app.get('/', async (req, res) => {
    try {
        var estoques = await Estoque.find();
        res.send(estoques);
    } catch (err) {
        res.status(400).send(err);
    };
});

app.post('/export', async (req, res) => {
    const {keyword} = req.body;

    try {
        if(await Estoque.findOne({keyword}))
            return res.status(400).send("keyword already exists");

        const estoque = await Estoque.create(req.body);
        return res.send({estoque});
    } catch (err) {
        return res.status(400).send(err);
    };
});

app.get('/import/:keyword', async (req, res) => {
    try {
        const estoque = await Estoque.findOne({keyword: req.params.keyword});
        if(estoque != null)
            return res.send(estoque);
        else
            return res.status(400).send("keyword doesn't exist");
    } catch (err) {
        return res.status(400).send(err);
    };
});

app.listen(process.env.PORT || 7000, () => {
    console.log("Listening");
})