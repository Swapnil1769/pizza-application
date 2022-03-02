const User= require('../../models/user')
const bcrypt=require('bcrypt');
function authController(){
    return{
        login(req,res){
            res.render('auth/login');
        },
        resgister(req,res){
            res.render('auth/register');
        },
        async postRegister(req,res){
            const {name,email,password}=req.body
            //Validate request
            if(!name || !email || !password){
                req.flash('error','All fields are required');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }
//check if email already exists
            User.exists({email:email},(err,result)=>{
                if(result){
                req.flash('error','Email already exists');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
                }
            });

            //Hash Password
            const hashedPassword=await bcrypt.hash(password,10);


            //create a user
            const user=new User({
                name:name,
                email:email,
                password:hashedPassword
            });

            user.save().then((user)=>{
                //Login 
                res.redirect('/');
            }).catch(err =>{
                req.flash('error','Something went wrong');
                
                return res.redirect('/register');
            })
            console.log(req.body);
           // const {name,email,password}=req.body;

        }
    }
}
module.exports=authController;