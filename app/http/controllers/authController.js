function authController(){
    return{
        login(req,res){
            res.render('auth/login');
        },
        resgister(req,res){
            res.render('auth/register');
        }
    }
}
module.exports=authController;