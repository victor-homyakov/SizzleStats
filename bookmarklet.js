javascript:(function(d, $) {
    if (!$) {
        alert('Sizzle Stats measures performance of jQuery Sizzle\nTherefore this bookmarklet requires jQuery');
    } else if (!$.SizzleStats) {
        var js = d.createElement('script');
        //js.type = 'text/javascript';
        js.src = '//rawgithub.com/victor-homyakov/SizzleStats/master/jquery.sizzlestats.js' + Math.floor((+new Date()) / 86400000);
        d.getElementsByTagName('head')[0].appendChild(js);
    }
}(document, window.jQuery));
