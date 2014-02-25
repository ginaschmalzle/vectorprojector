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
                var plotdata = [];
                myFilteredData = $(myData).each(function () {
                    console.log(this.geometry.coordinates);
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
                    var magDist = Math.sqrt((p1 * p1) + (p2 * p2));
                    var velMag = Math.sqrt((this.properties.vx * this.properties.vx) + (this.properties.vy * this.properties.vy));
                    if (mapclick.startLatlng.lat <= mapclick.endLatlng.lat && mapclick.startLatlng.lng <= mapclick.endLatlng.lng) {
                        if (dabs <= document.getElementById('projwidth').value && R <= Rmax && this.geometry.coordinates[0] >= mapclick.startLatlng.lng && this.properties.svx <= document.getElementById('sigmax').value && this.properties.svy <= document.getElementById('sigmax').value) {
                            plotdata.push([magDist, velMag]);
                            //window.plotdata = plotdata;
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


                $(function () {

                    //plotdata = [].slice.call(plotdata);
                    //console.log (plotdata);
                    $('#container').highcharts({
                        chart: {
                            type: 'scatter',
                            zoomType: 'xy'
                        },
                        title: {
                            text: 'GPS velocity as a function of Distance along a Profile'
                        },
                        subtitle: {
                            text: 'GPS Magnitude'
                        },
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
                                text: 'Velocity (mm/yr)'
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'top',
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
                            name: 'GPS Velocities',
                            color: 'rgba(223, 83, 83, .7)',
                            data: plotdata
                        }],
                    });
                });
            }
    });
};
