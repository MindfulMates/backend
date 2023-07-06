const router = require("express").Router();
const Review = require("../models/Review.model");
const Service = require("../models/Service.model");
const User = require("../models/User.model");



//  POST /api/reviews  -  Creates a new review
router.post("/review", (req, res, next) => {
    const { review, description, friendly, serviceId } = req.body;

    const newReview = {
        review: review,
        description: description,
        friendly: friendly,
    }
    let reviewFromDB

    Review.create(newReview)
        .then(createdReview => {
            reviewFromDB = createdReview
            return User.findByIdAndUpdate(req.payload._id, { $push: { review: reviewFromDB._id } }, { new: true })
        })
        .then(() => {
            return Service.findByIdAndUpdate(serviceId, { $push: { review: reviewFromDB._id } }, { new: true })
        })
        .then((response) => {
            res.status(201).json(response)
        })
        .catch(err => {
            console.log("error creating a new review", err);
            res.status(500).json({
                message: "error creating a new review",
                error: err
            });
        })
});


// GET /api/reviews -  Retrieves all of the reviews
router.get('/reviews', (req, res, next) => {
    Review.find().sort({ createdAt: -1 })
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of reviews", err);
            res.status(500).json({
                message: "error getting list of reviews",
                error: err
            });
        })
});


//  GET /api/reviews/:reviewId  -  Get details of a specific review by id
router.get('/reviews/:reviewId', (req, res, next) => {

    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }


    Review.findById(reviewId)
        .then(review => res.json(review))
        .catch(err => {
            console.log("error getting details of a review", err);
            res.status(500).json({
                message: "error getting details of a review",
                error: err
            });
        })
});



module.exports = router;