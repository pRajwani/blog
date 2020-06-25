const express = require('express');
const multer = require('multer');
var authenticate = require('../authenticate');
var cors = require('./cors');

const storage =multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
var imageFileFilter= (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('YOu can upload only image files'),false);
    }
    else
        cb(null,true);
}
const upload = multer({storage: storage,fileFilter:imageFileFilter})

var uploadRouter = express.Router()
uploadRouter.route('/')
.options(cors.corsOption,(req,res)=>{res.sendStatus(200)})
.post(cors.corsOption,authenticate.verifyUser,upload.single('imageFile'),
(req,res,next)=>{
                res.stausCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(req.file);
})
module.exports  = uploadRouter;