class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // page, sort, limit, filter

    filter() {
        if (Object.entries(this.queryString).length !== 0) {
            let queryObj = { ...this.queryString };
            const excludeObj = ['page', 'sort', 'limit', 'fields'];

            // REMOVE THE KEYS IN excludeObj from queryObj
            excludeObj.forEach(el => delete queryObj[el]);

            // CHANGE (lt, gt, lte, gte) to ($lt, $gt, $lte, $gte)
            let stringObj = JSON.stringify(queryObj);

            stringObj = stringObj.replace(
                /\b(gt|lt|lte|lte)\b/g,
                match => `$${match}`
            );

            this.query.find(JSON.parse(stringObj));
        }
        return this;
    }

    sort() {
        // sort takes values in this format sort('price age -name')

        if (this.queryString.sort) {
            const sortVal = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortVal);

            return this;
        }

        this.query = this.query.sort('createdAt');

        return this;
    }

    limitFields() {
        // select takes values in this format select('price age -name')
        if (this.queryString.fields) {
            const fieldsVal = this.queryString.fields.split(',').join(' ');

            this.query = this.query.select(fieldsVal);
        }

        this.query = this.query.select('-v');

        return this;
    }

    paginate() {
        // PAGINATION
        let page = this.queryString.page || 1;
        let limit = this.queryString.limit || 9;

        let skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;
