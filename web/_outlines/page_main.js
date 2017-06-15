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

/* WHEN POPUP TRIGGERED */

// Get the popup
var popup = document.getElementById('popup');

// Get the trigger that opens the popup
var trigger = document.getElementById("trigger");

// Get the <close> element that closes the popup
var close = document.getElementsByClassName("close")[0];

// When the user clicks the trigger, open the popup 
trigger.onclick = function () {
    popup.style.display = "block";
}

// When the user clicks on <close> (x), close the popup
close.onclick = function () {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function (event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}
