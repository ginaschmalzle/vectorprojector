var map = L.map('map_canvas').setView([35, -119.], 6);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
     maxZoom: 18
}).addTo(map);
L.tileLayer('http://geohazards.usgs.gov/ArcGIS/rest/services/qfaults2013/MapServer/tile/{z}/{y}/{x}', {
     maxZoom: 18
}).addTo(map);  
