'use strict';

var request = require('request');

var config = require('../config');

/**
 * Send a direct message to a Spark user via an email adress
 * @param {*} to 
 * @param {*} markdown 
 * @param {*} callback 
 */
function sendMessage(to, markdown, callback) {
    var sparkRequestOptions = {
        url: 'https://api.ciscospark.com/v1/messages',
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + config.ciscoSparkToken,
        },
        body: {
            toPersonEmail: to,
            markdown: markdown
        },
        json: true
    };

    request(sparkRequestOptions, function (error, response, body) {
        if (error) {
            callback(error);
        }
        else if (response.statusCode !== 200) {
           callback(body);
        }
        else {
            callback(null);
        }
    });
};
exports.sendMessage = sendMessage;
