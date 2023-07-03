const router = require("express").Router();
// const mongoose = require("mongoose");

const Service = require("../models/Service.model");
const Review = require("../models/Review.model");

const User = require("../models/User.model"); 
const { isAuthenticated } = require("../middleware/jwt.middleware");




router.get("/service", (req, res) => {

    //finish this functionality
    const filterOptions = {
        category: req.headers.category 
    }

    Service.find(filterOptions).sort({createdAt: -1}).then((services) => {
       return  res.status(200).json(services)
    }).catch((error) => {
        console.log(error)
      return   res.status(500).json(error)
    })
})

//  POST /api/service  -  Creates a new service
router.post("/service", isAuthenticated, (req, res, next) => {
    const { title, description, place, date, price, name, email } = req.body;
console.log(req.payload)
    const newService = {
        title: title,
        description: description,
        place: place,
        date: date,
        price: price, 
        name: name,
        email: email
    }

    Service.create(newService).then((createdService) =>{
        User.findByIdAndUpdate({_id: req.payload._id}, {$push: {service: createdService._id}}, {new: true})
        .then(response => res.status(201).json(response))
    })
    .catch(err => {
        console.log("error creating a new service", err);
        res.status(500).json({
            message: "error creating a new service",
            error: err
        });
    })
});

// GET /api/services -  Retrieves all of the services
router.get('/users', (req, res, next) => {
    Service.find()
        .populate("reviews user")
        .then(response => {
            res.json(response)
        })
        .catch(err => {
            console.log("error getting list of services", err);
            res.status(500).json({
                message: "error getting list of services",
                error: err
            });
        })
});

//  GET /api/services/:serviceId  -  Get details of a specific service by id
router.get('/services/:serviceId', (req, res, next) => {
    
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }


    Service.findById(serviceId)
        .populate('reviews user')
        .then(service => res.json(service))
        .catch(err => {
            console.log("error getting details of a service", err);
            res.status(500).json({
                message: "error getting details of a service",
                error: err
            });
        })
});

// PUT /api/services/:serviceId  -  Updates a specific service by id
router.put('/services/:serviceId', (req, res, next) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    const newDetails = {
        title: req.body.title,
        description: req.body.description,
        place: req.body.place,
        date: req.body.date,
        price: req.body.price, 
        name: req.body.name,
        email: req.body.email
    }

    Service.findByIdAndUpdate(serviceId, newDetails, { new: true })
    .then((updatedService) => res.json(updatedService))
    .catch(err => {
        console.log("error updating service", err);
        res.status(500).json({
            message: "error updating service",
            error: err
        });
    })
});

// DELETE /api/services/:serviceId  -  Delete a specific service by id
router.delete('/services/:serviceId', (req, res, next) => {
    const { serviceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Service.findByIdAndRemove(serviceId)
        .then(deletedService => {
            return Review.deleteMany({ _id: { $in: deletedService.reviews } }); // delete all reviews assigned to that service
        })
        .then(() => res.json({ message: `Service with id ${serviceId} & all associated reviews were removed successfully.` }))
        .catch(err => {
            console.log("error deleting service", err);
            res.status(500).json({
                message: "error deleting service",
                error: err
            });
        })
});


module.exports = router;