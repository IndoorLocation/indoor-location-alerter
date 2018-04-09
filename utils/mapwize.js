'use strict';

var request = require('request');

var config = require('../config');

/**
 * Retrieve a given place from Mapwize
 * @param placeId 
 * @param callback 
 */
function retrievePlace(placeId, callback) {
    var placeRequestOptions = {
        url: config.mapwizeApiUrl + '/v1/places/' + placeId,
        method: 'GET',
        qs: {
            api_key: config.mapwizeApiKey
        },
        json: true
    };

    request(placeRequestOptions, function (error, response, body) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, body);
        }
    });
};
exports.retrievePlace = retrievePlace;
