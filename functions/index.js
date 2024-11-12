// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

require('dotenv').config();

import functions from 'firebase-functions';
import algoliaSearch from 'algoliasearch';

const appId = process.env.ALGOLIA_APP_ID;
const searchAPIKey = process.env.ALGOLIA_SEARCH_API_KEY;

const client = algoliaSearch(appId, searchAPIKey);
const index = client.initIndex('courses');

exports.searchCourse = functions.https.onRequest((req, res) => {
    const query = req.query.query || '';

    index
        .search(query)
        .then(({hits}) => {
            res.json(hits); // Return search results
        })
        .catch((err) => {
            res.status(500).send('Error occurred while searching: ' + err);
        });
});
