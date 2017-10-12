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

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port     = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/sudokus',
                 {
					 useMongoClient: true
				 }
);

const Sudoku    = require('./app/models/sudoku');

const router = express.Router();

router.use((req, res, next)=> {
	console.log('General middleware activated');
	next();
});

router.get('/', function(req, res) {
	setTimeout( ()=>
	res.json({ message: '*** Rest API is working fine!***' }),
	5000)	
});

router.route('/sudoku')
	.post((req, res)=> {
				let sudoku = new Sudoku();
				sudoku.playedSudoku = req.body.playedSudoku
				sudoku.save((err)=> {
							err ? res.send(err) : null;
							console.log('Post Error = ' + err);
							res.json({ message: 'Sudoku guardado correctamente'});
				});	
	})

	.get((req, res)=> {
		console.log('GET requested');
		Sudoku.find((err, sudokus)=> {
			err ? res.send(err) : null;
			res.json({message:'Lista de sudokus', listaSudokus: sudokus});
		});
	});

router.route('/sudoku/:sudoku_id')

	// GET
	.get((req, res)=> {
		     Sudoku.findById(req.params.sudoku_id, 
		                   (err, sudoku)=>{
							err ? res.send(err) : null;
						    res.json(sudoku);
		             });
	 })
	 
	// UPDATE 
	.put((req, res)=> {
		Sudoku.findById(req.params.sudoku_id,(err, sudoku)=> {

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
		Sudoku.remove({
			_id: req.params.sudoku_id
		},(err, sudoku)=>{
			err ? res.send(err) : null;
			res.json({ status: 'ok', message: 'Sudoku eliminado de forma correcta' });
		});
	});
		
router.route('/resolve')
	.post(function(req, res){
		const {resolve} = require('./public/javascripts/server/sudokuResolver')
		let m = req.body.sudoku
		m.forEach((i,ki) => {
			m[ki] = m[ki].map(x=> parseInt(x))
		})
		let k = new resolve(m)
		res.json({message:'Sudoku resuelto', sudoku: k.rows});
		});	

router.route('/generate')
	.post(function(req, res){
		const {Sudoku} = require('./public/javascripts/server/Sudoku')
		const {emptyBoard} = require('./public/javascripts/server/emptyBoard')
		let nivel = req.body.nivel
		let m = new emptyBoard()
		let board = new Sudoku(m,nivel)
		board.generateBoard()
		res.json({message:'Sudoku generado aleatoriamente',sudoku: board.rows});
		});	

router.route('/load')
	.post(function(req, res){
		Sudoku.find((err, sudokus)=> {
			const {Sudoku} = require('./public/javascripts/server/Sudoku')
			err ? res.send(err) : null;
			let board = new Sudoku(sudokus[0].initialSudoku,1)
			let gg = JSON.stringify(sudokus[0].initialSudoku)
			console.log(gg[0][0])
			console.log(board.rows)
			res.json({sudoku:board.rows})
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
