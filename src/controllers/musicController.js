const passport = require("passport");
const request = require('request');
musicQueries = require("../db/queries.music");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

module.exports = {
    searchArtist(req, res, next) {
        const query = req.body.query.split(' ').join('+');
        let artists = "";
        
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
                var options = {
                url: 'https://api.spotify.com/v1/search?q=' + query + '&type=artist&market=US',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
                };
                request.get(options, function(error, response, body) {
                    artists = body.artists;
                    res.render("music/artistsearch", {artists});
                });
            }
        });
    },
    viewArtist(req, res, next) {
        let followed;
        let artist = "";
        const query = req.params.id;
        musicQueries.checkFollowed(query, req.user, (err, callback) => {
            if(callback == "not"){
                followed = false;
            } else {
                followed = true;
            }
        })
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
                url: 'https://api.spotify.com/v1/artists/' + query +'/albums?market=US',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
                };
                const options2 = {
                    url: 'https://api.spotify.com/v1/artists/' + query,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                request.get(options2, function(error, response, body) {
                    artist = body;
                    
                    request.get(options, function(error, response, body) {
                        albums = body;
                        res.render("music/artistview", {artist, albums, followed});
                    });
                });
                
            }
        });
    },
    addFollowing(req, res, next) {
        const user = req.user;
        const artistId = req.params.id;
        musicQueries.create(artistId, user, (err, callback) => {
            if(err){
                req.flash("notice", "error following artist");
                res.redirect(`/music/artistview/${req.params.id}`)                
            } else if (callback == "existing"){
                req.flash("notice", "you are no longer following this artist");
                res.redirect(`/music/artistview/${req.params.id}`);
            } else {
                req.flash("notice", "you are now following this artist");
                res.redirect(`/music/artistview/${req.params.id}`);
            }
        })
    }
}
