const request = require('request');
const notifyQueries = require("../db/queries.notify");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

module.exports = {
    checkNew(){
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                const token = body.access_token;
                const options = {
                url: 'https://api.spotify.com/v1/browse/new-releases?country=US&limit=50',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
                };
    
                request.get(options, function(error, response, body) {
                    const newReleases = body.albums.items;
                    notifyQueries.notify(newReleases, (err, callback) => {
                        if(!err || callback == "complete"){
                            console.log("Ran at " + new Date());
                        }
                    })
                });           
            }
        });
    }
}