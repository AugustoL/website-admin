//Dependencies
var express = require('express');
var favicon = require('serve-favicon');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');
var grunt = require('grunt');
var cors = require('cors');

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
process.env.appDomain == 'admin.augustolemble.com';

//Config Express
app.set('port', (3010));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon(__dirname + '/dist/img/handWhite.ico'));  
app.use(favicon(__dirname + '/dist/img/handRed.ico')); 
app.use('/dist', express.static(__dirname + '/dist'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(basicAuth(config.httpUser, config.httpPassword));


//Add routes
require('./routes/routes')(logger,app,db).addRoutes();

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

//Start the server
app.listen(app.get('port'), function() {
    logger.important('Admin for Augusto\'s website started at port '+app.get('port'));
});

if (args.indexOf('-dev') < 0){
    grunt.tasks(['clean']);
    grunt.tasks(['ngAnnotate']);
    grunt.tasks(['uglify']);
    grunt.tasks(['cssmin']);
    grunt.tasks(['watch:js','watch:css']);
} else {
    grunt.tasks(['clean']);
    grunt.tasks(['copy']);
    grunt.tasks(['chmod']);
    grunt.tasks(['watch:dev']);
}