'use strict';

module.exports = {
    indoorLocationSocketUrl: process.env.INDOOR_LOCATION_SOCKET_URL || 'http://localhost:3003',
    userId: process.env.USER_ID,
    mapwizeApiUrl: process.MAPWIZE_API_URL || 'https://api.mapwize.io',
    mapwizeApiKey: process.env.MAPWIZE_API_KEY,
    mapwizePlaceId: process.env.MAPWIZE_PLACE_ID,
    ciscoSparkToken: process.env.CISCO_SPARK_TOKEN,
    ciscoSparkToPersonEmail: process.env.CISCO_SPARK_TO_PERSON_EMAIL
};
