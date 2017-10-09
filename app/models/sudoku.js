
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SudokuSchema   = new Schema({
	level: String,
	initialSudoku: [{value:String}],
	playedSudoku: [{value:String}]
});

module.exports = mongoose.model('Sudoku', SudokuSchema);