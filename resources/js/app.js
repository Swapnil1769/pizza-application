import axios from 'axios'
import Noty from 'noty'
import moment from 'moment';
import {initAdmin} from './admin'
//import initAdmin from './admin'
let addtoCart=document.querySelectorAll('.add-to-cart');
let cartCounter=document.querySelector('#cartCounter');


//axios in 1:38:12 

function updateCart(pizza){
   axios.post('/update-cart',pizza).then(function(res){
      // console.log(res);
      
       cartCounter.innerText=res.data.totalQty
       new Noty({
           type:'success',
           timeout:1000,
          text:'Items added to Cart',
          progressBar:false,
          
    })
   }).catch(err=>{
       new Noty({
           type:'error',
           timeout:1000,
           text:'Something went wrong',
           progressBar:d=false
       })
   })
}
addtoCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        //console.log(e);
        //let pizza=btn.dataset.pizza
        //console.log(pizza);
        let pizza=JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        console.log(pizza);
        
        })
})

initAdmin();