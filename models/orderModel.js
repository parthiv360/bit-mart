const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    HostelNumber: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required:true
  },
  paymentInfo:{
     id:{
        type:String,
        required:true
     },
     status:{
        type:String,
        required:true
     }
  },
  paidAt:{
     type:Date,
     required:true
  },
  itemsPrice:{
     type:Number,
     required:true,
     default:0
  },
  totalPrice:{
     type:Number,
     required:true,
     default:0
  },
  orderStatus:{
     type:String,
     default: "Processing",
     required:true
  },
  deliveredAt : Date,
  createdAt:{
     type:Date,
     default:Date.now()
  }
})

module.exports = mongoose.model("Order",orderSchema)