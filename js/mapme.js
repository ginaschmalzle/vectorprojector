$( document ).ready(function () {
    
// var url = '/vectorprojector/data/pbo_velocity_snarf.json';

// $.getJSON(url, function (myData) {
//         mapme(myData);
//         transect(myData);
// });

/* Event handlers */
var rmdata = {
	mydots: [],
	myarrow: []
};

var mapclick = {
    startLatlng: null,
    endLatlng: null,
    currentLine: null,
    allArray: []
};

var myData = 'bananas';

$("#submit").on("click", newdata);

map.on('click', function(e){
    transect(e, myData);
});



function newdata() { 

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
    
    $(mapclick.allArray).each(function () {
        map.removeLayer(this);
    });

	$(rmdata.mydots).each(function() {
		map.removeLayer(this);
	});

	$(rmdata.myarrow).each(function() {
		map.removeLayer(this);
	});
     
	var value = document.getElementById('json_select').value;
	
    if (value === "PANGA") {
        url = '/vectorprojector/data/panga_snarf_comb_hvel.json';
	}
    else if (value === "NGS") {
        url = '/vectorprojector/data/ngs_velocity.json';
    }
    else if (value === "Landers") {
        url = '/vectorprojector/data/landers_agnew_2002.json';
    }
    else {	
        url = '/vectorprojector/data/pbo_velocity_snarf.json';
    }
	
	$.getJSON(url, function (data) {
		mapme(data);
        myData = data;
	//console.log(myData.length);
	});

}

function mapme(myData){
//Load in Selected JSON file
	var myFilteredData = $(myData).filter(function() {
		return this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value;
	});
	
    myFilteredData = [].slice.call(myFilteredData);
	//console.log(myFilteredData.length);
        // Include data points
//	if (rmdata.mydots !== null)
//	{
//	map.removeLayer(rmdata.mydots);
//	map.removeLayer(rmdata.myarrow);
//	}

	dots = L.geoJson(myFilteredData, {
		pointToLayer: function (feature, latlng) {
			var makeDots = L.circleMarker(latlng, {
					radius: 3,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				})
				rmdata.mydots.push(makeDots);
				makeDots.addTo(map);
				return makeDots;
		}
	});
	
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
			var makeArrow = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2, vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                                    color: 'red',
                                    weight: 2,
                            });
			}
			else if ((feature.properties.vx <=0 ) && (feature.properties.vy>=0))
			{
			var makeArrow  = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2+y,vectorYend2+x],[vectorXend2, vectorYend2],[vectorXend2+y2, vectorYend2+x2]], {
                                    color: 'red',
                                    weight: 2,
                            });
			}
                        else if ((feature.properties.vx <=0 ) && (feature.properties.vy<=0))
                        {
                        var makeArrow  = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2+y,vectorYend2+x],[vectorXend2, vectorYend2],[vectorXend2+y2, vectorYend2+x2]], {
                                    color: 'red',
                                    weight: 2,
                            });
                        }
			else {
                	var makeArrow = L.polyline([[vectorXstart, vectorYstart],[vectorXend2, vectorYend2],[vectorXend2-y,vectorYend2-x],[vectorXend2,
    vectorYend2],[vectorXend2-y2, vectorYend2-x2]], {
                        color: 'red',
                        weight: 2,
                });
            }	
            rmdata.myarrow.push(makeArrow);
            makeArrow.addTo(map);
			return makeArrow; 
        }
    });
}

