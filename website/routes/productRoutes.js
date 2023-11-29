const express = require('express');
const router = express.Router();
const { uploadToCloudinary } = require("../middlewares/imageUplods");
const {upload} = require("../middlewares/multer");
const { createProduct,getAllProducts, deleteProduct,updateProduct} = require("../controller/product");

router.post("/api/products", upload.single('image'), uploadToCloudinary, createProduct);
router.get('/api/products', getAllProducts);
router.delete('/api/products/:id',deleteProduct);
router.put('/api/products/:id', upload.single('image'), uploadToCloudinary, updateProduct);

module.exports = router;