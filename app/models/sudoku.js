var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SudokuSchema   = new Schema({
	level: String,
	initialSudoku: String,
	playedSudoku: String
});

module.exports = mongoose.model('Sudoku', SudokuSchema);