const {Sudoku} = require('./Sudoku')
const {emptyBoard} = require('./emptyBoard')

function resolve(m){	
	let board = new Sudoku(m,1);

	function findNumber(i,j,b){
		let n = board.n / 3
		let possibleValues = board.possibleValuesAt(i,j);
		if (possibleValues.length == 1){
			b.rows[i][j] = possibleValues[0]
			return b
		}
		
		let [ib,jb] = board.squareCorner(i,j)
		board.range.slice(ib,ib+n).forEach(ki=> {
			board.range.slice(jb,jb + n).forEach(kj=> {			
				if(board.cell(ki,kj) == 0 ){
					if(!(ki == i && kj == j)){
						possibleValues = possibleValues.filter(x=> ! board.possibleValuesAt(ki,kj).includes(x))
					}
				}				
			})
		})
		
		if (possibleValues.length == 1){
			b.rows[i][j] = possibleValues[0]
			return b
		}	
		
		throw null;
	}
	
	function findNumberCell (i,j,b) {
		const promise = new Promise(function (resolve, reject) {
			b = findNumber(i,j,b)
			resolve(b);
		})
		return promise
	}
	
	async function resolverSudoku(i,j,b){
		try{
			let result = await findNumberCell(i,j,b);
			return result
		}catch(err){
			
		}
		
	} 
		
	function evaluateBoard(){		
		board.rows.forEach((e,i) => {
			e.forEach((ej,j) => {
				if(board.rows[i][j] == 0)
					resolverSudoku(i,j,board)
			})
		})	
		return board
	}
	
	function isReady(){
		board.rows.forEach((e,i) => {
			e.forEach((ej,j) => {
				if(board.rows[i][j] == 0)
					return true;
			})
		})
		return false
	}
	
	
	let k =0
	while(isReady() || k <12){
	evaluateBoard()	
	k++
	}
	return board
}

module.exports = {resolve}