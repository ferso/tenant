
//Twitter ------------------------------------------------
var Twitter = require("node-twitter-api");


module.exports = {
	 index: function (req, res) {

      // var denied = typeof(req.query.denied) == 'undefined' ? false : true;

      // var twitter = new Twitter({
      //     consumerKey: tenant.config.twitter.consumer_key,
      //     consumerSecret: tenant.config.twitter.consumer_secret,
      //     callback: 'http://oldspice.rlpvm.mx:8887/oauth'
      // });

      // if( denied ){     
      //   //redirec to login if not successs
      //   return res.redirect('/');
      // }else{      
      //   // set sessions params;       
      //   tenant.config.twitter.oauth_token    = req.query.oauth_token;
      //   tenant.config.twitter.oauth_verifier = req.query.oauth_verifier;
       
      //   // set sessions params;
      //   sails.config.twitter.access_token = access_token;
      //   sails.config.twitter.access_secret = access_secret;
      //   //get user data
      //   twitter.verifyCredentials(access_token, access_secret, function(err, user) {
      //       if (err){
      //         //redirec to login if not successs 
      //         return res.redirect('/');
      //       }else{
      //         //storing data in session
      //         req.session.user = user;
      //       }
      //   });
     
  	}
};

