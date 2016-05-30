/**
 * Session Configuration
 * 
  
  #auth
  type is the type auth how you acces to api resources 
  set false for free access police
  * secret 
      - single token key use secret 
  * token 
      - use database for access token       
  * credentials
      - user
      - password
  * oAuth 
  
 */


module.exports.session = {
  secret: 'e43df553ace37ab154a2b3abd2742656',
  cookie: {
    maxAge: (24 * 60 * 60 * 1000 ) * 366
  },
  adapter : {        
      collection:'sessions',
      host: '127.0.0.1',
      port: 27017,
      database: 'tenant',
  },
  auth:false,
    
};