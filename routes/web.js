const authController = require('../app/http/controllers/authController');
const homeController= require('../app/http/controllers/homeController');
const cartController=require('../app/http/controllers/customers/cartController');
const orderController=require('../app/http/controllers/customers/orderController');
const statusController=require('../app/http/controllers/admin/statusController');


const adminOrderController=require('../app/http/controllers/admin/orderController');

//middlewares
const auth=require('../app/http/middleware/auth');
const guest=require('../app/http/middleware/guest');
const admin=require('../app/http/middleware/admin');

function initRoutes(app){

app.get('/',homeController().index);


app.get('/login',guest,authController().login);
app.post('/login',authController().postLogin);
app.get('/register',guest,authController().register);
app.post('/register',authController().postRegister);
app.get('/cart',cartController().index);
app.post('/update-cart',cartController().update);
app.get('/logout',authController().logout);

//customer routes
app.post('/orders',auth,orderController().store);
app.get('/customer/orders',auth,orderController().index);
app.get('/customer/orders/:id',auth,orderController().show);

//Admin routes
app.get('/admin/orders',admin,adminOrderController().index);
app.post('/admin/order/status',admin,statusController().update);




}

module.exports=initRoutes;