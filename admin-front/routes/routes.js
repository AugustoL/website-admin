
module.exports = function(logger,app,db){

    module.addRoutes = function(){

        app.get('/', module.index);
        app.get('/templates/:name',module.templates);
        app.get('/directives/:name',module.directives);

        app.get('/createPost', module.index);
        app.get('/editPost', module.index);
        app.get('/images', module.index);
  
    }

    module.index = function(req,res){
        res.render('index.html');
    };

    module.templates = function(req,res){
        res.render('templates/' + req.params.name);
    };

    module.directives = function(req,res){
        res.render('directives/' + req.params.name);
    };

    return module;

}