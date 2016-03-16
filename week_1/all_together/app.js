var MongoClient = require('mongodb').MongoClient,
	express = require('express'),
	app = express(),
	engines = require('consolidate'),
	assert = require('assert'),
	bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.engine('html',engines.nunjucks);
app.set('view engine', 'html');
app.set('views',__dirname+'/views');
//app.use(express.bodyParser());
//app.use(app.router);

function errorHandler(err, req, res, next){
	console.log(err.message);
	console.log(err.stack);
	res.status(500);
	res.render('error_template',{error : err});
}

app.use(errorHandler);

MongoClient.connect('mongodb://localhost:27017/video',function(err, db){
	assert.equal(null, err);
	console.log('successfully connected to MOngoDb');

	app.get('/',function(req, res){
		db.collection('movies').find({}).toArray(function(err, docs){
			res.render('movies',{'movies':docs})
		})
	})

	app.post('/favorite_movie',function(req, res, next){
		var favorite = req.body.movie;
		console.log(favorite);
		if(typeof favorite == 'undefined'){
			next(Error('Please choose movie !'));
		}else{
			res.send('Your favorite movie is '+ favorite);
		}
	})

	app.use(function(req,res){
		res.sendStatus(404);
	})

	var server = app.listen(3300, function(){
		var port = server.address().port;
		console.log('Express server is running on port %s', port);
	})
})
