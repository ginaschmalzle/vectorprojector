var plotme = $(function () {
                                console.log (myFilteredData.magDist,myFilteredData.velMag);
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
                color: 'rgba(223, 83, 83, .5)',
                data: [[magDist,velMag]]
            }],
        });
    });

