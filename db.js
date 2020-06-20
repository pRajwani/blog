const mongoose = require('mongoose');
const uri = "mongodb+srv://Veteran:veteran123@vet-mox41.mongodb.net/blog-web?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => { if(err) console.log(err) })
.catch((err)=> console.log(err))
.then(()=>{
    console.log("Connected to Database");
}, (err) => console.log(err))
.catch((err) => console.log(err));