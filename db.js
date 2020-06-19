const mongo = require('mongoose')
const url = 'mongodb://localhost:27017/blog-web'
const connect = mongo.connect(url)
connect.then((p)=>{
    console.log('connected')
},(err)=>next(err))