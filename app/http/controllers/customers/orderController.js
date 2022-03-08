const Order=require('../../../models/order');
const moment=require('moment');
function orderController(){
    return {
        store(req,res){
            //validate  a request
          const {phone,address}=req.body;
          if(!phone || !address){
              req.flash('error','All fields are required');
              return res.redirect('/cart');

          }
          const order=new Order({
              customerId:req.user._id,
              items:req.session.cart.items,
              phone:phone,
              address:address
          })

          order.save().then(result =>{
              
               req.flash('success','Order placed successfully');
               delete req.session.cart
               return res.redirect('/customer/orders');
          }).catch(err =>{
              console.log("error",err);
              req.flash('error','Something went wrong');
              return res.redirect('/cart');
          })

        },

        async index(req,res){
            const orders=await Order.find({customerId:req.user._id},
                null,
                {sort:{'createdAt':-1 }});
           // console.log(orders);
            res.render('customers/orders',{orders:orders,moment:moment});
        }
    }
}

module.exports=orderController;