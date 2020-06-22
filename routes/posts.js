//node Modules
var cors = require('./cors')
var express = require('express');
var bodyParser = require('body-parser');

//file imports
var Posts = require('../model/posts');
var authenticate= require('../authenticate');

var router = express.Router();

router.use(bodyParser.json());

//routes for /post
router.route('/')
//To get all the posts
.options(cors.corsOption,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=> {
    Posts.find({})
    .then((posts)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(posts);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//To post a single Post
.post(cors.corsOption,authenticate.verifyUser, (req,res,next)=> {
    req.body.postAuthor=req.user._id;
    Posts.create(req.body)
    .then((post)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(post);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//PUT operation not supported on /post
.put((req,res,next)=> {
    res.statusCode = 403;
    res.end("PUT operation not supported on /post")
})
//To Delete all the Post
.delete(cors.corsOption,authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=> {
    Posts.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

//routes for /post/:postId
router.route('/:postId')
//To get a specific post using postId
.options(cors.corsOption,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .populate('postAuthor')
    .then((posts)=>{
        posts.View += 1;
        posts.save()
        .then((post)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post);
        },(err)=>next(err))
        .catch((err)=>next(err));
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//POST operation is not supported on /post/:postId
.post((req,res)=> {
    res.statusCode = 403;
    res.end('POST operation is not supported on /post/:postId')
})
//To Update a Post using postId
.put(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('postAuthor')
    .then((posts)=>{
        if(posts.postAuthor._id==req.user.id) {    
            Posts.findByIdAndUpdate(req.params.postId,{$set: req.body},{new:true})
            .then((post)=>{
                res.statusCode = 200;
                res.setHeader('content-type','application/json')
                res.json(post)
            },(err)=>next(err))
            .catch((err)=>next(err))
        }
        else{
            error = new Error('You are not authorized');
            error.status = 403;
            next(error)
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
//To Delete a Post using postId
.delete(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .then((posts)=>{
        if(posts.Author == req.user.id) {
            post.findByIdAndDelete(req.params.postId)
            .populate('comment.Author')
            .then((post)=>{
                res.statusCode = 200;
                res.setHeader('content-type','application/json');
                res.json(post);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})


//routes for /post/postId/comment
router.route('/:postId/comment')
//To get all the comments of a specific Post
.options(cors.corsOption,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .then((post)=> {
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(post.Comments);
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
//To post a comment on a post
.post(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .then((post)=> {
        req.body.commentAuthor = req.user.id;
        post.Comments.push(req.body);
        post.save()
        .then((post)=> {
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json(post.Comments);
        }, (err)=> next(err))
        .catch((err)=> next(err));
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
//PUT operation is not supported on /post/:postId/comment
.put(authenticate.verifyUser,(req,res,next)=> { 
    res.statusCode = 403;
    res.end('PUT operation is not supported on /post/:postId/comment')
})
//To delete all the comments in the post
.delete(cors.corsOption,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=> {
    Posts.findByIdAndDelete(req.params.postId)
    .then((post)=>{
        post.Coments.remove()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json(resp);
        }, (err)=> next(err))
        .catch((err)=> next(err));
    }, (err)=> next(err))
    .catch((err)=> next(err));
})

//routes for /post/:postId/comment/:commentId
router.route('/:postId/comment/:commentId')
//To get a specific comment in a post
.options(cors.corsOption,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .then((post)=>{
        if(post!==null&&post.Comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post.Comments.id(req.params.commentId))
        }
        else if(post==null){
            error = new Error('Post does not exist')
            res.status = 404
            next(error)
        }
        else{
            error = new Error('Comment does not exist')
            res.status = 404
            next(error)
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post((req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /post/:postId/comment/:commentId')
})
//To update a specific comment of a specific post
.put(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .then((post)=>{
        if(post.Comments.id(req.params.commentId).commentAuthor._id == req.user.id){
            if(req.body.Comment)
            post.Comments.id(req.params.commentId).Comment=req.body.Comment;
            post.save()
            .then((post)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','aplication/json');
                res.json(post.Comments.id(req.params.commentId));
            }, (err)=> next(err))
            .catch((err)=> next(err));
        }
        else{
            error = new Error('You are not authorized');
            error.status = 403;
            next(error)
        }
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
//To delete a specific comment in a specific post
.delete(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .then((posts)=>{
        if(posts != null && posts.Comments.id(req.params.commentId) !== null) {
            if(posts.Comments.id(req.params.commentId).commentAuthor._id == req.user.id) {
                posts.Comments.id(req.params.commentId).remove()
                posts.save()
                .then((resp)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(resp);
                }, (err)=> next(err))
                .catch((err)=> next(err));
            }
            else{
                error = new Error('You are not authorized');
                error.status = 403;
                next(error)
            }
        }
        else if(post==null){
            error = new Error('Post does not exist')
            res.status = 404
            next(error)
        }
        else{
            error = new Error('Comment does not exist')
            res.status = 404
            next(error)
        }
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
//Router for /post/:postId/like
router.route('/:postId/like')
//To get the likes count of a specific post
.options(cors.corsOption,(req,res)=>{
    res.sendStatus(200)
})
.get(cors.cors,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .then((post)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post.likes.length);
    },(err)=> next(err))
    .catch((err)=> next(err));
})
//To post a like on a specific post
.post(cors.corsOption,authenticate.verifyUser, (req,res,next)=> {
    Posts.findById(req.params.postId)
    .then((post)=> {
        if(post.likes.indexOf(req.user._id) == -1) {
            post.likes.push(req.user._id);
            post.save()
            .then((post)=> {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(post.likes);
            },(err)=> next(err))
            .catch((err)=> next(err));
        }
        else res.end('You\'ve already liked the post');
    },(err)=> next(err))
    .catch((err)=> next(err));
})
//To Delete like on a specific post
.delete(cors.corsOption,authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('likes.likeAuthor')
    .then((post)=> {
            if(post.likes.indexOf(req.user._id)>-1) {
                var i = post.likes.indexOf(req.user._id);
                post.likes.splice(i,1);
                post.save()
                .then((post)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(post.likes.length);
                },(err)=> next(err))
                .catch((err)=> next(err));
            }
            else res.end('You have not liked the post');
    },(err)=> next(err))
    .catch((err)=> next(err));
})

module.exports = router;