# Tenant 
Lightweight MultiTenant Framework for SQL/NoSQL projects



```shell
npm test
```
![Alt text](https://s3.amazonaws.com/f.cl.ly/items/0d1i0t310j0j3u3w113C/Screen%20Shot%202016-05-27%20at%207.54.15%20PM.png?v=2c42026a "npm test")

### Find 
```js
User.tenant('auditor').find({name:{like:'fer%'}}).sort([{id:'ASC'}]).skip(2).limit(1).exec(function(e,r){
	console.log(e||r);
});
```
```js
User.tenant('auditor').find({status:{or:[0]}}).sort([{id:'ASC'}]).skip(0).limit(1).exec(function(e,r){
	console.log(e||r);
});
```
```js
User.tenant('auditor').find({full_name:{like:'B%'}}).sort([{id:'ASC'}]).exec(function(e,r){
	console.log(e||r);
});
```

### FindOne
```js
User.tenant('auditor').findOne().skip(4).sort([{id:'asc'}]).exec(function(e,r){
	console.log(e||r);
});
```

### FindById
```js
User.tenant('auditor').findById(1).exec(function(e,r){
	console.log(e||r);
});
```

### FindByUuid
```js
User.tenant('auditor').findByUuid('24565468857630727').exec(function(e,r){
	console.log(e||r);
});
```

### Count
```js
User.tenant('auditor').count().exec(function(e,r){
	console.log(r);
});
```

### Remove
```js
User.tenant('auditor').remove({id:261}).exec(function(e,d){
 console.log(e||d);  
});
```
### Update
```js
User.tenant('auditor').update({id:262},{$set:{name:'Saraí León 3',status:2}}).exec(function(e,d){
 console.log(d);
});
```

### Create 
```js
User.tenant('auditor').create({
	id:0,
	name:'Ferso',
	full_name :'Ferso Create',
	created: new Date(),
	password: 'casa'
}).exec(function(e,r){
	console.log(e||r);
});
```

### Update after FindOne save() 
```js
User.tenant('auditor').findOne({id:1}).exec(function(e,r){
	r.name   = 'Test Finalize5';
	r.phone  = null;
	r.save(function(e,r){
		console.log(r);
	})
});

```

