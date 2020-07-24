var cors= require('./cors')
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app=express()

var authenticate = require('../authenticate');
var User = require('../model/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
  .then((users)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
  },(err)=>next(err))
  .catch((err)=>next(err))
});

//routes for /users/register
router.route('/register')
.get((req,res)=>{
  res.render('register')
})
.post(cors.corsOption,(req,res,next)=>{
  User.register(new User({username:req.body.username,name:req.body.name}),req.body.password)
  .then((user)=>{
    passport.authenticate('local')(req,res,()=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true,status:'Registeration Successfull'})
    });
  },(err)=>next(err))
  .catch((err)=>next(err))
})


router
.options('/checkJWTtoken', cors.corsOption)
.get('/checkJWTtoken', cors.corsOption, (req, res, next) => {
  passport.authenticate("jwt", {session: false}, (err, user, info) => {
    if(err)
      return next(err);
    if(!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "JWT invalid!", err: info });
    }
    else {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "JWT valid!", user: usesr });
    }
  }) (req, res);
});

//router for /user/login
router.options('/login', cors.corsOption)
router.post('/login', cors.corsOption, (req,res,next)=> {
  passport.authenticate('local', (err,user,info)=> {
    if(err)
      return next(err);
    if(!user) {
      res.statusCode=401;
      res.setHeader('Content-Type','application/json');
      res.json({success:false, status:'Login Unsuccessfull', err: info});
      return;
    }
    req.logIn(user, (err)=> {
      if(err) {
        res.statusCode=401;
        res.setHeader('Content-Type','application/json');
        res.json({success:false, status:'Login Unsuccessful!-1', err: info });
        return;
      }
      var token = authenticate.getToken({_id:req.user._id});
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true, status:"Logged in", token:token});
      console.log(token);
    });
  }) (req,res,next);
});

module.exports = router;
