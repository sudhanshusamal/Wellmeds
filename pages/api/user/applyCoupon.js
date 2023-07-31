import nc from "next-connect";
import Product from "../../../models/Product";
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
import Coupon from "@/models/Coupon";
const handler = nc().use(auth)

handler.post(async (req, res) => {
  try {
    db.connectDb();
    const {coupon} =req.body;
    const user = User.findById(req.user)
    const checkCoupon = await Coupon.findOne({ coupon });
    if(checkCoupon == null){
        return res.json({message: "Invalid Coupon, try again."})
    } 
    const {cartTotal} = await Cart.findOne({ user: req.user})
    let totalAfterDiscount = cartTotal - (cartTotal * checkCoupon.discount) / 100;
    await Cart.findOneAndUpdate({ user: user._id}, {totalAfterDiscount})
    res.json({totalAfterDiscount: totalAfterDiscount.toFixed(2), discount: checkCoupon.discount})
   
    db.disconnectDb();
    return res.json({addresses: user.address})
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
});

export default handler;