function transect(e, myData) {

    if (mapclick.currentLine) {
        map.removeLayer(mapclick.currentLine);
        map.removeLayer(mapclick.startLatlng1);
        map.removeLayer(mapclick.startLatlng2);
        mapclick.startLatlng = null;
        mapclick.endLatlng = null;
        mapclick.currentLine = null;
        mapclick.startLatlng1 = null;
        mapclick.startLatlng2 = null;
        $(mapclick.allArray).each(function () {
            map.removeLayer(this);
        });
    }
    if (mapclick.startLatlng === null) {
        mapclick.startLatlng = e.latlng;
        mapclick.startLatlng1 = L.circleMarker(e.latlng, {
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
        mapclick.startLatlng2 = L.circleMarker(e.latlng, {
            radius: 3,
            fillColor: "black",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        mapclick.currentLine = L.polyline([
            [mapclick.startLatlng.lat, mapclick.startLatlng.lng],
            [mapclick.endLatlng.lat, mapclick.endLatlng.lng]
        ], {
            color: 'green',
            weight: 5
        }).addTo(map);

        
/// define some arrays for graphing
    var plotdata = [];
    var plotuncerts = [];
    var plotpardata = [];
    var plotparuncerts = [];
    var plotperpdata = [];
    var plotperpuncerts = [];
/// Figure out which sites to use, and what their velocities are

    var mydataplot, myuncertsplot, myparplot, myparuncertsplot, myperpplot, myperpuncertsplot;
        
    var myFilteredData = $(myData).each(function () {
        var x = (mapclick.startLatlng.lng - mapclick.endLatlng.lng) * 111;
        var y = (mapclick.startLatlng.lat - mapclick.endLatlng.lat) * 111;
        var rx = (mapclick.startLatlng.lng - this.geometry.coordinates[0]) * 111;
        var ry = (mapclick.startLatlng.lat - this.geometry.coordinates[1]) * 111;

        if (mapclick.startLatlng.lat <= mapclick.endLatlng.lat) {
            var R = Math.sqrt((rx * rx) + (ry * ry));
            var Rmax = Math.sqrt((x * x) + (y * y));
        }
        else {
            var R = -(Math.sqrt((rx * rx) + (ry * ry)));
            var Rmax = -(Math.sqrt((x * x) + (y * y)));
        }
        var theta = Math.atan(y / x) * (180 / 3.14159);
        var phi = Math.atan(ry / rx) * (180 / 3.14159);
        var fork = phi - theta;
        var zeta = Math.atan(this.properties.vy / this.properties.vx) * (180/3.14159);
        var epsilon = theta - zeta;
        var d = (R * Math.sin(fork * (3.14159 / 180)));
        var dabs = Math.abs(d);
        var gamma = 90 - theta;
        var h = d / Math.sin(gamma * (3.14159 / 180));
        var i = d / Math.cos(gamma * (3.14159 / 180));
        var j = i * Math.sin(theta * (3.14159 / 180));
        var k = i * Math.cos(theta * (3.14159 / 180));
        
        var p1 = rx + k;
        var p2 = ry - h + j;

/// Calculate the distance of the GPS point on the profile
        var magDist = Math.sqrt((p1 * p1) + (p2 * p2));
        /// Calculate the velocities
        /// Magnitude
        var velMag = Math.sqrt((this.properties.vx * this.properties.vx) + (this.properties.vy * this.properties.vy));
	if (this.properties.vx > 0 ) {
	console.log(zeta, theta);
          var velPerp = velMag * Math.sin(epsilon * (3.14159 / 180)); 
          var velPar = velMag * Math.cos(epsilon * (3.14159 / 180)); 
	}
	else {
          var velPerp = velMag * Math.sin(epsilon * (3.14159 / 180));
          var velPar = -velMag * Math.cos(epsilon * (3.14159 / 180)); 
        }
	
        var Runcert =  Math.sqrt((this.properties.svx * this.properties.svx) + (this.properties.svy * this.properties.svy));
        var SigPar = Math.sqrt ((Runcert * Runcert) * ((Math.cos(epsilon * (3.14159 / 180))*(Math.cos(epsilon * (3.14159 / 180))))));  	
        var SigPerp = Math.sqrt ((Runcert * Runcert) * ((Math.sin(epsilon * (3.14159 / 180))*(Math.sin(epsilon * (3.14159 / 180))))));  	
       // var SigPar = 
        var velMagHigh = velMag + Runcert;
        var velMagLow = velMag - Runcert;
        var velParHigh = velPar + SigPar;
        var velParLow = velPar - SigPar;
        var velPerpHigh = velPerp + SigPerp;
        var velPerpLow = velPerp - SigPerp;

        if (mapclick.startLatlng.lat <= mapclick.endLatlng.lat && mapclick.startLatlng.lng <= mapclick.endLatlng.lng) {
            if (dabs <= document.getElementById('projwidth').value && R <= Rmax && this.geometry.coordinates[0] >= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                plotdata.push([magDist, velMag, velMagLow, velMagHigh, this.properties.name]);
                plotuncerts.push({x:magDist,low:velMagLow, high:velMagHigh});
                plotpardata.push([magDist, velPar]);
                plotparuncerts.push({x:magDist,low:velParLow, high:velParHigh});
                plotperpdata.push([magDist, velPerp]);
                plotperpuncerts.push({x:magDist,low:velPerpLow, high:velPerpHigh});
                //window.plotdata = plotdata
                var tranDots = L.circleMarker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {
                    radius: 3,
                    fillColor: "black",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                mapclick.allArray.push(tranDots);
                tranDots.addTo(map);

            }
        }
        else if (mapclick.startLatlng.lat >= mapclick.endLatlng.lat && mapclick.startLatlng.lng <= mapclick.endLatlng.lng) {
            if (dabs <= document.getElementById('projwidth').value && R >= Rmax && this.geometry.coordinates[0] >= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                plotdata.push([magDist, velMag]);
                plotuncerts.push([magDist, velMagLow, velMagHigh]);
                plotuncerts.push({x:magDist,low:velMagLow, high:velMagHigh});
                plotpardata.push([magDist, velPar]);
                plotparuncerts.push({x:magDist,low:velParLow, high:velParHigh});
                plotperpdata.push([magDist, velPerp]);
                plotperpuncerts.push({x:magDist,low:velPerpLow, high:velPerpHigh});
                var tranDots = L.circleMarker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {
                    radius: 3,
                    fillColor: "black",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                mapclick.allArray.push(tranDots);
                tranDots.addTo(map);
            }
        }
        else if (mapclick.startLatlng.lat >= mapclick.endLatlng.lat && mapclick.startLatlng.lng >= mapclick.endLatlng.lng) {
            if (dabs <= document.getElementById('projwidth').value && R >= Rmax && this.geometry.coordinates[0] <= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                plotdata.push([magDist, velMag, this.properties.name]);
                plotuncerts.push([magDist,velMagLow, velMagHigh]);
                plotuncerts.push({x:magDist,low:velMagLow, high:velMagHigh});
                plotpardata.push([magDist, velPar]);
                plotparuncerts.push({x:magDist,low:velParLow, high:velParHigh});
                plotperpdata.push([magDist, velPerp]);
                plotperpuncerts.push({x:magDist,low:velPerpLow, high:velPerpHigh});
                var tranDots = L.circleMarker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {
                    radius: 3,
                    fillColor: "black",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                mapclick.allArray.push(tranDots);
                tranDots.addTo(map);
            }
        }
        else {
            if (dabs <= document.getElementById('projwidth').value && R <= Rmax && this.geometry.coordinates[0] <= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                plotdata.push([magDist, velMag, this.properties.name]);
        	    plotuncerts.push([magDist,velMagLow, velMagHigh]);
        	    plotuncerts.push({x:magDist,low:velMagLow, high:velMagHigh});
                plotpardata.push([magDist, velPar]);
                plotparuncerts.push({x:magDist,low:velParLow, high:velParHigh});
                plotperpdata.push([magDist, velPerp]);
                plotperpuncerts.push({x:magDist,low:velPerpLow, high:velPerpHigh});
                var tranDots = L.circleMarker([this.geometry.coordinates[1], this.geometry.coordinates[0]], {
                    radius: 3,
                    fillColor: "black",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                })
                mapclick.allArray.push(tranDots);
                tranDots.addTo(map);
            }
        
        }


    });
    
    mydataplot= plotdata.sort(function(a,b) {return b-a});
    myuncertsplot =plotuncerts.sort(function(a,b) {return b-a});
    myparplot= plotpardata.sort(function(a,b) {return b-a});
    myparuncertsplot =plotparuncerts.sort(function(a,b) {return b-a});
    myperpplot= plotperpdata.sort(function(a,b) {return b-a});
    myperpuncertsplot =plotperpuncerts.sort(function(a,b) {return b-a});

    //plotdata = [].slice.call(plotdata);

    highCharts(mydataplot, myuncertsplot, myparplot, myparuncertsplot, myperpplot, myperpuncertsplot)

    } //end if

} //transect

function highCharts(mydataplot, myuncertsplot, myparplot, myparuncertsplot, myperpplot, myperpuncertsplot){
    $('#container').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            //text: 'GPS velocity as a function of Distance along a Profile'
            text: ''
        },
       // subtitle: {
       //     text: 'GPS Magnitude'
       // },
        xAxis: {
            title: {
                enabled: false,
                text: 'Distance (km)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'V Magnitude (mm/yr)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} km, {point.y} mm/yr'
                }
            }
        },
        series: [{
            name: 'Magnitude',
            type: 'scatter',
            color: 'rgba(223, 83, 83, .7)',
            data: mydataplot
        } , 
	/*{ 
        name: 'GPS error',
        type: 'errorbar',
        data: myuncertsplot
       } */

	],
    });


    $('#container2').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
     //   subtitle: {
     //       text: 'GPS Magnitude'
     //   },
        xAxis: {
            title: {
                enabled: false,
                text: 'Distance (km)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Profile Parallel V(mm/yr)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} km, {point.y} mm/yr'
                }
            }
        },
        series: [{
            name: 'Parallel V',
            type: 'scatter',
            color: 'rgba(223, 83, 83, .7)',
            data: myparplot
        } , 
	/*{
            name: 'GPS error',
            type: 'errorbar',
            data: myparuncertsplot
        }*/

        ],
    });

    $('#container3').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: ''
        },
       // subtitle: {
       //     text: 'GPS Magnitude'
       // },
        xAxis: {
            title: {
                enabled: true,
                text: 'Distance (km)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Profile Perpendicular V(mm/yr)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} km, {point.y} mm/yr'
                }
            }
        },
        series: [{
            name: 'Perpendicular V',
            type: 'scatter',
            color: 'rgba(223, 83, 83, .7)',
            data: myperpplot
        } , 
	//{
        //    name: 'GPS error',
        //    type: 'errorbar',
        //    data: myperpuncertsplot
        //}

        ],
    });
}

});
