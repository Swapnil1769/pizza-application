/*function homeController(){
    return {
       /* index : function(){

        }0
        //same as
         index(){
             
         }
    }
}*/
const Menu=require('../../models/menu');
function homeController(){
    //factory functions
    return{
        async index(req,res){
           /* Menu.find().then(function(pizzas){
                console.log(pizzas);
                return res.render('home',{pizzas:pizzas});
            })*/
            //Using Asyc await
            //console.log(req);
            const pizzas=await Menu.find();
            //console.log(pizzas);
            return res.render('home',{pizzas:pizzas});

          
        }
    }
}

module.exports=homeController;