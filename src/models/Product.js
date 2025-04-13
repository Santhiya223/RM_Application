import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
         unique: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    stockQty: {
        type: String,
        required: true
    },
    image: {
        type: String,
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
