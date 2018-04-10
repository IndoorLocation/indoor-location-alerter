'use strict';

var turf = require('@turf/turf');

var config = require('./config');
var mapwize = require('./utils/mapwize');
var spark = require('./utils/spark');

// Checking that we have all parameters
if (!config.mapwizeApiKey || !config.mapwizePlaceId || !config.ciscoSparkToken || !config.userId) {
    console.log('MAPWIZE_API_KEY, MAPWIZE_PLACE_ID, CISCO_SPARK_TOKEN, and USER_ID environment variables are required');
    process.exit(1);
}

// To store data and state
var isInside = null;
var place = null;
var placeFeature = null;

// Configuring socket
var socket = require('socket.io-client')(config.indoorLocationSocketUrl, {
    autoConnect: false,
    query: {
        userId: config.userId
    }
});

socket.on('connect', function () {
    console.log('Connexion opened to ' + config.indoorLocationSocketUrl + '.');
});

socket.on('error', function (data) {
    console.log('error');
    console.log(data);
});

socket.on('indoorLocationChange', function (data) {
    var indoorLocation = data.indoorLocation;
    var indoorLocationPoint = turf.point([indoorLocation.longitude, indoorLocation.latitude]);
    var _isInside = turf.booleanContains(placeFeature, indoorLocationPoint);

    console.log(indoorLocation);
    console.log(_isInside);

    // Detect any status change
    if (isInside === null) {
        if (_isInside) {
            console.log(config.userId + ' is inside \'' + place.name + '\'.');
            spark.sendMessage(config.ciscoSparkToPersonEmail, '_' + config.userId + '_ is inside _' + place.name + '_.', function (err) {
                if (err) {
                    console.log('Cisco Spark ERR:', err);
                }
            });
        }
        else {
            console.log(config.userId + ' is outside \'' + place.name + '\'.');
            spark.sendMessage(config.ciscoSparkToPersonEmail, '_' + config.userId + '_ is outside _' + place.name + '_.', function (err) {
                if (err) {
                    console.log('Cisco Spark ERR:', err);
                }
            });
        }

        isInside = _isInside;

    } else if (isInside !== _isInside) {
        if (_isInside) {
            console.log(config.userId + ' just entered \'' + place.name + '\'.');
            spark.sendMessage(config.ciscoSparkToPersonEmail, '_' + config.userId + '_ just __entered__ _' + place.name + '_.', function (err) {
                if (err) {
                    console.log('Cisco Spark ERR:', err);
                }
            });
        }
        else {
            console.log(config.userId + ' just left \'' + place.name + '\'.');
            spark.sendMessage(config.ciscoSparkToPersonEmail, '_' + config.userId + '_ just __left__ _' + place.name + '_.', function (err) {
                if (err) {
                    console.log('Cisco Spark ERR:', err);
                }
            });
        }

        isInside = _isInside;
    }
});

// Retrieving the place from Mapwize and connecting the socket
mapwize.retrievePlace(config.mapwizePlaceId, function (err, _place) {
    if (err) {
        console.log('Mapwize ERR', err);
    } else {
        place = _place;
        placeFeature = turf.feature(_place.geometry);

        socket.connect();
    }
});