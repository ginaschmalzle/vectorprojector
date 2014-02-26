//var dots = null,
//	arrows = null;
$("#submit").on("click", transect);
///  Put array for transect
// Array method called push  -- > push item into array 

function transect() {
    var mapclick = {
        startLatlng: null,
        endLatlng: null,
        currentLine: null,
        allArray: []
    };


    map.on('click', function (e) {
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

                var myFilteredData = null;
		/// define some arrays for graphing
                var plotdata = [];
                var plotuncerts = [];
                var plotpardata = [];
                var plotparuncerts = [];
                var plotperpdata = [];
                var plotperpuncerts = [];
		/// Figure out which sites to use, and what their velocities are

                myFilteredData = $(myData).each(function () {
                    //console.log(this.geometry.coordinates);
                    var x = (mapclick.startLatlng.lng - mapclick.endLatlng.lng) * 111;
                    var y = (mapclick.startLatlng.lat - mapclick.endLatlng.lat) * 111;
                    var rx = (mapclick.startLatlng.lng - this.geometry.coordinates[0]) * 111;
                    var ry = (mapclick.startLatlng.lat - this.geometry.coordinates[1]) * 111;
                    //		console.log(rx, mapclick.startLatlng.lng, this.geometry.coordinates[0]);

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
		    var velPerp = velMag * Math.cos(fork * (3.14159 / 180)); 
		    var velPar = velMag * Math.sin(fork * (3.14159 / 180)); 
		    var Runcert =  Math.sqrt((this.properties.svx * this.properties.svx) + (this.properties.svy * this.properties.svy));
		    var SigPerp = Runcert * (Math.cos(fork * (3.14159 / 180)));  	
		    var SigPar = Runcert * (Math. sin(fork * (3.14159 / 180)));  	
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
                            //console.log(d, theta, phi, fork);
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
                    else if (mapclick.startLatlng.lat >= mapclick.endLatlng.lat && mapclick.startLatlng.lng <= mapclick.endLatlng.lng) {
                        if (dabs <= document.getElementById('projwidth').value && R >= Rmax && this.geometry.coordinates[0] >= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                            //console.log(d, theta, phi, fork);
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
                            })
                            mapclick.allArray.push(tranDots);
                            tranDots.addTo(map);
                        }
                    }
                    else if (mapclick.startLatlng.lat >= mapclick.endLatlng.lat && mapclick.startLatlng.lng >= mapclick.endLatlng.lng) {
                        if (dabs <= document.getElementById('projwidth').value && R >= Rmax && this.geometry.coordinates[0] <= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                            //console.log(d, theta, phi, fork);
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
                    else {
                        if (dabs <= document.getElementById('projwidth').value && R <= Rmax && this.geometry.coordinates[0] <= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                            //console.log(d, theta, phi, fork);
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

		var mydataplot= plotdata.sort(function(a,b) {return b-a});
		var myuncertsplot =plotuncerts.sort(function(a,b) {return b-a});
		var myparplot= plotpardata.sort(function(a,b) {return b-a});
		var myparuncertsplot =plotparuncerts.sort(function(a,b) {return b-a});
		var myperpplot= plotperpdata.sort(function(a,b) {return b-a});
		var myperpuncertsplot =plotperpuncerts.sort(function(a,b) {return b-a});
                $(function () {

                    //plotdata = [].slice.call(plotdata);
                    //console.log (plotuncerts);
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
                        } , { 
			    name: 'GPS error',
			    type: 'errorbar',
			    data: myuncertsplot
			}	 

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
                        } , {
                            name: 'GPS error',
                            type: 'errorbar',
                            data: myparuncertsplot
                        }

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
                        } , {
                            name: 'GPS error',
                            type: 'errorbar',
                            data: myperpuncertsplot
                        }

                        ],
                    });





                });
            }
    });
};
