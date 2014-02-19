;function(){

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
	//Filter data first
	var myFilteredData = $(myData).filter(function() {

		if( document.getElementById("sigmax").value === null)
		{
		return this.properties.svx <= 10000 && this.properties.svy <= 10000;
		}
		else
		{
		console.log(document.getElementById('sigmax').value);
		return this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value;
		}
	});
	myFilteredData = [].slice.call(myFilteredData);
        // Include data points
           L.geoJson(myFilteredData, {
		pointToLayer: function (feature, latlng) {
			//console.log(feature, latlng);
			return L.circleMarker(latlng, {
					radius: 3,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
		}
        }).addTo(map);
	L.geoJson(myFilteredData, {
                pointToLayer: function (feature, latlng) {
				var vectorXstart = latlng.lat,  
					vectorYstart = latlng.lng,
					size = .1,
					size2 = .09,
					arrowAngle = 30 
					theta = (Math.atan(feature.properties.vy/feature.properties.vx))*(180/3.14159),
					phi = 90 - arrowAngle - theta;
					phi2 = 90 + arrowAngle - theta;
				var vectorXend2 = vectorXstart + feature.properties.vy * size;
                                var vectorYend2 = vectorYstart + feature.properties.vx * size;
				var vectorXend1 = vectorXstart + feature.properties.vy * size2;
                                var vectorYend1 = vectorYstart + feature.properties.vx * size2;
				var test1 = (vectorXend2-vectorXend1)*(vectorXend2-vectorXend1);
				var test2 = (vectorXend2-vectorXend1)*(vectorYend2-vectorYend1);
				var R = Math.sqrt(((vectorXend2-vectorXend1)*(vectorXend2-vectorXend1)) + ((vectorYend2-vectorYend1)*(vectorYend2-vectorYend1)));
				var RR = R/(Math.cos(arrowAngle *(3.14159/180)));
				var RR2 = R/(Math.cos(-arrowAngle *(3.14159/180)));
				var x = RR * (Math.sin(phi*(3.14159/180)));
				var y = RR * (Math.cos(phi*(3.14159/180)));
				var x2 = RR2 * (Math.sin(phi2*(3.14159/180)));
				var y2 = RR2 * (Math.cos(phi2*(3.14159/180)));
				if ((feature.properties.vx >=0 ) && (feature.properties.vy>=0))
				{
				var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2, vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                                        color: 'red',
                                        weight: 4,
                                });
				}
				else if ((feature.properties.vx <=0 ) && (feature.properties.vy>=0))
				{
				var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2+y,vectorYend2+x],[vectorXend2, vectorYend2],[vectorXend2+y2, vectorYend2+x2]], {
                                        color: 'red',
                                        weight: 4,
                                });
				}
				else 
                                {
                                var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2,
 vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                                        color: 'red',
                                        weight: 4,
                                });
                                }	
				return lines 
        }}).addTo(map);

 	 var mapclick = { 
		startLatlng: null,
		endLatlng: null,
		currentLine: null	
	 };       
 
	map.on('click', function(e) {
		if (mapclick.currentLine) {
			map.removeLayer(mapclick.currentLine);
			map.removeLayer(mapclick.startLatlng1);
			map.removeLayer(mapclick.startLatlng2);
			mapclick.startLatlng = null;
			mapclick.endLatlng = null;
			mapclick.currentLine = null;
			mapclick.startLatlng1 = null;
			mapclick.startLatlng2 = null;
		}
		if (mapclick.startLatlng === null) {
			mapclick.startLatlng= e.latlng;
		        mapclick.startLatlng1=L.circleMarker(e.latlng, {
                         radius: 3,
                         fillColor: "black",
                         color: "#000",
                         weight: 1,
                         opacity: 1,
                         fillOpacity: 0.8
                        }).addTo(map);
		}
		else if (mapclick.startLatlng && mapclick.endLatlng === null) {
			mapclick.endLatlng = e.latlng;
			mapclick.startLatlng2=L.circleMarker(e.latlng, {
                         radius: 3,
                         fillColor: "black",
                         color: "#000",
                         weight: 1,
                         opacity: 1,
                         fillOpacity: 0.8
                        }).addTo(map);
			mapclick.currentLine = L.polyline([[mapclick.startLatlng.lat, mapclick.startLatlng.lng],[mapclick.endLatlng.lat, mapclick.endLatlng.lng]], {
				color: 'green',
				weight: 5
			}).addTo(map);		
		}

	});
};
