const {Sudoku} = require('./Sudoku')
const {emptyBoard} = require('./emptyBoard')

function test(){	
	let m = emptyBoard()
	let board = new Sudoku(m,1);
	/*console.log(board.rows)
	console.log('Values squareof (7,3) =', board.valuesFromSquareOf(1,1))
	console.log('Possible new values for (0,0)= ', board.possibleValuesAt(0,1))
	console.log('Possible new values for (0,0)= ', board.possibleValuesAt(0,1).length)
	console.log('Possible new values for (0,0)= ', board.possibleValuesAt(0,1)[0])*/
			
	console.log(board.rows)
	console.log('Probando ASYN/AWAIT')
	

	function findNumberCell (i,j) {
		const promise = new Promise(function (resolve, reject) {
			board.findNumber(i,j);
		})
		  
		return promise
	}
		
	function mostrarCuadro () {
		const promise = new Promise(function (resolve, reject) {
			setTimeout(function() {
				console.log('RESULTADO')
				console.log(board.rows)
			}, 1000);
		})
		  
		return promise
	}
		
					
	async function resolverSudoku(i,j){
		try{
			let p = await findNumberCell(i,j);
		}catch(err){
			console.log('Se produjo un error')
		}
		
	} 
		
	function evaluateBoard(){		
		board.rows.forEach((e,i) => {
			e.forEach((ej,j) => {
				board.rows[i][j] == 0 ? resolverSudoku(i,j) : null
			})
		})	
	}
	
	var cont =0
	function contador(){
		setInterval(function() {
			cont++
			console.log(cont)
		if (cont % 10 ==0){
				evaluateBoard()
				mostrarCuadro()
			}
		}, 100);
	}
	
	contador()
	evaluateBoard()
	mostrarCuadro()
}

test();