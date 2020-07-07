const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/products');

const router = express.Router();

router.get('/', (req, res) => {
    Product.find().select('_id name price').exec().then(docs => {
        const count = docs.length;
        const response = {
            count, 
            propducts: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/"+ doc._id
                    }
                }
            })
        }
        return res.status(201).json({response})
    }).catch(err => res.status(404).json({error: "Something went wrong!"}))
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log("id", id);
    Product.findById(id).exec().then(result => {
        console.log(result);
        res.status(201).json({doc:result})
    })
    .catch(err => res.status(404).json(err));
});

// post a product
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {console.log(result)})
        .catch(err => {console.log(err)});

    res.status(201).json({
        "message": "product posted successfully",
        product
    });
});

// update a entry
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for(let ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id}, {$set: updateOps})
    .exec()
    .then(result => res.status(200).json({updated: result}))
    .catch(err => res.status(500).json({errorUpdate: err}));

})

// delete a post 
router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id:id}).exec().then(result => {
        console.log("removed successfully.");
        res.status(200).json(result);
    })
    .catch(err => console.log(err));
});
module.exports = router;