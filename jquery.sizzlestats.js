/*global console, jQuery*/
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
            // Firebug and Chrome
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
        MIN_TIME_TO_WARN: 10
    };

    // Wrap `$.find()`
    var find = $.find;
    $.find = function(selector) {
        var time;
        if (selector && typeof selector === 'string') {
            time = new Date().getTime();
        }

        var result = find.apply($, arguments);

        if (time) {
            time = new Date().getTime() - time;
            var stat = data[selector] || {name: selector, count: 0, time: 0};
            stat.count++;
            stat.time += time;
            data[selector] = stat;

            if (time > $.SizzleStats.options.MIN_TIME_TO_WARN) {
                // Warn about long running selectors
                console.warn('Selector took ' + time + 'ms:', selector);
            }
        }

        return result;
    };

    // Copy all original properties to wrapper
    for (var prop in find) {
        if (!(prop in $.find)) {
            $.find[prop] = find[prop];
        }
    }
    //$.find.matches = find.matches;
    //$.find.matchesSelector = find.matchesSelector;

}(jQuery));
