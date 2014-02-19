;var a = 10;
var mapme = function(){

//	$('#myform').submit(function() {
 // 	var sig = $('#sigmax');
 // 	sig.val = ("updated " + sig.val());
//	console.log (sig);
//	});


          var map = L.map('map_canvas').setView([44, -122], 5);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                maxZoom: 18
          }).addTo(map);
};

