/* --- NEWS RESIZING --- */

function em(input) {
    var emSize = parseFloat($('body').css('font-size'));
    return (emSize * input);
}

function px(input) {
    var emSize = parseFloat($('body').css('font-size'));
    return (input / emSize);
}

/* --- POPUP TRIGGER --- */

var popup = document.getElementById('popup');

var trigger = document.getElementById('trigger');

trigger.onclick = function () {
    $('#popup').fadeTo(500, 1, function () {
        popup.style.display = 'block';
    });

    $('.table_main').addClass('blur');
    $('.table_weather').addClass('blur');
    $('.table_news').addClass('blur');
}

window.onclick = function (event) {
    if (event.target == popup) {
        $('#popup').fadeTo(500, 0, function () {
            popup.style.display = 'none';
            $('.table_news').blur();
        });

        $('.table_main').removeClass('blur');
        $('.table_weather').removeClass('blur');
        $('.table_news').removeClass('blur');
    }
}

/* --- WEATHER REFRESH --- */

function getWeather() {
    $.simpleWeather({
        location: 'Rrzekne, LV',
        woeid: '854807',
        unit: 'C',
        success: function (weather) {
            html = '<p class="weather_city"><strong>' + weather.city.toUpperCase() + ', </strong>' + weather.region.toUpperCase() + '</p>';
            html += '<p class="weather_type">' + weather.currently.toUpperCase() + '</p>';
            html += '<p class="weather_temp space_clear">' + weather.temp + '&deg;' + weather.units.temp + '</p>';
            $('.weather_main').html(html);

            html = '<img src="_images/humidity.svg">';
            html += '<p>' + weather.humidity + '%</p>';
            $('.weather_humidity').html(html);

            html = '<img src="_images/wind.svg">';
            html += '<p>' + weather.wind.direction.toUpperCase() + ' ' + weather.wind.speed.toUpperCase() + ' ' + weather.units.speed.toUpperCase() + '</p>';
            $('.weather_wind').html(html);

            /* NEED ATTENTION */
            $('.table_weather').css('background-image', 'url(../web/_images/_forecast/' + weather.code + '.png)');
            $('.table_news').css('height', $('body').height() - $('.table_weather').innerHeight() - em(5.000));
        },
        error: function (error) {
            $('.weather_main').html('<p class="weather_city"><strong>' + error + '</p>');
        }
    });
}

/* --- DOCUMENT FETCHING --- */

$(document).ready(function () {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

$(window).resize(function () {
    $('.table_news').css('height', $('body').height() - $('.table_weather').innerHeight() - em(5.000));
});
