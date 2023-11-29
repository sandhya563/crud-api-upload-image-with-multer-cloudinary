const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

exports.createProduct = async (req, res) => {
    try {
                if (!req.cloudinaryUrl) {
                    console.log(req.cloudinaryUrl, "cloud");
                    return res.status(400).json({ error: 'Cloudinary URL not found' });
                }
                const cloudinaryUrl = req.cloudinaryUrl;
                const formData = JSON.parse(req.body.form);
                console.log(formData, "formdata1");
                const newProduct = new Product({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    image: cloudinaryUrl, // Using the Cloudinary URL
                });
                await newProduct.save(); // Save the product to the database
                return res.status(200).json({ message: 'Product updated successfully', newProduct});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            message: 'Error creating product',
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();
        return res.status(200).json({ message: 'Product updated successfully', products});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            message: 'Error fetching products',
        });
    }
};

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        // Find the product from the database
        const product = await Product.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Extract the public ID or the URL of the image from the product data
        const imageUrl = product.image; // Assuming 'image' contains the Cloudinary URL

        // Parse the public ID from the Cloudinary URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        console.log(publicId, "publicId");

        // Delete the image from Cloudinary using the public ID
        await cloudinary.uploader.destroy(publicId);

        // Delete the product from the database after deleting the image
        await Product.deleteOne({ _id: id });
        console.log(Product, "Product");

        return res.status(200).json({ message: 'Product updated successfully', product});

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: 'Error deleting product',
        });
    }
};

exports.updateProduct = async (req, res) => {
    const id = req.params.id; // Extract product ID from request params
    try {
        const product = await Product.findOne({ _id: id });
        console.log(product, "old product");
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const updatedFields = req.body; // Extract updated product data from request body
        const formValuesObjet = JSON.parse(updatedFields.form);
        // Handle image upload if provided
        if (req.file) {
            const imagePath = req.file.path; // Get the path of the uploaded image
            const newImage = await cloudinary.uploader.upload(imagePath); // Upload image to Cloudinary
            formValuesObjet.image = newImage.secure_url; // Update image URL in product data
        }
        // Update product record in the database with updatedFields
        const updatedProduct = await Product.findByIdAndUpdate(id, formValuesObjet, { new: true });
        if (!updatedProduct) {
            return res.status(500).json({ message: 'Failed to update product' });
        }
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            message: 'Error updating product',
        });
    }
};


