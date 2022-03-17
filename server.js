require('dotenv').config()
const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const PORT = process.env.PORT || 3300;
const session=require('express-session');
const flash=require('express-flash');
//Data base connection
const mongoose=require('mongoose');
//const url='mongodb://localhost/pizza';
//const MongoDbStore=require('connect-mongo')(session);
const MongoDbStore=require('connect-mongo');
const passport=require('passport');
const { nextTick } = require('process');
const Emitter=require('events');

mongoose.connect(process.env.MONGO_CONNECTION_URL);
const connection=mongoose.connection;
connection.on('error',console.error.bind(console,"Error connecting to MongoDb"));

connection.once('open',function(){
    console.log("Connected to the database");
});

//passport config



//session store

/*let mongoStore=new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'
})*/
//event emitter

const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter);




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

const passportInit=require('./app/config/passport');
/*app.use(passport.initialize());
app.use(passport.session());*/

passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//database connection

app.use(express.urlencoded({extended:false}));
app.use(express.json());
//gloabal middleware
app.use((req,res,next)=>{
  res.locals.session=req.session;
  res.locals.user=req.user;
  next();
})
//Assets
app.use(express.static('public'));


//set template engine

app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web.js')(app);
app.use((req,res)=>{
  res.status(404).render('errors/404');
})





const server=app.listen(PORT,function(){
    console.log(`Listening on port ${PORT}`);
})

//Socket
const io=require('socket.io')(server)

io.on('connection',(socket)=>{
    //join 
    console.log(socket.id);
    socket.on('join',(orderId)=>{
        console.log(orderId);
      socket.join(orderId);
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data);
})