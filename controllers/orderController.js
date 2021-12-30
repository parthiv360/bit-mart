const Order=require("../models/orderModel")
const Product=require('../models/productModel')
const Apperror=require('../utils/errorClass')
const catchAsyncerror=require('../middleware/catchAsyncerror')
const User=require("../models/user")

exports.renderOrders=async (req, res, next) => {

   const curUser=await User.findById(req.user.id)
      .populate({
         path: 'cartItems',
         populate: {
            path: 'cartItem',
         }
      });
   let totalPrice=0;
   for (let item of curUser.cartItems) {
      totalPrice+=item.cartItem.price;
   }
   totalPrice+=(totalPrice/20);
   res.render('cart/payment', { totalPrice: totalPrice, totalItems: curUser.cartItems.length, bucks: 2000 });

}

exports.newOrder=catchAsyncerror(async (req, res, next) => {
   const curUser=await User.findById(req.user.id)
      .populate({
         path: 'cartItems',
         populate: {
            path: 'cartItem',
         }
      });
   let totalPrice=0;
   for (let item of curUser.cartItems) {
      totalPrice+=item.cartItem.price;
   }
   if (totalPrice>curUser.coins) {
      req.flash('error', "You Have Insufficient Balance!");
      res.redirect('/cart');
      return;
   }
   const { roomNo, hostelNo, phoneNo }=req.body
   if (parseInt(phoneNo)/1e10==0) {
      req.flash('error', "Enter a Valid Phone Number!");
      res.redirect('/order');
      return;
   }

   for (let item of curUser.cartItems) {
      let product=await Product.findById(item.cartItem.id)
         .populate('creator');
      let order=new Order({
         shippingInfo: {
            HostelNumber: hostelNo,
            RoomNumber: roomNo,
            phoneNo: phoneNo
         }
      });
      if (User.exists({ id: product.creator.id })==true) {
         let seller=await User.findById(product.creator.id);
         seller.coins+=item.quantity*product.price;
         await seller.save();
      }
      curUser.coins-=item.quantity*product.price;
      order.orderItem=item.cartItem.id;
      product.quantity-=item.quantity;
      await order.save();
      await product.save();
      curUser.orders.push(order);
   }
   curUser.cartItems.splice(0, curUser.cartItems.length);
   await curUser.save();
   req.flash('success', 'Order have been Successfully Placed');
   res.redirect('/');
   // res.status(201).json({
   //    success: true,
   //    curUser
   // });
})

exports.myOrders=catchAsyncerror(async (req, res, next) => {
   const curUser=await User.findById(req.user.id)
      .populate({
         path: 'orders',
         populate: {
            path: 'orderItem'
         }
      });
   console.log(curUser.orders);
   res.render('cart/orders', { curUser });

   // res.status(200).json({
   //    success: true,
   //    orders
   // })
})