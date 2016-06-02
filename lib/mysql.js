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

const mysql       = require('mysql');
const squel       = require('squel');
const sanitizer   = require('sanitizer');
const assert      = require('assert');
const path        = require('path');
const fs          = require('fs');
const join        = require('path').join;
const colors      = require('colors');
const _ 		  = require("underscore");
const connections = require(fs.realpathSync('config/connections.js',{}));

module.exports = {
	_limit : 0,
	_sort  : null,
	_skip  : 0,
	_data  : {},
	_sql   : null,
	_criteria : null,

	exec:function(callback){       
		var that = this;
		this.connect(function(db) {
			 that[that._method](db,function(e,r){callback(e,r)});              
		 });
	},
	connect:function(callback){  
		var that = this;         
		var connection = mysql.createConnection({
				host     : connections.default.host,
				user     : connections.default.user,
				password : connections.default.password,
				database: this.database
		});
		connection.connect(function(err) {
			if(!err){
				// Display output in testing mode     
				// console.log("Connected to database server:", connections.default.host);
				callback(err||connection);
			}else{
				console.log("Can't reach the database server ".red)
				console.log(err);
			}
		});
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
	findByUuid : function(uuid,fields,options){
			this._uuid      = uuid
			this._fields    = typeof(fields) == 'undefined' ? [] : fields;
			this._opts      = typeof(options) == 'undefined' ? [] : options;
			this._method    = '_findByUuid';
			return this;      
	},
	 create : function(data,callback){
			this._data        = data
			this._method    = '_create';
			return this;              
	},
	update : function(criteria,set,callback){
			this._criteria  = typeof(criteria) == 'undefined' ? [] : criteria;
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
	select : function(fields){

		 return this;
	},
	where : function(){
		return this;
	},    
	group : function(){
		return this;
	},
	native : function(callback){
		// local 
		var that = this;
		// set up the connection to the local db
		var db = new Db(this.database, new Server(connections.default.host, connections.default.port ));
		// open connection
		db.open(function(e,db) { 
			 // collection 
			var collection = db.collection(that.collection);
			callback(e,db,collection);
		})
	},
	sanitize : function( param, v,stringly){
		// console.log( param, this.attributes[param] );
		var stringly = typeof(stringly) == 'undefined' ? false : stringly;
		switch( typeof(v) ){
				case 'string':
					var value = sanitizer.sanitize( v );     
					if( stringly ){
						var value = "'" + value + "'";
					}
				break;
				case 'number':
					var value = parseFloat(v);
				break;
				case 'object':              
					if( typeof(v.getMonth) ){
						var value = v.toISOString().slice(0, 19).replace('T', ' ');
					}
				break;
				case 'datetime':  
					if( typeof(v.getMonth) ){
						var value = v.toISOString().slice(0, 19).replace('T', ' ');
					}
				break;
				default:              
				break;
		}
		return value;
	},
	getCriteria : function(so){
		var that = this;
		if( typeof(this._criteria) == 'object' ){
				for( w in this._criteria ){
				 if( typeof(this._criteria[w]) == 'object'){
					//----------------------------------------------
					switch( Object.keys(this._criteria[w])[0]  ){
						case 'like':
								var value = this.sanitize(w,this._criteria[w].like,true);
								so.where( w +" like " + value );
						break;
						case 'or':
							 se = squel.expr();                                            
							for( var o in this._criteria[w].or ){
									var value = this.sanitize( w, this._criteria[w].or[o] );
									if( o === 0 ){
										se.and(w + " = " + value )
									}else{
										se.or(w + " = " + value )
									}
							}
							so.where(se);
						break;
						default:
						break;
					}          
				//----------------------------------------------
				}else{
					var value = this.sanitize( w,this._criteria[w], true );
					so.where( w +' = ' + value );
				}
			}
		}
		return so;
	},  
	getSqlFind : function(){
		var so = squel.select();
				so.from(this.collection);
		if( this._fields.length > 0){
			for( f in this._fields ){
				so.field(this._fields[f]);
			}
		}
		var so = this.getCriteria(so);

		if( this._sort ){
			if( typeof(this._sort) == 'string'){
				so.order(this._sort);          
			}else{
				for( s in this._sort ){
						var key   = Object.keys(this._sort[s])[0];
						var value = String(this._sort[s][key]).toUpperCase() == 'DESC' ? false : true;
						so.order(key, value );
				} 
			}
		}
		if( this._skip > 0 ){
				so.offset( this._skip );
		}
		if( this._limit > 0 ){
			so.limit( this._limit);
		} 
		this._sql = so.toString();      
		return this._sql;  
	},

	getSqlCreate : function(){
		var so = squel.insert();
				so.into(this.collection);
		for( var x in this._data){

		var value = this.sanitize(x, this._data[x] );      
				so.set(x, value);

		}
		this._sql = so.toString();
		return this._sql;     
	},

	getSqlRemove : function(){
		var so = squel.delete();
				so.from(this.collection);
		var so = this.getCriteria(so);

		this._sql = so.toString();
		return this._sql;     
	},

	getSqlUpdate : function(){
		var values  = {};
		var so = squel.update();
		so.table(this.collection);
		for( var s in this._set['$set'] ){
			var value = this.sanitize(s,this._set['$set'][s]); 				
			values[s] = value;
			so.set(s,value);
		}
		this._data = values;
		var so 	   = this.getCriteria(so);
		return this._sql = so.toString();      
	},

	getSqlUpdateSave : function(){
		var so = squel.update();
		so.table(this.collection);

		for( var a in this._data ){				
			var value = typeof this._data[a] == 'object' &&  this._data[a] == 'null' ? null : this._data[a];
			if( value !== null)
				var value = this.sanitize(a,value)			
				so.set(a,value);
		}
		var so = this.getCriteria(so);
		this._sql = so.toString();			
		return this._sql;
	},

	getCurrentSQL : function(){
		// console.log( this._sql );
		return this._sql;
	},

	/* Internal methods
	* map of methods mongo native db
	--------------------------------------------------------------------------*/
	_find : function(db,callback){
		try{
			var that = this;
			var sql  = this.getSqlFind();					
			db.query( sql , function(e,r){				
				that.getCurrentSQL();				
				callback(e,that.toData(r)); 
				db.end(); 
			});
		 }catch(e){
			callback(e,null);
		}
	},
	_findOne : function(db,callback){      
		try{
			var that = this;
			this._limit = 1;
			db.query( this.getSqlFind() , function(e,r){
				that.getCurrentSQL();
				 if(r.length > 0){
						callback(e,that.result(that.toJson(r[0])));
					}else{
						callback(e,that.result({}));
					} 
					db.end();
			});
		 }catch(e){
			db.end();
			callback(e,null);
		}
	},
	_findById : function(db,callback){
		try{
			var that = this;
			this._criteria = {};
			this._criteria[this.primary] = this._id;        
			var query = db.query( this.getSqlFind() , function(e,r){
				that.getCurrentSQL();
				 if(r.length > 0){
						callback(e,that.result(that.toJson(r[0])));
					}else{
						callback(e,that.result({}));
					} 
					db.end();
			});        
		 }catch(e){
			db.end();
			callback(e,null);
		}
	},
	_findByUuid : function(db,callback){
		try{
			var that = this;				
			this._criteria = {uuid:this.sanitize('uuid', this._uuid)};
			db.query( this.getSqlFind() , function(e,r){
				that.getCurrentSQL();
				 if(r.length > 0){
						callback(e,that.result(r[0]));
					}else{
						callback(e,that.result({}));
					} 
					db.end();
			});        
		 }catch(e){
			db.end();
			callback(e,null);
		}
	},
	_create : function(db,callback){
		var that = this;
		try{
			this.beforeCreate(this._data,function(data){            
					this._data            = data;
					that._data.createdAt  = that.sanitize( 'createdAt', new Date() ) ;
					that._data.updatedAt  = that.sanitize( 'updatedAt', new Date() ) ;
					db.query( that.getSqlCreate() , function(e,r){
						that.getCurrentSQL();
						if(!e){
							that._fields   = [];
							that._limit    = 0;
							that._skip	   = 0;
							that._criteria = {id:r.insertId}; 
							that._findOne(db,callback);
						}else{
							callback(e,r);
							db.end();
						}          
					});             
			});
		}catch(e){
			 callback(e,null);
		}
	},
	_update : function(db,callback){      
		try{
			var that = this;
			var sqlupdate = that.getSqlUpdate();
			this.beforeUpdate(this._data,function(data){            
				this._data            = data;
				that._data.updatedAt  = that.sanitize('updatedAt', new Date() ) ;
				db.query( sqlupdate , function(e,r){							
						that.getCurrentSQL();
						if(!e){
							that._fields   = [];
							that._limit    = 0;
							that._skip     = 0;
							that._find(db,callback);
						}else{                
							callback(e,r);      
						}              
					}); 
			});
		}catch(e){
			 callback(e,null);
		}        
	},  
	_remove : function(db,callback){
		var that = this;      
		db.query( this.getSqlRemove() , function(e,r){
				that.getCurrentSQL();
				callback(e,r.affectedRows);
				db.end();
		});
	},
	_count : function(db,callback){      
		var query = db.query( 'SELECT COUNT(*) as count FROM ' + this.collection , function(e,r){
				callback(e,r[0].count);
		});
	},
	toJson : function(data){
		return data;
	},
	beforeCreate : function(values,next){
		next();
	},
	beforeUpdate : function(values,next){
		// var ndata =  _.extend({},  this.attributes, values ); 
		// console.log(ndata);
		next();
	},
	toData : function(data){
		var r = [];
			for( var i in data ){
				r.push(this.toJson(data[i]));
			}
			return r;
	},
	 _save : function(callback){
		 try{
			var that = this;
			this._data.updatedAt  = this.sanitize('updatedAt',  new Date() ) ;
			var sqlupdate 		  = this.getSqlUpdateSave();
			this.connect(function(db){
	          if(db){
	            db.query( sqlupdate , function(e,r){	                	
					that.getCurrentSQL();
					if(!e){
						that._fields   = [];
						that._limit    = 1;
						that._skip     = 0;
						that._find(db,callback);
					}else{							
						callback(e,r);
					}              
				}); 
	          }
	      });				
		}catch(e){
		 callback(e,null);
		}			
	},
	result : function(r){
		that = this;
		Object.defineProperty(r,"save",{
			get: function() {
					that._data = this;
					return function(callback){
						that._save(function(error,data){
							callback.call(this,error,data);
						});
					}
				}
			}); 
		return r;
	}
}