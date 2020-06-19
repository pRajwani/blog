var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongoose');
var authenticate = require('../authenticate');
var passport = require('passport');
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
router.route('/register')
.get((req,res)=>{
  res.render('register')
})
.post((req,res,next)=>{
  User.register(new User({username:req.body.username,name:req.body.name}),req.body.password)
  .then((user)=>{
    console.log('user created', user);
    res.statusCode=200;
    res.setHeader('Content-type','application/json')
    res.render('login')

    passport.authenticate('local')(req,res,()=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({success:true,status:'Registeration Successfull'})
    });
  },(err)=>next(err))
  .catch((err)=>next(err))
})
router.post('/login',(req,res,next)=>{
  passport.authenticate('local', (err,user,info)=>{
    if(err)
    return next(err);

    if(!user){
      res.statusCode=401;
      res.setHeader('Content-Type','application/json');
      res.json({success:false,status:'Login Unsuccessfull',err:'Could not log-in'});

    }
    req.logIn(user, (err)=>{
      if(err){
        res.statusCode=401;
        res.setHeader('Content-Type','application/json');
        res.json({success: false, status: 'Login Unsuccessful!',err: 'Could not log in user'});
      }

    var token = authenticate.getToken({_id:req.user._id});
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json({success:true,status:"Logged in",token:token});
  })
})(req,res,next)
})

module.exports = router;
