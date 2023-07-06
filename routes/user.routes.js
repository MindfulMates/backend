const router = require("express").Router();
const mongoose = require("mongoose");
const Service = require("../models/Service.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");


// GET /api/users -  Retrieves all of the users
router.get('/users', (req, res, next) => {
    User.find()
        .select("-password")
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
        .select("-password")
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
        .select("-password")
        .then((updatedUser) => res.json(updatedUser))
        .catch(err => {
            console.log("error updating user", err);
            res.status(500).json({
                message: "error updating user",
                error: err
            });
        })
});

// DELETE
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)

        await Review.deleteMany({ _id: { $in: user.review } })
        await Service.deleteMany({ _id: { $in: user.service } })
        await User.findByIdAndDelete(userId)

        return res.status(200).json({ msg: "all deleted :)" })

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }


})


module.exports = router;