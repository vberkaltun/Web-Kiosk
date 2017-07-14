$(document).ready(function () {

	// FIRST REQUEST OF THE NOTICES
	requestNews();

	// UPDATE THE NOTICES EVERY 10 MINUTES
	setInterval(requestNews(), 600000);

	// ---

	// FIRST REQUEST OF THE LECTURES
	requestLecture();

	// UPDATE THE LECTURES EVERY 10 MINUTES
	setInterval(requestLecture(), 600000);

	// ---

	// FIRST REQUEST OF THE WEATHER
	loadWeather("Konak, TR", "29393805");

	// UPDATE THE WEATHER EVERY 10 MINUTES
	setInterval(loadWeather("Konak, TR", "29393805"), 600000);

	// CHECKING THE GEOLOCATION OF WEB BROWSER
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function (position) {
			loadWeather(position.coords.latitude + "," + position.coords.longitude);

			// UPDATE THE WEATHER EVERY 10 MINUTES
			setInterval(loadWeather(position.coords.latitude + "," + position.coords.longitude), 600000);
		});
	}
});

$(document).click(function () {

	// WHEN CONTROL KEY IS PRESSED AND ADMIN PANEL IS DISABLED
	if ($("#page_front").css("opacity") == 0 && window.event.ctrlKey) {
		$('#page_front').show(0, function () {
			$('#page_front').removeClass('shrink');
		});
	}

	// WHEN CONTROL KEY IS PRESSED AND ADMIN PANEL IS ENABLED
	if ($("#page_front").css("opacity") == 1 && window.event.ctrlKey) {
		$('#page_front').show(0, function () {
			$('#page_front').addClass('shrink');
		});
	}
});

$(window).resize(function () {

	// WHEN RESIZING, RESIZE NEWS TABLE ACCORDING TO THE WEATHER TABLE
	$(".table_news").css("height", $("body").height() - $(".table_weather").outerHeight(true) - parseFloat($(".table_weather").css("margin-top")) - parseFloat($(".table_weather").css("margin-bottom")));
});

/* --- GET WEATHER DATA AND FILL THE WEATHER TABLE --- */

function loadWeather(location, woeid) {
	$.simpleWeather({
		location: location,
		woeid: woeid,
		unit: "C",
		success: function (weather) {

			// FILL MAIN WEATHER DATA
			html = "<p class='weather_city'><strong>" + weather.city + ", </strong>" + weather.region + "</p>";
			html += "<p class='weather_type'>" + weather.currently + "</p>";
			html += "<p class='weather_temp space_clear'>" + weather.temp + "&deg;" + weather.units.temp + "</p>";
			$(".weather_main").html(html);

			// FILL SUB WEATHER DATA
			html = "<img src='_images/humidity.svg'>";
			html += "<p>" + weather.humidity + "%</p>";
			$(".weather_humidity").html(html);

			// FILL SUB WEATHER DATA
			html = "<img src='_images/wind.svg'>";
			html += "<p>" + weather.wind.direction + " " + weather.wind.speed + " " + weather.units.speed + "</p>";
			$(".weather_wind").html(html);

			// AT THE SAME TIME CHANGE BACKGROUND IMAGE OF WEATHER TABLE
			$(".table_weather").css("background-image", "url(../web/_images/_forecast/" + weather.code + ".png)");

			// RESIZE NEWS TABLE ACCORDING TO THE WEATHER TABLE
			$(".table_news").css("height", $("body").height() - $(".table_weather").outerHeight(true) - parseFloat($(".table_weather").css("margin-top")) - parseFloat($(".table_weather").css("margin-bottom")));
		},
		error: function (error) {
			$(".weather_main").html("<p class='weather_city'><strong>" + error + "</p>");

			// RESIZE NEWS TABLE ACCORDING TO THE WEATHER TABLE
			$(".table_news").css("height", $("body").height() - $(".table_weather").outerHeight(true) - parseFloat($(".table_weather").css("margin-top")) - parseFloat($(".table_weather").css("margin-bottom")));
		}
	});
}

/* --- GET LECTURE DATA AND FILL THE LECTURE TABLE --- */

function requestLecture() {
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
					processLecture(json[i].laiks[0]);
			}
		}
	});
}

function processLecture(data) {

	// CHECKING IF THE THERE"S ANY CONTENT
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

		// CHECKING THE LECTURER"S NAME
		if (data.telpa.kurs.pasn) name = data.telpa.kurs.pasn;
	} else return;

	// ADDING A ROW
	addLecturer(room, time, lecture, name);
}

function addLecturer(room, time, lecture, name) {
	$row = $("<tr>").append(
		("<td>" + lecture + "</td>"), ("<td>" + name + "</td>"),
		("<td><span class='status_outside status_passive'><span class='status_inside'>" + room + "</span></span></td>"),
		("<td><span class='status_outside status_active'><span class='status_inside'>" + time + "</span></span></td>"));

	// UPDATE THE MAIN
	$(".table_main table tbody").append($row);
}

/* --- GET NEWS DATA AND FILL THE WEATHER TABLE --- */

function requestNews() {
	$(".table_news table tbody").empty();

	// UPDATE THE NOTICES
	$(".table_news tbody").load("_outlines/page_data.php");
}
