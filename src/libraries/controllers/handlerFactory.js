const ApiFeatures = require('./../utils/ApiFeatures');

const catchAsync = require('./../Error/catchAsync');
const AppError = require('./../Error/appError');

const { filterObj } = require('../helpers/helper');

exports.createOne = (Model, createDetails) =>
    catchAsync(async (req, res, next) => {
        const details =
            createDetails.length != 0
                ? filterObj(req.body, createDetails)
                : req.body;

        const doc = await Model.create(details);

        res.status(201).json({
            status: 'SUCCESS',
            data: {
                data: doc
            }
        });
    });

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(
                new AppError(
                    `No Document found with this id - ${req.params.id}`,
                    404
                )
            );
        }

        res.status(204).json({
            status: 'SUCCESS',
            data: null
        });
    });

exports.updateOne = (Model, updateDetails, status) =>
    catchAsync(async (req, res, next) => {
        const details = updateDetails
            ? filterObj(req.body, ...updateDetails)
            : req.body;

        if (Object.entries(details).length === 0) {
            return next(new AppError('Invalid Operation!', 400));
        }

        const doc = await Model.findByIdAndUpdate(req.params.id, details, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(
                new AppError(
                    `No document found with the id - ${req.params.id}`,
                    404
                )
            );
        }

        status = status ? status : 200;

        res.status(status).json({
            status: 'SUCCESS',
            data: {
                data: doc
            }
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);

        if (popOptions) {
            query = query.populate(popOptions);
        }

        const doc = await query;

        if (!doc) {
            return next(
                new AppError(
                    `No document found with the id - ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: {
                data: doc
            }
        });
    });

exports.getAll = (Model, fields) =>
    catchAsync(async (req, res) => {
        const filter = fields ? { ...fields } : {};

        const features = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .paginate()
            .limitFields();

        // console.log(features);
        // const docs = await features.query.explain();
        const docs = await features.query;

        // console.log(docs);

        // send response
        res.status(200).json({
            status: 'SUCCESS',
            length: docs.length,
            data: {
                data: docs
            }
        });
    });
