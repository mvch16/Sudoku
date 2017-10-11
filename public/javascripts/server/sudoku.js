const {random} = require('./randomValues')
const {emptyBoard} = require('./emptyBoard')

let randLevelHard = random(17,19)
let randLevelMedium = random(20,24)
let randLevelLow = random(25,32)
let randValue = random(1,9)
let rand = random(0,8)

class Sudoku extends Array {
	constructor(m,l){
	super()
	this.n = m.length
	this.range = Array.from({length :this.n}, (_,i)=>i)
	this.rows =m
	this.level = l
	}

	row(i){
		return this.rows[i];
	}

	col(j){
		let colums = []
		this.rows.forEach(row => colums.push(row[j]))
		return colums
	}

	cell(i,j){
		return this.rows[i][j];
	}

	isEmpty(i,j){
		return this.rows[i][j] == 0 ? true : false;
	}

	squareCorner(i,j){
		let n = this.n / 3
		return [i-i%n, j-j%n]
	}

	valuesFromSquareOf(i,j){
		let n = this.n / 3
		let values = []
		let [ib,jb] = this.squareCorner(i,j)
		this.range.slice(ib,ib+n).forEach(ki=> {
			this.range.slice(jb,jb + n).forEach(kj=> {
				values.push(this.cell(ki,kj))
			})
		})
		return values
	}

	possibleValuesAt(i,j){
		let current = this.row(i).concat(this.col(j))
						.concat(this.valuesFromSquareOf(i,j))
						.filter(v=> v!=0);
		return this.range.map(v=> v+1)
					.filter(x=> current.indexOf(x)==-1)
	}

	difineClues(){
		if(this.level == 1)
			return randLevelLow.next().value
		else if (this.level == 2)
			return randLevelMedium.next().value
		else
			return randLevelHard.next().value
	}


	generateBoard(){
		let clues = this.difineClues()
		console.log(clues)
		var i=0
		for(; i<clues;i++){
			let k = rand.next().value
			let j = rand.next().value
			let val = randValue.next().value
			if((this.rows[k][j] == 0) && (this.possibleValuesAt(k,j).indexOf(val) != -1))
				this.rows[k][j] = val
			else
				i--
		}
	}
}


module.exports = {Sudoku}