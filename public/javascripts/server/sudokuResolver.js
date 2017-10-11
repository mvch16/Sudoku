const {Sudoku} = require('./Sudoku')
const {emptyBoard} = require('./emptyBoard')

function resolve(m){	
	let board = new Sudoku(m,1);
	
	
		
	function findNumber(i,j){
		let n = board.n / 3
		let possibleValues = board.possibleValuesAt(i,j);
		if (possibleValues.length == 1){
			return possibleValues[0]
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
		console.log(possibleValues)
		if (possibleValues.length == 1){
			return possibleValues[0]
		}	
		
		throw null;
	}

	function findNumberCell (i,j) {
		const promise = new Promise(function (resolve, reject) {
			resolve(findNumber(i,j));
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
	

	/*function contador(){
			var cont =0
		setInterval(function() {
			cont++
			console.log(cont)
		if (cont % 10 ==0){
				while(!isReady()){
				evaluateBoard()
				mostrarCuadro()
				}
			}
		}, 100);
	}*/
	evaluateBoard()
	mostrarCuadro()
}
module.exports = {resolve}






























/*const {Sudoku} = require('./Sudoku')
const {emptyBoard} = require('./emptyBoard')

class sudokuResolver{	
	constructor(m){
		this.hints = m
		this.board = new Sudoku(m,1);
	}	
	
	findNumber(i,j){
		console.log('FINDNUMBER')
		let n = this.board.n / 3
		let possibleValues = this.board.possibleValuesAt(i,j);
		if (possibleValues.length == 1){
			return possibleValues[0]
		}
		
		let [ib,jb] = this.board.squareCorner(i,j)
		this.board.range.slice(ib,ib+n).forEach(ki=> {
			this.board.range.slice(jb,jb + n).forEach(kj=> {			
				if(this.board.cell(ki,kj) == 0 ){
					if(!(ki == i && kj == j)){
						possibleValues = possibleValues.filter(x=> ! this.board.possibleValuesAt(ki,kj).includes(x))
					}
				}				
			})
		})
		
		if (possibleValues.length == 1){
			return possibleValues[0]
		}	
		
		throw null;
	}
	

	findNumberCell (i,j) {
		console.log(this.board.rows)
		const promise = new Promise(function (resolve, reject) {
			
			resolve(this.findNumber(i,j));
		})
		return promise
		//return Promise.resolve(board.findNumber(i,j))
	}
		
	/*mostrarCuadro () {
		const promise = new Promise(function (resolve, reject) {
			setTimeout(function() {
				console.log('RESULTADO')
				console.log(board.rows)
				return this.board.rows
			}, 1000);
		})
		  
		return promise
	}
		
					
	async resolverSudoku(i,j){
		//try{
			let p = await this.findNumberCell(i,j);
			this.board.rows[i][j] = p;
		//}catch(err){
		//	console.log('ERROR PROmise')
		//}
		
	} 
		
	evaluateBoard(){
		console.log('EVALUANDO')	
		this.board.rows.forEach((e,i) => {
			e.forEach((ej,j) => {
				this.board.rows[i][j] == 0 ? this.resolverSudoku(i,j) : null
			})
		})	
	}
	
	solve(){
		this.evaluateBoard()
		return this.board.rows
	}
	
	
	/*contador(){
		var cont =0
		setInterval(function() {
			cont++
			console.log(cont)
		if (cont % 10 ==0){
				while(!isReady()){
					console.log('EVALUANDO!!!!!!!!!!!!!!!')
				evaluateBoard()
				}
			}
		}, 100);
	}

}

module.exports = {sudokuResolver}*/