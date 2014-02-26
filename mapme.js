var dots = null,
	arrows = null;
$("#submit").on("click", mapme);

console.log (document.getElementById("json_select").value);


//Load in Selected JSON file
if (document.getElementById('json_select').value === "panga_snarf_comb_hvel.js")
{
  $.getScript("panga_snarf_comb_hvel.js", function(){
//	alert("PANGA data uploaded");
  });
}
else
{
  $.getScript("pbo_velocity_snarf.js", function(){
//	alert("PBO data uploaded");
  });
} 

function mapme(){
	var myFilteredData = null;

	if (map.hasLayer(dots) && map.hasLayer(arrows)) {
		map.removeLayer(dots);
		map.removeLayer(arrows);
	}

	myFilteredData = $(myData).filter(function() {

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
	arrows = L.geoJson(myFilteredData, {
                pointToLayer: function (feature, latlng) {
				var vectorXstart = latlng.lat,  
					vectorYstart = latlng.lng,
					size = .02,
					size2 = .015,
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
                                        weight: 2,
                                });
				}
				else if ((feature.properties.vx <=0 ) && (feature.properties.vy>=0))
				{
				var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2+y,vectorYend2+x],[vectorXend2, vectorYend2],[vectorXend2+y2, vectorYend2+x2]], {
                                        color: 'red',
                                        weight: 2,
                                });
				}
				else 
                                {
                                var lines = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2,
 vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                                        color: 'red',
                                        weight: 2,
                                });
                                }	
				return lines 
        }}).addTo(map);


};
overlayMaps();
};
