const router = require("express").Router();
// const mongoose = require("mongoose");

const Service = require("../models/Service.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model"); // we still need to delete later

// GET /api/users -  Retrieves all of the users
router.get('/users', (req, res, next) => {
    User.find()
        .populate("reviews services")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of users", err);
            res.status(500).json({
                message: "error getting list of users",
                error: err
            });
        })
});

//  GET /api/users/:userId  -  Get details of a specific users by id
router.get('/users/:userId', (req, res, next) => {
    
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }


    User.findById(userId)
        .populate('reviews services')
        .then(user => res.json(user))
        .catch(err => {
            console.log("error getting details of a user", err);
            res.status(500).json({
                message: "error getting details of a user",
                error: err
            });
        })
});

// PUT /api/users/:userId  -  Updates a specific user by id
router.put('/users/:userId', (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    const newDetails = {
        email: req.body.email,
        password: req.body.password
    }

    User.findByIdAndUpdate(userId, newDetails, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch(err => {
        console.log("error updating user", err);
        res.status(500).json({
            message: "error updating user",
            error: err
        });
    })
});

// DELETE /api/users/:userId  -  Delete a specific user by id
router.delete('/users/:userId', (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    User.findByIdAndRemove(userId)
        .then(deletedUser => {
            return Review.deleteMany({ _id: { $in: deletedUser.reviews } });// delete all reviews assigned to that user
        })
        .then(() => res.json({ message: `User with id ${userId} & all associated reviews were removed successfully.` }))
        .catch(err => {
            console.log("error deleting user", err);
            res.status(500).json({
                message: "error deleting user",
                error: err
            });
        })
});


module.exports = router;