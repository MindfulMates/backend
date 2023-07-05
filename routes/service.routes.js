const router = require("express").Router();
const mongoose = require("mongoose");

const Service = require("../models/Service.model");
const Review = require("../models/Review.model");

const User = require("../models/User.model"); 
const { isAuthenticated } = require("../middleware/jwt.middleware");



const fileUploader = require("../config/cloudinary.config");

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
    // console.log("file is: ", req.file)
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }    
  res.json({ fileUrl: req.file.path });
});

// router.get("/services", (req, res) => {
//     // finish this functionality
//     const filterOptions = {
//         category: req.headers.category 
//     }
//     .then((services) => {
//        return  res.status(200).json(services)
//     }).catch((error) => {
//         console.log(error)
//       return   res.status(500).json(error)
//     })
// })

//  POST /api/newservice  -  Creates a new service
router.post("/newservice", isAuthenticated, (req, res, next) => {
    const { title, description, place, date, price, name, email, category, imageUrl } = req.body;
console.log(req.payload)
    const newService = {
        title: title,
        description: description,
        place: place,
        date: date,
        price: price, 
        name: name,
        email: email,
        category: category,
        imageUrl: imageUrl
    }

    Service.create(newService)
    .then((createdService) =>{
        return User.findByIdAndUpdate({_id: req.payload._id}, {$push: {service: createdService._id}}, {new: true})
    })
    .then(response => res.status(201).json(response))
    .catch(err => {
        console.log("error creating a new service", err);
        res.status(500).json({
            message: "error creating a new service",
            error: err
        });
    })
});

// GET /api/services -  Retrieves all of the services
router.get('/services', (req, res, next) => {
    // const filterOptions = {
    //             category: req.headers.category}
    // pass this one later to Service.find(filterOptions)
    Service.find().sort({createdAt: -1})
        // .populate("user")
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
        .populate('review')
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
        email: req.body.email,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
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