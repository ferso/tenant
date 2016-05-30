
//Twitter ------------------------------------------------
var Twitter = require("node-twitter-api");


module.exports = {
 index: function (req, res) {

      res.send('ok');
      // var ts = new Twitter.StreamClient(
      //     tenant.config.twitter.consumer_key,
      //     tenant.config.twitter.consumer_secret,
      //     tenant.config.twitter.access_token,
      //     tenant.config.twitter.access_secret
      // );
            
      // ts.on('close', function() {
      //     console.log('Connection closed.');
      // });
      // ts.on('end', function() {
      //     console.log('End of Line.');
      // });
      // ts.on('error', function(error) {
      //     console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
      // });
      // ts.on('tweet', function(data) { 
      //  var r         = {};
      //  r.tid         = data.id;
      //  r.text        = data.text;
      //  r.user        = data.user.screen_name;
      //  r.name        = data.user.name;
      //  r.location    = data.user.location;
      //  r.description = data.user.description;
      //  r.followers   = data.user.followers_count;
      //  r.friends     = data.user.friends_count;
      //  r.lists       = data.user.listed_count;
      //  r.created     = data.created_at;
      //  r.avatar      = data.user.profile_image_url;

        
      //    setTimeout(function(){

      //      Tweets.tenant('oldspice').create(r).exec(d.bind(function(e,r){
      //          console.log(e||r)
      //          console.log('---------------------------------------------------'.gray);      
      //    }));    

      //    },timeout);

      // });
       
      //ts.start(['#DemDebate']);

  	},
};

