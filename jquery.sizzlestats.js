/*global console, jQuery*/
/*eslint no-console:0*/
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
        var options = $.SizzleStats.options;
        $.each(data, function(k, v) {
            if (v.count >= options.MIN_COUNT_TO_SHOW || v.time >= options.MIN_TIME_TO_SHOW) {
                arr.push({
                    selector: v.selector,
                    avgTime: parseFloat((v.time / v.count).toFixed(3)),
                    time: parseFloat(v.time.toFixed(3)),
                    count: v.count
                });
            }
        });

        arr.sort(function(a, b) {
            return b.avgTime - a.avgTime;
        });

        if (console.table) {
            // Firebug, Chrome, IE11
            console.table(arr);
        } else {
            var i, aPad = 0, tPad = 0, cPad = 0, entry;
            arr.unshift({
                selector: 'selector',
                avgTime: 'avgTime',
                time: 'time',
                count: 'count'
            });
            for (i = 0; i < arr.length; i++) {
                entry = arr[i];
                aPad = Math.max(aPad, ('' + entry.avgTime).length);
                tPad = Math.max(tPad, ('' + entry.time).length);
                cPad = Math.max(cPad, ('' + entry.count).length);
            }

            for (i = 0; i < arr.length; i++) {
                entry = arr[i];
                // Extra spaces for IE and single string (no extra quotes) for FF
                console.log(padding(entry.avgTime, aPad) + ' ' +
                    padding(entry.time, tPad) + ' ' +
                    padding(entry.count, cPad) + ' ' +
                    entry.selector);
            }
        }
    };

    $.SizzleStats.rawData = data;

    $.SizzleStats.options = {
        MIN_COUNT_TO_SHOW: 5,
        MIN_TIME_TO_SHOW: 10,
        MIN_TIME_TO_WARN: 17
    };

    function updateStats(selector, time) {
        var selectorStats = data[selector] || {selector: selector, count: 0, time: 0};
        selectorStats.count++;
        selectorStats.time += time;
        data[selector] = selectorStats;

        if (time > $.SizzleStats.options.MIN_TIME_TO_WARN && window.console) {
            // Warn about long running selectors
            console.warn('Selector took ' + time + 'ms: ' + selector);
        }
    }

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
            updateStats(selector, time);
        }

        return result;
    };

    function wrap(orig, name) {
        return function(selector) {
            var time;
            if (selector && typeof selector === 'string') {
                time = getTimestamp();
            }

            var result = orig.apply(this, arguments);

            if (time) {
                time = getTimestamp() - time;
                updateStats(name + ' ' + selector, time);
            }

            return result;
        };
    }

    $.fn.extend({
        closest: wrap($.fn.closest, 'closest'),
        parents: wrap($.fn.parents, 'parents')
    });

    // Copy all original properties to wrapper, e.g. $.find.matches and $.find.matchesSelector
    for (var prop in find) {
        if (!(prop in $.find)) {
            //noinspection JSUnfilteredForInLoop
            $.find[prop] = find[prop];
        }
    }

}(jQuery));
