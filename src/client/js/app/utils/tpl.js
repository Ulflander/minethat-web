

(function(tpl) {
    'use strict';

    var tpls = {};

    tpl.render = function(id, vars) {
        var t;
        if (!tpls[id]) {
            t = $('#'+id);
            if (t.length === 0) {
                return '';
            }

            tpls[id] = t.val();
        }

        return tpl.replaceVars(tpls[id], vars);
    };

    tpl.replaceVars = function(template, vars) {
        if (typeof vars !== 'object') {
            return template;
        }

        var k;
        for (k in vars) {
            if (vars.hasOwnProperty(k)) {
                template = template.replace(new RegExp('{{' + k + '}}', 'ig'),
                                            vars[k]);
            }
        }
        return template;
    };
}(hunk('tpl')));