'use strict';

var async = require('async');
var turf = require('@turf/turf');

var config = require('./config');
var mapwize = require('./utils/mapwize');
var spark = require('./utils/spark');

var socket = require('socket.io-client')(config.indoorLocationSocketUrl, {
    autoConnect: false,
    query: {
        userId: config.userId
    }
});

socket.on('connect', function () {
    console.log('Connexion opened to ' + config.indoorLocationSocketUrl + '.');
});
socket.connect();


if (!config.mapwizeApiKey || !config.mapwizePlaceId || !config.ciscoSparkToken || !config.userId) {
    console.log('MAPWIZE_API_KEY, MAPWIZE_PLACE_ID, CISCO_SPARK_TOKEN, and USER_ID environment variables are required');
    process.exit(1);
}

var isInside = null;
var place = null;
var placeFeature = null;

async.series([
    /**
     * Retrieve the room from Mapwize.
     */
    function (next) {
        mapwize.retrievePlace(config.mapwizePlaceId, function (err, _place) {
            place = _place;
            placeFeature = turf.feature(_place.geometry);
            next(err);
        });
    },
    /**
     * When a new IndoorLocation comes, detect if the user is entering or leaving the room.
     */
    function (next) {
        socket.on('indoorLocationChange', function (data) {
            var indoorLocation = data.indoorLocation;
            var indoorLocationPoint = turf.point([indoorLocation.longitude, indoorLocation.latitude]);
            var _isInside = turf.booleanContains(placeFeature, indoorLocationPoint);

            // Detect any status change
            if (isInside === null || isInside !== _isInside) {
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
    }
], function (err) {
    if (err) {
        console.log('Mapwize ERR', err);
    }
});