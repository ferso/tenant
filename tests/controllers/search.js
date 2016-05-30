module.exports = {
	 index: function (req, res) {
	 	var keyword = req.body.keyword;
	 	var keyword = new RegExp(keyword, "i");
 		Users.tenant(this.account.tenant).find({$or:[{name:keyword},{first_lastname:keyword},{second_lastname:keyword}]},{'_id':true,'avatar':true,'name':true,'first_lastname':true,'second_lastname':true}).exec(function(e,d){ 		 
 		  return res.json({code:0,msg:'ok',data:d});	
 	   });		
  	},
};
