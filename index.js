const colors  	 	= require('colors');
const express 	 	= require('express');
const bodyParser 	= require('body-parser');
const path    	 	= require('path');
const fs     	 	= require('fs');
const cors   		= require('cors')  
const router 		= express.Router()
const extend 	 	= require('util')._extend;
const join   	 	= require('path').join;
const session 		= require('express-session');
const url 			= require('url');
const mo 			= require('method-override');
const eh 			= require('errorhandler');
const multer 		= require('multer');
const _ 			= require("underscore");
const osTmpdir 		= require('os-tmpdir');

"use strict";

process.on('uncaughtException', function (err) {
  console.log(err);
})

//Create APP
const app    	= express();  
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
	  
// Routes 
// ----------------------------------------------
const connections 	= require( join(fs.realpathSync('config/',{}), '/connections.js'));
const model  		= require('./lib/'.concat(connections[connections.default].adapter,'.js')); 
const routes 		= require( join(fs.realpathSync('config/',{}), '/routes.js'));
const local 		= require( join(fs.realpathSync('config/',{}), '/local.js'));
const sessconf 		= require( join(fs.realpathSync('config/',{}), '/sessions.js')).session;
const auth 			= sessconf.auth;
const polices 		= require('./lib/polices.js');


// Configuration
// ----------------------------------------------
const port    		= local.port || 9991;
const socketport	= local.socketport || 9992;

// Create application/json parser
app.use(bodyParser.json({limit: '50mb'}))
//upload limit
var upload_limit = typeof(local.upload_limit) == 'undefined' ? '50mb' : local.upload_limit;

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: true, limit: upload_limit, parameterLimit:50000 }));

//multer for files
app.use(multer({dest:osTmpdir()}).any());


// Allow Cors  	
app.use(cors());

// Enable Trust Proxy
app.enable('trust proxy', 1);


// Auth Middleware
// ----------------------------------------------
app.use(function (req, res, next) {
	
	var ip     = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress.split(':').slice(-1)[0];
	var origin = req.headers.origin;
	var token  = req.headers.token;
	var secret = req.headers.secret;
	if( auth ){	  
		switch( auth.type ){
	  		case 'token':	  			  		
		  		polices.token(token,secret,ip,origin,function(r,data){
		  		  if(r){
		  		  	this.account = data;		  		 
				    next();
				  } else {
				    return res.status(401).json({status:401,msg:'Unauthorized, invalid token or missing'})
				  }
		  		}) 	  		
			break;
			case 'userlogin':
				// TO-DO
		  	break;  
		}
	}else{ 
		next();
	}
});

// Dynamically include routes (Controller)
// ----------------------------------------------
fs.readdirSync(fs.realpathSync('controllers',{})).forEach(function (file) {
    var route = require(fs.realpathSync('controllers',{}) +'/'+ file);      
    for( x in route){
        var action     = route[x];
        var uriname    = x.replace('index','');
        var uriname    = uriname.replace(/[A-Z]/g, function(s){ return "-" + s; }).toLowerCase();     
        var xfile      = file.replace('.js','') ;
        var xfile      = xfile == 'index' && uriname.length == 0 ? xfile.replace('index','') : xfile ;   
        var uri        = join('/',xfile,uriname);
        if( typeof( routes[uri] ) != 'undefined' ){          
          app[routes[uri].method](uri,action);
        }else{
          app.all(uri,action);
        }     
  	}
}); 

// Dynamically require models (models)
// ----------------------------------------------
fs.readdirSync(fs.realpathSync('models',{})).forEach(function(file,i) { 
      var name            = file.replace('.js','') ;
      var modelname       = name.charAt(0).toUpperCase() + name.slice(1);
      //require file
      this[modelname] = require(join(fs.realpathSync('models',{}),'/', file));                    
      //attributes
      this[modelname].collection = name;
      //extendig model 
      this[modelname] = _.extend({}, model, this[modelname]);      
});


app.use(function(req, res, next) {
  var err = new Error();
  //console.log(err);
  res.status(400).json({status:400,msg:'Bad Request'});      
});

global.tenant  		= { config:local, io:io, app:app };

// Run server
// ----------------------------------------------
module.exports.run = function(options){
	
	// Run Socket Server
	http.listen(port, function () {
	 // set port	
	 // var port = typeof options === 'undefined' ? port : options.port;
	  console.log( (' Tenant Socket Services running at port '+port + ' ').bgGreen.black);
	  console.log( ('--------------------------------------------------').gray);
	});
}
