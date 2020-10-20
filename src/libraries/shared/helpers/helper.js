const rateLimit = require('express-rate-limit');

exports.rateLimiter = max =>
    rateLimit({
        max,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests! Please try again in one hour time'
    });

exports.filterObj = (obj, props) => {
    const newObj = {};

    Object.keys(obj).forEach(el => {
        if (props.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
};
