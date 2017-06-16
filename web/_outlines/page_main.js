$(document).ready(function () {

    // FIRST REQUEST
    requestData();

    // REPEATING REQUEST EVERY 10 MINUTES
    setInterval(requestData(), 600000);

    // ---

    // FIRST REQUEST
    loadWeather('Konak, TR', '29393805');

    // UPDATE THE WEATHER EVERY 10 MINUTES
    setInterval(loadWeather('Konak, TR', '29393805'), 600000);

    // CHECKING THE GEOLOCATION OF WEB BROWSER
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loadWeather(position.coords.latitude + ',' + position.coords.longitude);

            // UPDATE THE WEATHER EVERY 10 MINUTES
            setInterval(loadWeather(position.coords.latitude + ',' + position.coords.longitude), 600000);
        });
    }
});

$(window).resize(function () {

    // WHEN RESIZING, RESIZE NEWS TABLE ACCORDING TO THE WEATHER TABLE
    $('.table_news').css('height', $('body').height() - $('.table_weather').outerHeight(true) - em(2.500));
});

/* --- CHANGE EM TO PX AND PX TO EM --- */

function em(input) {
    var emSize = parseFloat($('body').css('font-size'));
    return (emSize * input);
}

function px(input) {
    var emSize = parseFloat($('body').css('font-size'));
    return (input / emSize);
}

/* --- GET WEATHER DATA AND FILL THE WEATHER TABLE --- */

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'C',
        success: function (weather) {

            // FILL MAIN WEATHER DATA
            html = '<p class="weather_city"><strong>' + weather.city + ', </strong>' + weather.region + '</p>';
            html += '<p class="weather_type">' + weather.currently + '</p>';
            html += '<p class="weather_temp space_clear">' + weather.temp + '&deg;' + weather.units.temp + '</p>';
            $('.weather_main').html(html);

            // FILL SUB WEATHER DATA
            html = '<img src="_images/humidity.svg">';
            html += '<p>' + weather.humidity + '%</p>';
            $('.weather_humidity').html(html);

            // FILL SUB WEATHER DATA
            html = '<img src="_images/wind.svg">';
            html += '<p>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</p>';
            $('.weather_wind').html(html);

            // AT THE SAME TIME CHANGE BACKGROUND IMAGE OF WEATHER TABLE
            $('.table_weather').css('background-image', 'url(../web/_images/_forecast/' + weather.code + '.png)');

            // RESIZE NEWS TABLE ACCORDING TO THE WEATHER TABLE
            $('.table_news').css('height', $('body').height() - $('.table_weather').outerHeight(true) - em(2.500));
        },
        error: function (error) {
            $('.weather_main').html('<p class="weather_city"><strong>' + error + '</p>');
        }
    });
}

/* --- GET LECTURE DATA AND FILL THE LECTURE TABLE  --- */

function requestData() {
    $.ajax({
        url: "http://www.ru.lv/scripts/tlns_stundu_saraksts/request.php",
        type: "post",
        success: function (data) {
            $(".table_main table tbody").empty();

            var json = JSON.parse(data);
            console.log(data);
            console.log(json);

            for (var i = 0; i < json.length; i++) {
                if (!Array.isArray(json[i].laiks))
                    json[i].laiks = [json[i].laiks];
                if (json[i].laiks)
                    processData(json[i].laiks[0]);
            }
        }
    });
}

function processData(data) {

    // CHECKING IF THE THERE'S ANY CONTENT
    if (data == null || !data.telpa) return;

    var room = null;
    var time = null;
    var lecture = null;
    var name = null;

    // THE FIRST ONE GETS CHOSEN
    if (Array.isArray(data.telpa))
        data.telpa = data.telpa[0];

    if (data.telpa.nos) {

        // ROOM IS REQUIRED
        room = data.telpa.nos;

        // CHECK THE TIME
        if (data.no) time = data.no;

        // CHECKING THE COURSE NAME
        if (data.telpa.kurs && data.telpa.kurs.nos) lecture = data.telpa.kurs.nos;

        // CHECKING THE LECTURER'S NAME
        if (data.telpa.kurs.pasn) name = data.telpa.kurs.pasn;
    } else return;

    // ADDING A ROW
    addLecturer(room, time, lecture, name);
}

function addLecturer(room, time, lecture, name) {
    $row = $("<tr>").append(
        ("<td>" + lecture + "</td>"), ("<td>" + name + "</td>"),
        ("<td><span class='status_outside status_other'><span class='status_inside'>" + room + "</span></span></td>"),
        ("<td><span class='status_outside status_other'><span class='status_inside'>" + time + "</span></span></td>"),
        ("<td><span class='status_outside status_active'><span class='status_inside'>ACTIVE</span></span></td>"));
    $("#main_lecture").append($row);
}
