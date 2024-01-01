import mongoose from "mongoose";
// Declare the Schema of the Mongo model
const couponSchema = new mongoose.Schema(
  {
    couponname: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Coupon", couponSchema);
