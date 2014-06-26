
(function() {
    'use strict';


    /**
     * Convert request body to filter model resource.
     *
     * @param  {Object} reqBody Request body
     * @return {Object}         Filter resource
     */
    exports.toFilterModel = function(reqBody) {
        var m = {
                fields: {}
            },
            k;

        for (k in reqBody) {
            if (reqBody.hasOwnProperty(k)) {

                switch (k) {
                    case 'name':
                    case 'color':
                        m[k] = reqBody[k];
                        break;
                    default:
                        m.fields[k.replace(/\./ig, '/')] = reqBody[k];
                }
            }
        }

        return m;
    };

    /**
     * Convert a filter to mongo conditions.
     *
     * @param  {Object} filter Filter description
     * @return {Object}        Mongo conditions
     */
    exports.toCondition = function(filter) {
        var c = {
                status: 'MINED'
            },
            k;

        for (k in filter) {
            if (filter.hasOwnProperty(k)) {
                exports.toFieldCondition(c, k, filter[k]);
            }
        }
        console.log(c);
        return c;
    };

    /**
     * Convert a filter field to a mongo field condition.
     *
     * @param  {Object} c   Mongo conditions object
     * @param  {String} k   Field key
     * @param  {mixed} val Field value
     */
    exports.toFieldCondition = function(c, k, val) {
        switch (k) {

            // KEYWORDS
            case 'keywords':
                if (val === '') {
                    return;
                }
                c['properties.keywords.main'] = {
                    '$in': val.split(',')
                };
                return;

            // ENTITIES
            case 'entities':
                return;

            // METRICS
            default:
                exports.toFieldMetric(c, k, val);
        }
    };

    /**
     * Convert a filter metric field to a mongo field condition.
     *
     * @param  {Object} c   Mongo conditions object
     * @param  {String} k   Field key
     * @param  {mixed} val Field value
     */
    exports.toFieldMetric = function(c, k, val) {
        var key, comparator;

        k = k.replace(/\//ig, '.');

        if (k.indexOf('.') === -1) {
            return;
        }

        key = k.split('.');
        comparator = key.splice(key.length - 1, 1)[0];
        if (comparator !== 'min' && comparator !== 'max') {
            return;
        }

        val = parseFloat(val);
        if (isNaN(val)) {
            return;
        }

        key = key.join('.');
        if (!c[key]) {
            c[key] = {};
        }

        if (comparator === 'min') {
            c[key].$gte = val;
        } else {
            c[key].$lte = val;
        }
    };
}());