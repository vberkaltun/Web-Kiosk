/* EM TO PX */
function em(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
}

/* PX TO EM */
function px(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (input / emSize);
}

/* WHEN PAGE ON LOAD */

$(document).ready(function () {
    $('.table_news').css('height', $("body").height() - $('.table_weather').innerHeight() - em(5.000));
});

/* WHEN PAGE ON RESIZE */
$(window).resize(function () {
    $('.table_news').css('height', $("body").height() - $('.table_weather').innerHeight() - em(5.000));
});
