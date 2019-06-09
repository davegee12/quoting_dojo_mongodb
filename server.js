var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting');

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3},
    quote: {type: String, required: true, maxlength: 50, minlength: 10}
}, {timestamps: true});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function(req, res){
    res.render('index');
});

app.post('/form', function(req, res){
    console.log("POST DATA", req.body);
    var newQuote = new Quote();
    newQuote.name = req.body.name;
    newQuote.quote = req.body.quote;
    newQuote.save(function(err){
        if(err) {
            console.log("something went wrong");
        }
        else {
            console.log("successfully added quote!");
            res.redirect('/quotes');
        }
    })
});

app.get('/quotes', function(req, res){
    Quote.find({}, function(err, quotes){
        console.log(quotes);
        res.render('show', {all_quotes: quotes});
    })
});

app.listen(8000, function () {
    console.log("listening on port 8000");
});