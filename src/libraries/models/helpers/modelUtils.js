const crypto = require('crypto');

const removeProps = props => {
    return (doc, ret, options) => {
        if (Array.isArray(props)) {
            props.forEach(prop => delete ret[prop]);
        }

        delete ret.id;
        delete ret.createdAt;
        delete ret.__v;

        return ret;
    };
};

exports.customProps = props => {
    return {
        virtuals: true,
        versionKey: false,
        transform: removeProps(props)
    };
};

exports.subjectsEnum = level => {
    const subjects = {
        junior: [
            'mathematics',
            'english language',
            'integrated/basic science',
            'introductory/basic technology',
            'social studies',
            'computer studies',
            'french language',
            'yoruba language',
            'igbo language',
            'hausa language',
            'home economics',
            'agricultural science',
            'physical & health education (phe)',
            'business studies',
            'christian religious knowledge (crk)',
            'islamic religious knowledge (irk)',
            'music',
            'fine/creative art'
        ],
        senior: [
            'mathematics',
            'english language',
            'physics',
            'chemistry',
            'biology',
            'agricultural science',
            'geography',
            'economics',
            'civic education',
            'commerce',
            'accounting',
            'government',
            'literature',
            'literature in english',
            'food and nutrition',
            'christian religious studies (crs)',
            'islamic religious studies (irs)',
            'computer science',
            'igbo language',
            'yoruba language'
        ]
    };

    return subjects[level];
};

exports.arrayLimit = (minLimit, maxLimit, val) => {
    return val.length > minLimit && val.length < maxLimit;
};

exports.modifySubjects = value => {
    if (value.length === 0) {
        return undefined;
    }

    value = value.map(subject => subject.toLowerCase());
    return value;
};

exports.toLower = value => {
    if (!Array.isArray(value) && typeof value !== 'object') {
        return undefined;
    }

    if (!Array.isArray(value) && typeof value === 'object') {
        value = Object.values(value);
        console.log('isObject', value);
    }

    console.log(value, typeof value);

    value = value.map(val => val.toLowerCase());
    return value;
};

exports.encryptId = teacherId =>
    crypto
        .createHash('sha256')
        .update(teacherId)
        .digest('hex');

exports.verifyTeacherId = async (teacherId, Model) => {
    const teacher = await Model.findOne({ teacherId });

    if (!teacher) {
        return null;
    }

    return teacher;
};
