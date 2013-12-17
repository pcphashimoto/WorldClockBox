$(function() {
	
	function setDate(locale) {
		console.log("setDate");
		var d = new Date();
		if (locale) {
			d = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000)
					+ (locale.offset * 60 * 60 * 1000));
			$(".locale").text(locale.name);
			localStorage.setItem("locale", JSON.stringify(locale));
		} else {
			var str = localStorage.getItem("locale");
			locale = JSON.parse(str);
			if (locale) {
				d = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000)
						+ (locale.offset * 60 * 60 * 1000));
				$(".locale").text(locale.name);
			}
		}
		var h = (d.getHours() + d.getMinutes() / 60) * 30 - 180;
		var m = (d.getMinutes() + d.getSeconds() / 60) * 6 - 180;
		var s = d.getSeconds() * 6 - 180;

		$(".hour > .hand").css({
			webkitTransform : 'rotate(' + h + 'deg)'
		});
		$(".minute > .hand").css({
			webkitTransform : 'rotate(' + m + 'deg)'
		});
		$(".second > .hand").css({
			webkitTransform : 'rotate(' + s + 'deg)'
		});
		setTimeout(function() {
			$(".clock").addClass("move");
		}, 300);

	}
	
	setDate();
	
	$.when(widgetReady()).done(function() {
		window.addEventListener("pdmessage", onPdMessage);
	});

	function onPdMessage(e) {
		console.log("pdmessage: " + e);
		var data = JSON.parse(unescape(e));
		if (data.locale) {
			setDate(data.locale);
		}
	}
});

function widgetReady() {
	var d = new $.Deferred();
	if (typeof window.appwidget != 'undefined') {
		d.resolve();
	} else {
		window.addEventListener("appwidgetready", function() {
			d.resolve();
		}, false);
	}
	return d.promise();
}

setTimeout(function() {
	location.reload();
}, 29000);