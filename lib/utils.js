/**
* Models.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* 
* Example 
* db.find('skolarapp','users',{ },function(e,d){
*   console.log(d);
* });
*

    #find by id
    Users.tenant('skolarapp').findById('56945402086e30355508472a').exec(function(e,d){
     console.log(d);     
    });  
    
    #create
    Users.tenant('skolarapp').create({name:'Saraí León López',email:'sleon90@gmail.com'}).exec(function(e,d){
       console.log(d);     
     });

    #update 
    Users.tenant('skolarapp').update('56959eb9dcb1e89660795175',{$set:{name:'Saraí León 2'}}).exec(function(e,d){
     console.log(d);     
    });  

    #remove
    Users.tenant('skolarapp').remove({name:'Saraí León 2'}).exec(function(e,d){
     console.log(d);     
    });  
    
    #count
    Users.tenant('skolarapp').count().exec(function(e,d){
     console.log(d);     
    });  

    #other stuff no supported in tenant 
    Users.tenant('skolarapp').native(function(e,db,collection){      
          // Group with a conditional
            collection.group([], {}, {"count":0}, "function (obj, prev) { prev.count++; }", false, function(err, results) { 
             console.log(results);
            })
    });  
*/

var Db            = require('mongodb').Db;
var MongoClient   = require('mongodb').MongoClient;
var ObjectID      = require('mongodb').ObjectID;
var ReplSet       = require('mongodb').ReplSet;
var Server        = require('mongodb').Server;
const assert      = require('assert');
const path        = require('path');
const fs          = require('fs');
// const join        = require('path').join;


module.exports = {

     titleToSlug : function (slug) {
      var words  = slug.split('-');
      for(var i  = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }
      return words.join(' ');
    }
}

     

