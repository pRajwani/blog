//node Modules
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
.get((req,res,next)=> {
    Posts.find({})
    .then((posts)=>{
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        res.json(posts);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//To post a single Post
.post(authenticate.verifyUser, (req,res,next)=> {
    req.body.postAuthor=req.user._id;
    console.log(req.body.postAuthor);
    console.log(req.body);
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=> {
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
.get((req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .populate('postAuthor')
    .then((posts)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(posts);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
//POST operation is not supported on /post/:postId
.post((req,res)=> {
    res.statusCode = 403;
    res.end('POST operation is not supported on /post/:postId')
})
//To Update a Post using postId
.put(authenticate.verifyUser,(req,res,next)=> {
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
    },(err)=>next(err))
    .catch((err)=>next(err))
})
//To Delete a Post using postId
.delete(authenticate.verifyUser,(req,res,next)=> {
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
.get((req,res,next)=> {
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
.post(authenticate.verifyUser,(req,res,next)=> {
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
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=> {
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
.get(authenticate.verifyUser,(req,res,next)=> {
    Posts.findById(req.params.postId)
    .populate('Comments.commentAuthor')
    .then((post)=>{
        if(post!==null&&post.Comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(post.Comments.id(req.params.commentId))
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post((req,res) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /post/:postId/comment/:commentId')
})
//To update a specific comment of a specific post
.put(authenticate.verifyUser,(req,res,next)=> {
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
    }, (err)=> next(err))
    .catch((err)=> next(err));
})
//To delete a specific comment in a specific post
.delete(authenticate.verifyUser,(req,res,next)=> {
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
        }
    }, (err)=> next(err))
    .catch((err)=> next(err));
})

module.exports = router;