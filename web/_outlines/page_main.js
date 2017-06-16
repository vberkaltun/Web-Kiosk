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

var table_popup = document.getElementById('table_popup');

var trigger = document.getElementById('trigger');

trigger.onclick = function () {
    $('#table_popup').fadeTo(500, 1, function () {
        table_popup.style.display = 'block';
    });

    $('.table_main').addClass('blur');
    $('.table_weather').addClass('blur');
    $('.table_news').addClass('blur');
}

window.onclick = function (event) {
    if (event.target == table_popup) {
        $('#table_popup').fadeTo(500, 0, function () {
            table_popup.style.display = 'none';
            $('.table_news').blur();
        });

        $('.table_main').removeClass('blur');
        $('.table_weather').removeClass('blur');
        $('.table_news').removeClass('blur');
    }
}

/* --- WEATHER REFRESH --- */

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'C',
        success: function (weather) {
            html = '<p class="weather_city"><strong>' + weather.city + ', </strong>' + weather.region + '</p>';
            html += '<p class="weather_type">' + weather.currently + '</p>';
            html += '<p class="weather_temp space_clear">' + weather.temp + '&deg;' + weather.units.temp + '</p>';
            $('.weather_main').html(html);

            html = '<img src="_images/humidity.svg">';
            html += '<p>' + weather.humidity + '%</p>';
            $('.weather_humidity').html(html);

            html = '<img src="_images/wind.svg">';
            html += '<p>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</p>';
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

    loadWeather('Konak, TR', '29393805');

    //Update the weather every 10 minutes.
    setInterval(loadWeather('Konak, TR', '29393805'), 600000);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loadWeather(position.coords.latitude + ',' + position.coords.longitude);

            //Update the weather every 10 minutes.
            setInterval(loadWeather(position.coords.latitude + ',' + position.coords.longitude), 600000);
        });
    }
});

$(window).resize(function () {
    $('.table_news').css('height', $('body').height() - $('.table_weather').innerHeight() - em(5.000));
});
