const Review = require('../models/reviewModel');
// const catchAsync = require('../ultis/catchAsync');
const factory = require('./handlerFactory');

;
exports.setTourUserIds = (req, res, next) => {
    // Allow nested Routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    // end of allowing nested routes
    next();
};
exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review);
exports.createReviews = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);