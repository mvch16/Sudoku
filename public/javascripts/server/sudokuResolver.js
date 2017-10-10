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
			resolve(board.findNumber(i,j));
		})
		return promise
		//return Promise.resolve(board.findNumber(i,j))
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
			board.rows[i][j] = p;
		}catch(err){
			
		}
		
	} 
		
	function evaluateBoard(){
		console.log('EVALUANDO')		
		board.rows.forEach((e,i) => {
			e.forEach((ej,j) => {
				board.rows[i][j] == 0 ? resolverSudoku(i,j) : null
			})
		})	
	}
	
	function isReady(){		
			board.rows.forEach((e,i) => {
				e.forEach((ej,j) => {				
					 if(board.rows[i][j] == 0)
					 return true
			})
		})	
		return false
	}
	
	/*var cont =0
	function contador(){
		setInterval(function() {
			cont++
			console.log(cont)
		if (cont % 10 ==0){
				while(!isReady()){
					console.log('EVALUANDO!!!!!!!!!!!!!!!')
				evaluateBoard()
				mostrarCuadro()
				}
			}
		}, 100);
	}*/
	console.log('START')
	if(isReady()){
		evaluateBoard()
		mostrarCuadro()
	}
	
	//contador()
	mostrarCuadro()
}

test();