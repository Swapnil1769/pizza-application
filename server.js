require('dotenv').config()
const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const session=require('express-session');
const flash=require('express-flash');
const mongoose=require('mongoose');
const url='mongodb://localhost/pizza';
//const MongoDbStore=require('connect-mongo')(session);
const MongoDbStore=require('connect-mongo');
const { nextTick } = require('process');

mongoose.connect(url);
const connection=mongoose.connection;
connection.on('error',console.error.bind(console,"Error connecting to MongoDb"));

connection.once('open',function(){
    console.log("Connected to the database");
});

//session store

/*let mongoStore=new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'
})*/

//session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24
    },
   
store: MongoDbStore.create({
     mongoUrl: 'mongodb://localhost/pizza' ,
     autoRemove:'disabled'
    })
}))

app.use(flash());

//database connection

app.use(express.urlencoded({extended:false}));
app.use(express.json());
//gloabal middleware
app.use((req,res,next)=>{
  res.locals.session=req.session;
  next();
})
//Assets
app.use(express.static('public'));


//set template engine

app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web.js')(app);





app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
})