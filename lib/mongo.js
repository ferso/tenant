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
const join        = require('path').join;

const adapters    = require(fs.realpathSync('config/connections.js',{}));
const connections = adapters[adapters.default];

var credentials   = typeof(connections.user) && connections.user != '' ? connections.user+':'+connections.password+'@' : '';
const uri         = 'mongodb://'+credentials+connections.host+':'+connections.port+'/';


module.exports = {
    _limit : 0,
    _sort  : {},
    _skip  : 0,
    _data  : {},

    
    exec:function(callback){       
      var that = this;
      this.connect(function(db) {
         that[that._method](db,function(e,r){callback(e,r)});              
       });
    },
    connect:function(callback){
   
      var that = this;    
      // Set up the connection to the local db
      var db = new Db(this.database, new Server(connections.host, connections.port ));
      //open connection 
      db.open(function(err, db){
        if(!err){
           // Display output in testing mode
           //--------------------------------------------------       
          //console.log("Connected to database server:", connections.host);
          callback(err||db);
        }else{

        }
      })
    },
    tenant:function(database){
      this.database = database;
      return this;
    },
    skip :function(skip){
      this._skip = skip;
      return this;
    },
    limit : function(limit){
      this._limit = limit;
      return this;
    },
    sort : function(sort){
      this._sort = sort;
      return this;
    },
    find : function(criteria,fields,options){
        this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;
        this._fields    = typeof(fields) == 'undefined' ? [] : fields;
        this._opts      = typeof(options) == 'undefined' ? [] : options;
        this._method    = '_find';
        return this;
    },
    findOne : function(criteria,fields,options){
        this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;
        this._fields    = typeof(fields) == 'undefined' ? [] : fields;
        this._opts      = typeof(options) == 'undefined' ? [] : options;
        this._method    = '_findOne';
        return this;
    },

    findById : function(id,fields,options){
        this._id        = id
        this._fields    = typeof(fields) == 'undefined' ? [] : fields;
        this._opts      = typeof(options) == 'undefined' ? [] : options;
        this._method    = '_findById';
        return this;      
    },
     create : function(data,callback){
        this._data        = data
        this._method    = '_create';
        return this;              
    },
    update : function(criteria,set,options,callback){
        this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;
        this._opts      = typeof(options) == 'undefined' ? [] : options;
        this._set       = typeof(set) == 'undefined' ? [] : set;
        this._method    = '_update';
        return this;          
    },
    remove : function(criteria,callback){
        this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;
        this._method    = '_remove';
        return this;   
    },
    count : function(criteria,fields,options){
        this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;     
        this._method    = '_count';
        return this;
    },
    native : function(callback){
      // local 
      var that = this;
      // set up the connection to the local db
      var db = new Db(this.database, new Server(connections.host, connections.port ));
      // open connection 
      db.open(function(e,db) { 
         // collection 
        var collection = db.collection(that.collection);
        callback(e,db,collection);
      })
    },
   
    /* Internal methods
    * map of methods mongo native db
    *
    --------------------------------------------------------------------------*/
    _find : function(db,callback){
      try{
        collection = db.collection(this.collection);
        collection.find(this._criteria,this._fields,this._opts).skip(this._skip).limit(this._limit).sort(this._sort).toArray(function(e,r) {
              db.close();                  
              callback(e,r);
         });
      }catch(e){
        callback(e,null);
      }
    },
     _findOne : function(db,callback){
        var that   = this;
        try{
        collection = db.collection(this.collection);
        collection.find(this._criteria,this._fields,this._opts).limit(1).toArray(function(e,r){
              db.close(); 
              if(r.length > 0){
                callback(e,that.result(r[0]));
              }else{
                callback(e,that.result({}));
              }
              
         });
      }catch(e){
        callback(e,null);
      }
    },
    _findById : function(db,callback){
        try{
          collection = db.collection(this.collection);
          collection.find({_id:ObjectID(this._id)},this._fields,this._opts).skip(this._skip).limit(this._limit).sort(this._sort).toArray(function(e,r) {
              db.close();                  
              callback(e,r);
           });
        }catch(e){
          db.close();                  
          callback(e,null);
        }
    },
    _create : function(db,callback){
      var that   = this;
      try{
      this._data.createdAt  = new Date();
      this._data.updatedAt  = new Date();
        var collection = db.collection(this.collection);
            collection.insert(this._data,function(e,r) {             
            db.close();              
            callback(e,r.ops);
        });
      }catch(e){
        db.close();                  
        callback(e,null);
      }
    },
    _update : function(db,callback){
        var that = this;
         // this._set['$set'].updatedAt = new Date();

        try{
          if( typeof(this._criteria) == 'string' ){
              this._criteria = {_id:ObjectID(this._criteria)}
          }
          
         var collection = db.collection(this.collection);
             collection.update(this._criteria,this._set,this._opts,function(e,r) {              
                if(!e){
                  that._find(db,callback);
                  // db.close();  
                }else{
                  db.close();              
                  callback(e,r);
                }
          });  
        }catch(e){
          db.close();              
          callback(e,null);
        }    
    },  
    _remove : function(db,callback){
       var collection = db.collection(this.collection);
           collection.remove(this._criteria,function(e, r){        
           // db.close();          
           callback(e,r.result);         
      });    
    },
    _count : function(db,callback){
      var collection = db.collection(this.collection);
          collection.count(this._criteria,function(e,r) {             
          // db.close();              
          callback(e,r);
      });
    },
     _save : function(callback){
       var that = this;
      try{           
          this.connect(function(db){
              if(db){
                that._set = {$set:that._data};
                that._criteria = {_id:ObjectID(that._data._id)};
                var collection = db.collection(that.collection);
                   collection.update(that._criteria,that._set,function(e,r) {                             
                    if(!e){
                      callback(e||that._data);
                       // db.close();              
                    }else{                     
                      callback(e,r);
                    }
                });  
              }
          });
        }catch(e){
          console.log(e);
          callback(e,null)
        }            
    },
    result : function(r){
        that = this;
        Object.defineProperty(r,"save",{
          get: function() {
              that._data = this;
              return function(callback){
                that._save(function(data){
                    callback.call(this,data);
                });
              }
            }
          }); 
        return r;
    }

}
