# indoor-location-alerter

Node.js application to send Spark messages if a device enters or leaves a designated area.

## Installation

Node.js is required.

*   Clone the repository
*   Go the main folder, install the modules with `npm install`

## Configuration

Via environment variable:
*   `INDOOR_LOCATION_SOCKET_URL`: Socket server URL (_default: http://localhost:3003_)
*   `USER_ID`: User identifier (IP or MAC address) (__required__)
*   `MAPWIZE_API_URL`: Mapwize API URL (_default: https://api.mapwize.io_)
*   `MAPWIZE_API_KEY`: Mapwize API KEY (__required__)
*   `MAPWIZE_PLACE_ID`: Mapwize Place ID that represents the area (__required__)
*   `CISCO_SPARK_TOKEN`: CISCO Spark user token (__required__)
*   `CISCO_SPARK_TO_PERSON_EMAIL`: To address email to send private messages (__required__)

Or directly edit the values in `config/env/all.js`.

## Use

Run the `npm start` command.