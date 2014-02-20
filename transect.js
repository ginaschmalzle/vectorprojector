var dots = null,
	arrows = null;
$("#submit").on("click", transect);

function transect() {
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

/*


	var myFilteredData = null;

	if (map.hasLayer(dots) && map.hasLayer(arrows)) {
		map.removeLayer(dots);
		map.removeLayer(arrows);
	}

	myFilteredTrans = $(myData).filter(function() {
		return this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value;
	});
	myFilteredData = [].slice.call(myFilteredData);
        // Include data points
	var overlayMaps = function (){
	dots = L.geoJson(myFilteredData, {
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
};
	arrows = L.geoJson(myFilteredData, {
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
                                        weight: 3,
                                });
				}
				else if ((feature.properties.vx <=0 ) && (feature.properties.vy>=0))
				{
				var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2+y,vectorYend2+x],[vectorXend2, vectorYend2],[vectorXend2+y2, vectorYend2+x2]], {
                                        color: 'red',
                                        weight: 3,
                                });
				}
				else 
                                {
                                var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2,
 vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                                        color: 'red',
                                        weight: 3,
                                });
                                }	
				return lines 
        }}).addTo(map);

};
overlayMaps();
}; */
