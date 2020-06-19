var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var post = require('../model/posts')
var ObjectId = require('mongodb').ObjectId;
var authenticate= require('../authenticate');

router.use(bodyParser.json())

router.route('/')
.get((req,res,next)=>{
    post.find({})
    .then((posts)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(posts)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    req.body.Author=req.user._id;
    post.create(req.body)
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    post.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
})

router.route('/:postId')
.get((req,res,next)=>{
    post.findById(req.params.postId)
    .populate('comment.Author')
    .then((posts)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(posts)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .populate('Author')
    .then((posts)=>{
        
        if(posts.Author._id==req.user.id){
            
    post.findByIdAndUpdate(req.params.postId,{$set: req.body},{new:true})
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post)
    },(err)=>next(err))
    .catch((err)=>next(err))
}
},(err)=>next(err))
.catch((err)=>next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .then((posts)=>{
        if(posts.Author=req.user.id)
    {
    post.findByIdAndDelete(req.params.postId)
    .populate('comment.Author')
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post)
    },(err)=>next(err))
    .catch((err)=>next(err))
}
    },(err)=>next(err))
    .catch((err)=>next(err))
})

router.route('/:postId/comment')
.get((req,res,next)=>{
    
    post.findById(req.params.postId)
    .populate('comment.Author')
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post.comment)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .then((post)=>{
        req.body.Author = req.user.id;
        post.comment.push(req.body);
        post.save()
        .then((post)=>{

            res.statusCode =200
            res.setHeader('content-type','application/json')
            res.json(post.comment)
        },(err)=>next(err))
        .catch((err)=>next(err))
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    
    post.findByIdAndUpdate(req.params.postId)
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    post.findByIdAndDelete(req.params.postId)
    .then((post)=>{
        res.statusCode =200
        res.setHeader('content-type','application/json')
        res.json(post)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
router.route('/:postId/comment/:commentId')
.get(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .populate(comment.Author)
    .then((post)=>{
        if(post!==null&&post.comments.id(req.params.commentId) != null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(post.comment.id(req.params.commentId))
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .populate('Author')
    .then((posts)=>{
        if(posts.comment.id(req.params.commentId).Author._id == req.user.id){
            if(req.body.Comment)
            posts.comment.id(req.params.commentId).Comment=req.body.Comment;
        posts.save()
        .then((post)=>{
            res.statusCode=200;
            res.setHeader('Content-Type','aplication/json');
            res.json(post.comment.id(req.params.commentId));
        },(err)=>next(err))
        .catch((err)=>next(err))

        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    post.findById(req.params.postId)
    .populate('Author')
    .then((posts)=>{
        if(posts!=null&&posts.comment.id(req.params.commentId)!==null){
            if(posts.comment.id(req.params.commentId).Author._id==req.user.id){
                posts.comment.id(req.params.commentId).remove()
                posts.save()
                .then((resp)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(resp);
                },(err)=>next(err))
                .catch((err)=>next(err))
            }
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})

module.exports = router