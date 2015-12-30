//Dependencies
var express = require('express');
var favicon = require('serve-favicon');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var async = require('async');
var basicAuth = require('basic-auth-connect');

//Configuration
var config = new require('./config')

//Get arguments
var args = process.argv.slice(2);

//Logger
var logger = new require('just-a-logger')(config.logLevel,__dirname+'/logs');

//Connect
mongoose.connect(config.dbURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Once connected do actions
db.once('open', function callback () {
    logger.important('Connected to DB: '+config.dbURI); 
});

//Launch express
var app = express();

//Config Express
app.set('port', (3010));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon(__dirname + '/public/img/handWhite.ico'));  
app.use(favicon(__dirname + '/public/img/handRed.ico')); 
app.use('/public',express.static('public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

for (var i in args) {
    if (args[i] == '-server'){
        app.use(basicAuth(config.httpUser, config.httpPassword));
    }
}

//Schemas
require('./schemas/posts')(db,logger);
require('./schemas/months')(db,logger);
require('./schemas/images')(db,logger);
require('./schemas/categories')(db,logger);

//Add routes
require('./routes/routes')(logger,app,db).addRoutes();

//Restart Categories
var categories = [
    { "en" : "Travel", "es" : "Viajes"},
    { "en" : "Music", "es" : "Musica"},
    { "en" : "Bitcoin", "es" : "Bitcoin"},
    { "en" : "Linux", "es" : "Linux"},
    { "en" : "Programing", "es" : "Programacion"},
    { "en" : "Other", "es" : "Otros"},
    { "en" : "Games", "es" : "Juegos"},
    { "en" : "Movies", "es" : "Peliculas"},
    { "en" : "Series", "es" : "Series"}
];

if (args.indexOf('-resetCat') > -1){
    db.categories.remove({}, function(err, result) {
        async.forEachLimit(categories, 1, function(cat, callback) {
            var newCat = new db.categories();
            db.posts.find({"categories" :{ "$in" : [cat.en] }}).exec(function(err, result){
                if (result){
                    newCat.create(cat.en,cat.es,result.length);
                    newCat.save(function(err){
                        callback(null)
                    });
                } else {
                    newCat.create(cat.en,cat.es,0);
                    newCat.save(function(err){
                        callback(null)
                    });
                }
            });
        }, function(err) {
            if (err) logger.error(err);
        });
    })
}

//Start the server
app.listen(app.get('port'), function() {
    logger.important('Admin for Augusto\'s website started at port '+app.get('port'));
})

