require('express-async-errors');
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");



const {Product , Comment , validateProduct} = require("../models/product");
const isAdmin = require("../middleware/isAdmin");

const products = [
    { id: 1, name: "iphone 12", price: 20000 },
    { id: 2, name: "iphone 13", price: 30000 },
    { id: 3, name: "iphone 14", price: 40000 }
];

router.get("/",async (req, res) => {
    throw new Error("hatalar");
    const products = await Product.find().populate("category","name -_id").select("-isActive -comments._id");
    
    res.send(products);
});

router.post("/", auth,isAdmin, async (req, res) => {
    const { error } =  validateProduct(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        category:req.body.category,
        comments : req.body.comments
    });

    try {
        const result = await product.save();
        res.send(result);
    }
    catch(err) {
        console.log(err);
    }
});

router.put("/comment/:id",auth,isAdmin, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    const comment = new Comment ({
        text: req.body.text,
        username: req.body.username
    });

    product.comments.push(comment);

    const updatedProduct = await product.save();
    res.send(updatedProduct)
});

router.delete("/comment/:id",auth, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    const comment = product.comments.id(req.body.commentid);
    comment.remove();

    const updatedProduct = await product.save()
    res.send(updatedProduct);


});


router.put("/:id",auth, async (req, res) => {

    // const product = await Product.findByIdAndUpdate(req.params.id, {
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }       
    // }, {new: true});

    // res.send(product);

    // const result = await Product.update({_id: req.params.id}, {
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price,
    //         description: req.body.description,
    //         imageUrl: req.body.imageUrl,
    //         isActive: req.body.isActive,
    //     }
    // });

    // res.send(result);


    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    const { error } = validateProduct(req.body);

    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageUrl = req.body.imageUrl;
    product.isActive = req.body.isActive;
    product.category = req.body.category;

    const updatedProduct = await product.save();

    res.send(updatedProduct);
});

router.delete("/:id",auth ,async (req, res) => {

    // const result = await Product.deleteOne({ _id: req.params.id });
    const product = await Product.findByIdAndDelete(req.params.id);
    
    
    if(!product) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }

    
    res.send(product);
});

router.get("/:id",auth ,async (req, res) => {
    // const product = await Product.findOne({_id: req.params.id});
    const product = await Product.findById(req.params.id).populate("category","name -_id");

    if(!product) {
        return res.status(404).send("aradığınız ürün bulunamadı.");
    }
    res.send(product);
});



module.exports = router;