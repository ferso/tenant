const Db            = require('mongodb').Db;
const MongoClient   = require('mongodb').MongoClient;
const ObjectID      = require('mongodb').ObjectID;
const ReplSet       = require('mongodb').ReplSet;
const Server        = require('mongodb').Server;
const fs     	 	= require('fs');
const join   	 	= require('path').join;
const sessconf 		= require( join(fs.realpathSync('config/',{}), '/sessions.js')).session;
const auth 			= sessconf.auth;

module.exports = {

	enable : false,
	// token  : function (token,secret,ip,origin,callback){
	// 	// local instance
	// 	var that = this;    	
	// 	// Set up the connection to the local db
	// 	var db = new Db(auth.adapter.database, new Server(auth.adapter.host, auth.adapter.port ));
	// 	//open connection 
	// 	db.open(function(e,db){
	// 		if(!e){
	// 			 try{					 
	// 			 	var query = {};
	// 			 	if( origin == 'undefined' ){
	// 			 		var query = {'api.private.token':token, 'api.private.secret':secret};
	// 			 	}else{					 	
	// 			 		var query = {'api.public.token':token, 'api.public.secret':secret, 'api.public.origin':origin};
	// 			 	}
	// 			  collection = db.collection(auth.adapter.collection);
	// 			  collection.find(query).limit(1).toArray(function(e,r) {    
	// 				db.close();
	// 			  	if( r.length > 0 ){					    
	// 			      	callback(true,r[0]);
	// 				  }else{
	// 				  	callback(false,{});
	// 				  }
	// 			   });
	// 			}catch(e){
	// 			  db.close();                  
	// 			  callback(e,{});
	// 			}
	// 		}
	// 	});
	// }

}
