
(function(filter) {
    'use strict';




    filter.keywordsFromDB = function(from) {
        var res = [], i, l;

        if ($.isArray(from)) {
            for (i = 0, l = from.length; i < l; i += 1) {
                res.push(filter.keywordFieldFromDB(from[i]));
            }
        } else {
            res.push(filter.keywordFieldFromDB(from));
        }

        return res;
    };

    filter.keywordFieldFromDB = function (obj) {
        var res = filter.generateCondition('keywords');

        if (!!obj.m_in) {
            res.val = obj.m_in.join(',');
            res.inclusive = true;
        } else {
            res.val = obj.join(',');
            res.inclusive = true;
        }

        return res;
    };

    filter.keywordsToDB = function(conditions) {
        var res = [],
            i,
            l = conditions.length;

        for (i = 0; i < l; i += 1) {
            if (conditions[i].type === 'keywords') {
                res.push(filter.keywordFieldToDB(conditions[i]));
            }
        }

        return res;
    };

    filter.keywordFieldToDB = function(obj) {
        var res = {};

        if (obj.inclusive) {
            res[obj.field] = {m_in: obj.val.split(',')};
        } else {
            res[obj.field] = obj.val.split(',');
        }

        return res;
    };



}(hunk('filter')));
