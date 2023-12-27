import mongoose from "mongoose";
// Declare the Schema of the Mongo model
const brandSchema = new mongoose.Schema(
  {
    brandname: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Brand", brandSchema);
