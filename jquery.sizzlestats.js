/*global console, performance, jQuery*/
/**
 * jQuery plugin to collect and show in console performance stats of Sizzle selector.
 * https://github.com/victor-homyakov/SizzleStats
 */
(function($) {

    var data = {};

    function padding(str, length) {
        str = '' + str;
        var count = length - str.length;
        var spaces = count < 1 ? '' : new Array(count + 1).join(' ');
        return spaces + str;
    }

    var getTimestamp = (window.performance && window.performance.now) ? function() {
        return window.performance.now();
    } : function() {
        return new Date().getTime();
    };

    $.SizzleStats = function() {
        var arr = [];
        $.each(data, function(k, v) {
            if (v.count >= $.SizzleStats.options.MIN_COUNT_TO_SHOW || v.time >= $.SizzleStats.options.MIN_TIME_TO_SHOW) {
                arr.push(v);
            }
        });

        arr.sort(function(a, b) {
            return b.count - a.count;
        });

        if (console.table) {
            // Firebug, Chrome, IE11
            console.table(arr);
        } else {
            var cPad = ('' + arr[0].count).length,
                tPad = ('' + arr[0].time).length;
            for (var i = 0; i < arr.length; i++) {
                var entry = arr[i];
                // Extra spaces for IE and single string (no extra quotes) for FF
                console.log(padding(entry.count, cPad) + ' ' + padding(entry.time, tPad) + ' ' + entry.name);
                //console.log(entry.count, ' ', entry.time, ' ', entry.name);
            }
        }
    };

    $.SizzleStats.rawData = data;

    $.SizzleStats.options = {
        MIN_COUNT_TO_SHOW: 5,
        MIN_TIME_TO_SHOW: 10,
        MIN_TIME_TO_WARN: 17
    };

    // Wrap `$.find()`
    var find = $.find;
    $.find = function(selector, context, results, seed) {
        var time;
        if (selector && typeof selector === 'string') {
            time = getTimestamp();
        }

        //var result = find.apply($, arguments);
        var result = find.call($, selector, context, results, seed);

        if (time) {
            time = getTimestamp() - time;
            var stat = data[selector] || {name: selector, count: 0, time: 0};
            stat.count++;
            stat.time += time;
            data[selector] = stat;

            if (time > $.SizzleStats.options.MIN_TIME_TO_WARN) {
                // Warn about long running selectors
                console.warn('Selector took ' + time + 'ms: ' + selector);
            }
        }

        return result;
    };

    // Copy all original properties to wrapper, e.g. $.find.matches and $.find.matchesSelector
    for (var prop in find) {
        if (!(prop in $.find)) {
            $.find[prop] = find[prop];
        }
    }

}(jQuery));
