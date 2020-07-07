const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Order  = require('../model/orders');

router.get('/', (req, res) => {
    Order
        .find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            const count = docs.length;
            const response = docs.map(doc => {
                return{
                    count,
                    request:{
                        product: doc.product,
                        quantity: doc.quantity,
                        id: doc._id,
                        type: "GET",
                        url: 'http://localhost:3000/orders/'+ doc._id
                    }
                }
            });
            res.status(201).json({response});
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Order.find({_id:id}).exec().then(doc => res.status(200).json(doc))
    .catch(err => res.status(500).json(err));
});

router.post('/', (req, res) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId, 
        quantity: req.body.quantity,
    });
    order.save().then(doc => res.status(201).json({doc}))
});

// update an entry
router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updateOps = {};
    for(let ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Order.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result => res.status(200).json({updatedResponse: result}))
    .catch(err => res.status(500).json({err}));
});

router.delete('/:id', (req, res) => {
    const id =  req.params.id;
    Order.remove({_id:id}).exec().then(result => {
        const response = {
            "message": "successfully deleted.",
            "id": id
        };
        res.status(404).json({response});
    });
});


module.exports = router; 