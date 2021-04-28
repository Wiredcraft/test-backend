const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find().exec().then(
        docs => {
            res.status(200).json(docs);
        }
    ).catch(err => {
        res.status(500).json(err);
    });
});

router.post('/', (req, res, next) => {

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        dob: req.body.dob,
        address: req.body.address,
        description: req.body.description
    });

    user.save().then(result => {
        res.status(201).json(result);
    }).catch(err => {
        res.status(403).json({
            message: 'Invalid parameters.'
        });
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id).exec().then(doc => {
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID."
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Internal error.'
        });
    });
});

// can update partial fields of user
router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;

    User.findOneAndUpdate({
        _id: id
    }, {
        $set: req.body
    }, {
        new: true
    }).exec().then(
        result => {
            res.status(200).json(result);
        }
    ).catch(err => {
        res.status(500).json({
            message: 'Internal error.'
        })
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({
        _id: id
    }).exec().then(result => {
        if (result.deletedCount > 0) {
            res.status(204).json(result);
        } else {
            res.status(404).json({ 
                message: 'User not found.' 
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Internal error.'
        })
    });
});

module.exports = router;