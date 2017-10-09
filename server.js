/*
  Demo Rest API
  loriacarlos@gmail.com/docs/connections
  EIF400
*/

// IMPORTS
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express(); 
const morgan     = require('morgan');
const favicon    = require('express-favicon');
const mongoose   = require('mongoose');

// APP BASIC CONFIGURATION
app.use(morgan('dev')); // log requests to console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port     = process.env.PORT || 8080; // set  port (default 8080)
///////////////////////////////////////////////////////////////////////////////
// CONNECT TO DB
mongoose.connect('mongodb://localhost/sudokus',
                 {
					 useMongoClient: true
				 } // See http://mongoosejs.com/docs/connections.html#use-mongo-client
);

// Data model
const Sudoku     = require('./app/models/sudoku');
////////////////////////////////////////////////////////////////////////////////
// API SETUP

// 1) Create router
const router = express.Router();
// 2) Config paths

// Middleware to use for all requests
router.use((req, res, next)=> {
	console.log('General middleware activated');
	next();
});

// Route to test (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	setTimeout( ()=>
	res.json({ message: '*** Rest API is working fine! ***' }),
	5000)	
});

// REST API
// ON /bears
//    POST (create one)
//    GET  ( get all)
// ----------------------------------------------------
// ***** Notice the "callback hell" *****
//-----------------------------------------------------
router.route('/bears')
	// create a bear (accessed at POST http://localhost:8080/bears)
	.post((req, res)=> {
				console.log('POST requested: ' + req.body.name);
				let bear = new Bear();		// create a new instance of the Bear model
				// Extract data from request
				console.log('Post body ' + JSON.stringify(req.body))
				bear.name = req.body.name;  // set the bears name (comes from the request)
										// **** NOTICE: We should avoid potential injection *****
										// https://en.wikipedia.org/wiki/Code_injection
				bear.save((err)=> {
							err ? res.send(err) : null;
							console.log('Post Error = ' + err);
							res.json({ message: 'Bear created!', bearId : bear._id , name:bear.name});
				});	
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get((req, res)=> {
		console.log('GET requested');
		Bear.find((err, bears)=> {
			err ? res.send(err) : null;
			res.json(bears);
		});
	});

// ON /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

	// GET
	.get((req, res)=> {
		     Bear.findById(req.params.bear_id, 
		                   (err, bear)=>{
							err ? res.send(err) : null;
						    res.json(bear);
		             });
	 })

	// UPDATE 
	.put((req, res)=> {
		Bear.findById(req.params.bear_id,(err, bear)=> {

			err ? res.send(err) : null;
			bear.name = req.body.name;
			bear.save((err)=> {
				err ? res.send(err) : null;
				res.json({ status: 'ok', message: 'Bear updated!' });
			});

		});
	})

	// DELETE
	.delete((req, res)=>{
		Bear.remove({
			_id: req.params.bear_id
		},(err, bear)=>{
			err ? res.send(err) : null;
			res.json({ status: 'ok', message: 'Successfully deleted' });
		});
	});

///////////////////////////////////////////////////////////////////////
// APP settings
// REGISTER STATIC
// See https://expressjs.com/en/starter/static-files.html
app.use('/static', express.static((__dirname + '/public')))
//  See https://www.npmjs.com/package/express-favicon
app.use(favicon(__dirname + '/public/images/favicon.png'));
// REGISTER API ROUTER
app.use('/api', router);

//----------- START THE SERVER ---------------------
// 
app.listen(port);
console.log('*** Server is up and running on port ' + port + ' ***' );
