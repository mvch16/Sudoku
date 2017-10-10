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
const {Sudoku} = require('./public/javascripts/server/Sudoku')
const {emptyBoard} = require('./public/javascripts/server/emptyBoard')


// APP BASIC CONFIGURATION
app.use(morgan('dev')); // log requests to console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port     = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/sudoku',
                 {
					 useMongoClient: true
				 }
);

const SudokuBD    = require('./app/models/sudoku');

const router = express.Router();

router.use((req, res, next)=> {
	console.log('General middleware activated');
	next();
});

// Route to test (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	setTimeout( ()=>
	res.json({ message: '*** Rest API is working fine!***' }),
	5000)	
});

router.route('/sudoku')
	// create a bear (accessed at POST http://localhost:8080/bears)
	.post((req, res)=> {
				console.log('POST requested: ' + req.body.name);
				let sudoku = new Sudoku();		// create a new instance of the Bear model
				// Extract data from request
				console.log('Post body ' + JSON.stringify(req.body))
				sudoku.initialSudoku = req.body.initialSudoku;
				sudoku.level = req.body.level;
				sudoku.playedSudoku = req.body.playedSudoku// set the bears name (comes from the request)
										// **** NOTICE: We should avoid potential injection *****
										// https://en.wikipedia.org/wiki/Code_injection
				SudokuBD.save((err)=> {
							err ? res.send(err) : null;
							console.log('Post Error = ' + err);
							res.json({ message: 'Sudoku guardado correctamente', SudokuId : sudoku._id});
				});	
	})

	.get((req, res)=> {
		console.log('GET requested');
		SudokuBD.find((err, sudoku)=> {
			err ? res.send(err) : null;
			res.json(sudoku);
		});
	});

router.route('/sudoku/:sudoku_id')

	// GET
	.get((req, res)=> {
		     SudokuBD.findById(req.params.sudoku_id, 
		                   (err, sudoku)=>{
							err ? res.send(err) : null;
						    res.json(sudoku);
		             });
	 })

	// UPDATE 
	.put((req, res)=> {
		SudokuBD.findById(req.params.sudoku_id,(err, sudoku)=> {

			err ? res.send(err) : null;
			sudoku.playedSudoku = req.body.playedSudoku;
			sudoku.save((err)=> {
				err ? res.send(err) : null;
				res.json({ status: 'ok', message: 'Sudoku actualizado' });
			});

		});
	})

	// DELETE
	.delete((req, res)=>{
		SudokuBD.remove({
			_id: req.params.sudoku_id
		},(err, sudoku)=>{
			err ? res.send(err) : null;
			res.json({ status: 'ok', message: 'Sudoku eliminado de forma correcta' });
		});
	});
	
router.route('/generate')
	.post((req, res)=> {
		console.log('POST requested: ' + req.body.name);
		console.log('Post body ' + JSON.stringify(req.body))
		let level = 1
		let m = new emptyBoard()
		let board = new Sudoku(m,1)
		board.generateBoard()
		//Aqui se resuelve el sudoku*/
		res.json({ message: 'Sudoku generado', sudo:board.rows});
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
