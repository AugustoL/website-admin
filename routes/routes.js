var async = require('async');
var multipart = require('connect-multiparty');

module.exports = function(logger,app,db){

    var module = {};
    var multipartMiddleware = multipart();

    module.addRoutes = function(){
        //Index, templates and directives
        app.get('/', module.index);
        app.get('/templates/:name',module.templates);
        app.get('/directives/:name',module.directives);

        app.get('/createPost', module.index);
        app.get('/editPost', module.index);
        app.get('/images', module.index);

        app.get('/getPosts', module.getPosts);
        app.get('/getPost', module.getPost);
        app.get('/getMonths', module.getMonths);
        app.get('/getCategories', module.getCategories);;
        app.get('/getImage', module.getImage);
        app.get('/getImages', module.getImages);

        app.post('/uploadImages', multipartMiddleware, module.uploadImages);
        app.post('/deleteImage', module.deleteImage);
        app.post('/changeNameImg', module.changeNameImg);
        app.post('/createPost', module.createPost);
        app.post('/editPost', module.editPost);
        app.post('/draftPost', module.draftPost);
        app.post('/publishPost', module.publishPost);
        app.post('/deletePost', module.deletePost);
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

    // Get months 
    // Values on query: {formDate,page}
    module.getMonths = function(req,res){
        var data = req.query;
        db.months.find().sort('-date').exec(function(err, months){
            res.json(months);
        });
    }

    // Get categories 
    // Values on query: {formDate,page}
    module.getCategories = function(req,res){
        var data = req.query;
        db.categories.find().sort('-quantity').exec(function(err, categories){
            res.json(categories);
        });
    }

    // Get posts 
    // Values on query: {formDate,page}
    module.getPosts = function(req,res){
        var data = req.query;
        logger.log('Find by:');
        logger.log(data.findBy);
        var toReturn = {};
        if (data.skip == -10){
            logger.log('lastpage')
            db.posts.count({}, function( err, count){
                var lastPage = Math.floor(count/10);
                logger.log(lastPage)
                db.posts.find(JSON.parse(data.findBy)).sort(data.sort).skip(lastPage*10).limit(10).exec(function(err, result){
                    if (result)
                        res.json({success : true, lastPage : lastPage, posts : result });
                    else
                        res.json({success : true, posts : [] });
                });
            });
        } else {
            db.posts.find(JSON.parse(data.findBy)).sort(data.sort).skip(data.skip).limit(10).exec(function(err, result){
                if (result)
                    res.json({success : true, posts : result });
                else
                    res.json({success : true, posts : [] });
            });
        }
    }

    // Get post by id
    // Values on query: {id}
    module.getPost = function(req,res){
        var data = req.query;
        logger.log('Getting post '+data.id);
        var toReturn = {};
        db.posts.findOne({'_id' : data.id}, {}, function (err, post) {
            if (post)
                res.json({success : true, post : post });
            else
                res.json({success : true, post : {} });
        });
    }

    // Get image by id
    // Values on query: {id}
    module.getImage = function(req,res){
        var data = req.query;
    }

    // Create post 
    // Values on query: {title}
    module.createPost = function(req,res){
        var data = req.query;
        logger.log('Creating post..');
        var newPost = new db.posts();
        newPost.create();
        newPost.edit(data.titleEs,data.titleEn,data.img,data.categories,data.bodyEs,data.bodyEn);
        newPost.save(function (err) {
            if(err) {
                res.json({success : false});
            } else {
                res.json({success : true, postID : newPost.id});
            }
        });
    }

    // Edit post 
    // Values on query: {title,image,text}
    module.editPost = function(req,res){
        var data = req.query;
        logger.log('Editing post '+data.id);
        if (data.categories.indexOf(',')>-1)
            data.categories = data.categories.split(',');
        else
           data.categories = [data.categories.toString()];
        async.waterfall([
            function(callback) {
                db.posts.findOne({'_id' : data.id}, {}, function (err, post) {
                    if (err)
                        callback(err);
                    else
                        callback(null, post);
                });
            },
            function(post,callback) {
                if (post){
                    post.edit(data.titleEs,data.titleEn,data.img,data.categories,data.bodyEs,data.bodyEn);
                    post.save(function (err) {
                        if(err)
                            callback(err);
                        else
                            callback(null);
                    });  
                } else {
                    callback('Couldnt find post');
                }
            }
        ], function (err, result) {
            if (err){
                logger.error(err);
                res.json({success : false, message: err});
            } else {
                res.json({success : true, message: 'Post edited'});
            }
        });
    }

    // Publish post 
    // Values on query: {title,image,text}
    module.publishPost = function(req,res){
        var data = req.query;
        logger.log('Publishing post '+data.id);
        async.waterfall([
            function(callback) {
                db.posts.findOne({'_id' : data.id}, {}, function (err, post) {
                    if (err)
                        callback(err);
                    else
                        callback(null, post);
                });
            },
            function(post,callback) {
                if (post){
                    post.draft = false;
                    post.date = new Date();
                    post.save(function (err) {
                        if(err)
                            callback(err);
                        else
                            callback(null, post);
                    });  
                } else {
                    callback('Couldnt find post');
                }
            },function(post, callback){
                db.months.findOne({'name' : post.date.getFullYear()+','+(parseInt(post.date.getMonth())+1)}, {}, function (err, month) {
                    if (month){
                        month.quantity ++;
                        month.save(function (err) {
                            if(err)
                                callback(err);
                            else
                                callback(null,post);
                        });
                    } else {
                        var newMonth = new db.months();
                        newMonth.name = post.date.getFullYear()+','+(post.date.getMonth()+1);
                        newMonth.date = new Date(post.date.getFullYear()+','+(post.date.getMonth()+1)+',1');
                        newMonth.quantity = 1;
                        newMonth.save(function (err) {
                            if(err)
                                callback(err);
                            else
                                callback(null,post);
                        });
                    }
                });
            },function(post, callback){
                if (post.categories.length > 0) {
                    post.categories.forEach( function(catInPost) {
                        db.categories.findOne({"nameEn" : catInPost }, {}, function (err, cat) {
                            if (err){
                                callback(err);
                            } else {        
                                cat.quantity ++;
                                cat.save(function (err) {
                                    if(err)
                                        callback(err);
                                    else
                                        callback(null);
                                });
                            }
                        });
                    });
                } else {
                    callback(null);
                }
            }
        ], function (err, result) {
            if (err){
                logger.error(err);
                res.json({success : false, message: err});
            } else {
                res.json({success : true, message: 'Post published'});
            }
        });
    }

    // Draft post 
    // Values on query: {title,image,text}
    module.draftPost = function(req,res){
        var data = req.query;
        logger.log('Moving to drafts post '+data.id);
        async.waterfall([
            function(callback) {
                db.posts.findOne({'_id' : data.id}, {}, function (err, post) {
                    if (err)
                        callback(err);
                    else
                        callback(null, post);
                });
            },
            function(post,callback) {
                if (post){
                    post.draft = true;
                    post.save(function (err) {
                        if(err)
                            callback(err);
                        else
                            callback(null,post);
                    });  
                } else {
                    callback('Couldnt find post');
                }
            },function(post, callback){
                db.months.findOne({'name' : post.date.getFullYear()+','+(parseInt(post.date.getMonth())+1)}, {}, function (err, month) {
                    if (month){
                        month.quantity --;
                        if (month.quantity == 0){
                            month.remove();
                            callback(null,post);
                        } else {
                            month.save(function (err) {
                                if(err)
                                    callback(err);
                                else
                                    callback(null,post);
                            });    
                        }
                    } else {
                        callback(null,post);
                    }
                });
            },function(post, callback){
                if (post.categories.length > 0) {
                    post.categories.forEach( function(catInPost) {
                        db.categories.findOne({"nameEn" : catInPost }, {}, function (err, cat) {
                            if (err){
                                callback(err);
                            } else {       
                                cat.quantity --;
                                cat.save(function (err) {
                                    if(err)
                                        callback(err);
                                    else
                                        callback(null);
                                }); 
                            }
                        });
                    });
                } else {
                    callback(null);
                }
            }
        ], function (err, result) {
            if (err){
                logger.error(err);
                res.json({success : false, message: err});
            } else {
                res.json({success : true, message: 'Post is draft now'});
            }
        });
    }

    // Delete post 
    // Values on query: {title,image,text}
    module.deletePost = function(req,res){
        var data = req.query;
        logger.log('Removing post '+data.id);
        async.waterfall([
            function(callback) {
                db.posts.findOne({'_id' : data.id}, {}, function (err, post) {
                    if (err)
                        callback(err);
                    else
                        callback(null, post);
                });
            },function(post, callback){
                db.months.findOne({'name' : post.date.getFullYear()+','+(parseInt(post.date.getMonth())+1)}, {}, function (err, month) {
                    if (month){
                        month.quantity --;
                        if (month.quantity == 0){
                            month.remove( function (err) {
                                if(err)
                                    callback(err);
                                else
                                    callback(null,post);
                            }); 
                        } else {
                            month.save(function (err) {
                                if(err)
                                    callback(err);
                                else
                                    callback(null,post);
                            });    
                        }
                    } else {
                        callback(null,post);
                    }
                });
            },function(post, callback){
                if (post.categories.length > 0) {
                    post.categories.forEach( function(catInPost) {
                        db.categories.findOne({"nameEn" : catInPost }, {}, function (err, cat) {
                            if (err){
                                callback(err);
                            } else {       
                                cat.quantity = cat.quantity - 1;
                                cat.save(function (err) {
                                    if(err)
                                        callback(err);
                                    else
                                        callback(null,post);
                                });      
                            }
                        });
                    });
                } else {
                    callback(null,post);
                }
            },function(post,callback) {
                post.remove(function (err) {
                    if(err)
                        callback(err);
                    else
                        callback(null);
                }); 
            }
        ], function (err, result) {
            if (err){
                logger.error(err);
                res.json({success : false, message: err});
            } else {
                res.json({success : true, message: 'Post removed'});
            }
        });
    }


    //Image requests
    module.uploadImages = function(req,res){
        var data = req.body;
        logger.log('Uploading '+data.images.length+ ' images..');
        async.forEachLimit(data.images, 1, function(image, callback) {
            if (image != 'none'){
                db.images.count({}, function( err, count){
                    if(err)
                        callback(err);
                    else {
                        var newImage = new db.images();
                        newImage.create('image'+count,image);
                        newImage.save(function (err) {
                            if(err)
                                callback(err);
                            else
                                callback(null);
                        });
                    }
                })
            } else {
                callback(null);
            }
        }, function(err) {
            if (err)
                res.json({success : false, message : err});
            res.json({success : true, message : 'Imgs uploaded'});
        });
        
    }

    module.deleteImage = function(req,res){
        var data = req.query;
        logger.log('Deleting image: '+data.name);
        db.images.findOne({name : data.name}, function (err, image) {
            if (err) 
                res.json({success : false, message :err});
            if (image){
                image.remove(function (err) {
                    if(err)
                        res.json({success : false, message :err});
                    else
                        res.json({success : true, message : 'Img removed'});
                }); 
            } else {
                res.json({success : false, message :'Image dont exist'});
            }
        });
    }

    module.changeNameImg = function(req,res){
        var data = req.query;
        logger.log(data);
        db.images.findOne({"_id" : data.id}, function (err, image) {
            if (err) 
                res.json({success : false, message :err});
            if (image){
                image.name = data.name;
                image.save(function (err) {
                    if(err)
                        res.json({success : false, message :err});
                    else
                        res.json({success : true, message : 'Img name changed'});
                }); 
            } else {
                res.json({success : false, message :'Image dont exist'});
            }
        });
    }

    module.getImage = function(req,res){
        var data = req.query;
        db.images.findOne({name : data.name}, function (err, image) {
            if (err)
                res.json({success : false, message :err});
            if (image){
                if (image.data.indexOf('data:image/jpeg;base64,') > -1) {
                    var img = new Buffer(image.data.replace('data:image/jpeg;base64,',''), 'base64');
                    res.writeHead(200, {
                      'Content-Type': 'image/jpeg',
                      'Content-Length': img.length
                    });
                    res.end(img);
                } else if (image.data.indexOf('data:image/png;base64,') > -1) {
                    var img = new Buffer(image.data.replace('data:image/png;base64,',''), 'base64');
                    res.writeHead(200, {
                      'Content-Type': 'image/png',
                      'Content-Length': img.length
                    });
                    res.end(img);
                }
            } else {
                res.json({success : false, message :'Image dont exist'});
            }
        });
    }

    module.getImages = function(req,res){
        db.images.find({}).select('name').exec(function(err, images){
            if(err)
                res.json({success : false, message : err});
            else
                res.json({success : true, images : images});
        });        
    }

    return module;

}