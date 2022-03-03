const LocalStrategy=require('passport-local').Strategy
const User= require('../models/user');
const bcrypt=require('bcrypt');
function init(passport){
   passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
      //Login
      //check if email exists
      const user=await User.findOne({email:email})
      if(!user){
          return done(null,false,{message:'No user with this email found'});
      }

      bcrypt.compare(password,user.password).then(match=>{
        if(match){
            return done(null,user,{message:'Logged In successfully'})
        }
        return done(null,false,{message:'Password is not matching'});
      }).catch(err=>{
          return done(null,false,{message:'Something went wrong'});
      })


   }));

   passport.serializeUser((user,done)=>{
       done(null,user._id);
   });

   passport.deserializeUser((id,done)=>{
       User.findById(id,function(err,user){
           done(err,user);
       })
//with the help of this we can do req.user
   })

   
}
module.exports=init;