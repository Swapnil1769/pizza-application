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





//change order status
let statuses=document.querySelectorAll('.status_line');
console.log(statuses);
let hiddenInput=document.querySelector('#hiddenInput');
let order=hiddenInput ? hiddenInput.value : null
order=JSON.parse(order);
let time=document.createElement('small')


function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current');

    })
   let stepCompleted=true;
   statuses.forEach((status)=>{
        let dataProp=status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataProp===order.status){
            stepCompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
            
        }
   })

}

updateStatus(order);

//Socket
let socket=io()

//join 
if(order){
    socket.emit('join',`order_${order._id}`)

}

let adminAreaPath=window.location.pathname
console.log(adminAreaPath);
if(adminAreaPath.includes('admin')){
    initAdmin(socket);
    socket.emit('join','adminRoom');
}
socket.on('orderUpdated',(data)=>{
    const updatedOrder={...order}
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    updateStatus(updatedOrder);
    console.log(data)
})

//this will loook like this order_s42528nfhws
