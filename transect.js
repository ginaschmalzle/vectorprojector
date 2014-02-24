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

        		var myFilteredData = null;
        		myFilteredData = $(myData).filter(function() {
				var x = (mapclick.startLatlng.lng - mapclick.endLatlng.lng)*111;
				var y = (mapclick.startLatlng.lat - mapclick.endLatlng.lat)*111;
				var rx = (mapclick.startLatlng.lng - this.geometry.coordinates[0])*111;
				var ry = (mapclick.startLatlng.lat - this.geometry.coordinates[1])*111;
			//		console.log(rx, mapclick.startLatlng.lng, this.geometry.coordinates[0]);
				var R = Math.sqrt((rx*rx) + (ry*ry));
				var Rmax = Math.sqrt((x*x) + (y*y));
				var theta = Math.atan (y/x) * (180/3.14159);
				var phi = Math.atan (ry/rx) * (180/3.14159);
				var fork = phi - theta; 
				var d = (R * Math.sin (fork*(3.14159/180)));
				var dabs = Math.abs(d);
				
				        if (map.hasLayer(tranDots)) {
         				       map.removeLayer(tranDots);
       					 }
				
				if (dabs <= document.getElementById('projwidth').value  && R <= Rmax) 
				{
				console.log(d, theta, phi, fork);
                        		var tranDots = L.circleMarker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {
                                        	radius: 3,
                                        	fillColor: "black",
                                        	color: "#000",
                                        	weight: 1,
                                        	opacity: 1,
                                        	fillOpacity: 0.8
                                	}).addTo(map);
					tranDots;
                		}
	
               // 		return tranDots && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value && dabs <= document.getElementById('projwidth').value;
				});
				};
			});
				
		};




