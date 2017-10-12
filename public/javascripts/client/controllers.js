Sudoku.controller('SudokuController', function SudokuController($scope, data) {
	'use strict';
	$scope.rows = angular.copy(data);	
	$scope.rows_save = angular.copy(data);
    $scope.levels = [{name: "Facil",id:1}, {name: "Medio",id:2}, {name: "Dificil",id:3}];
	$scope.selectedLevel = {
		levels: $scope.levels[1]
	}


	function changeClass(old_class, new_class) {
        if (old_class === "correct")
        	return old_class;
        else
        	return new_class;        
    }
   
	$scope.getValue = function(value, rowId, columnId) {
        rowId -= 1;
        columnId -= 1;
		if ($scope.rows[rowId].columns[columnId].class == "correct")
			$scope.rows[rowId].columns[columnId].value = $scope.rows_save[rowId].columns[columnId].value;

        if (!(value >= 1 && value <= 9)){
			return "";		
		}		
		return value;		
	};
	
	$scope.clear = function() {		
		$scope.rows = createEmptyRows();
	};

	$scope.check = function(rowId, columnId) {
		rowId = rowId - 1;
		columnId = columnId - 1;
		var value = $scope.rows[rowId].columns[columnId].value;

		if ($scope.rows[rowId].columns[columnId].class == "correct")
			return;
		
		if (!(!isNaN(parseFloat(value)) && isFinite(value))){
			$scope.rows[rowId].columns[columnId].class = changeClass($scope.rows[rowId].columns[columnId].class, "error");
			$scope.rows[rowId].columns[columnId].value = '';
			return 
		}
			
		$scope.rows[rowId].columns[columnId].class =  changeClass($scope.rows[rowId].columns[columnId].class,"valide");
		for(var j = 0; j < 9; j++)
	    {
	        if((value == $scope.rows[rowId].columns[j].value) && columnId != j){
	            $scope.rows[rowId].columns[columnId].class = changeClass($scope.rows[rowId].columns[columnId].class,"error");
	            $scope.rows[rowId].columns[j].class = changeClass($scope.rows[rowId].columns[j].class, "error");
	           }
	    }
	    for(var j = 0; j < 9; j++)  //Valida columna y cuadro
	    {
	    	if((value == $scope.rows[j].columns[columnId].value) && rowId != j){
	            $scope.rows[rowId].columns[columnId].class = changeClass($scope.rows[rowId].columns[columnId].class, "error");
	            $scope.rows[j].columns[columnId].class = changeClass("error", $scope.rows[j].columns[columnId].class);
	           }
	    }
   	   		
   	};

	
	$scope.solve = function() {
		let m = new emptyBoard()
		for(var i=0;i<9;i++){
					for (var j =0;j<9;j++){
						if($scope.rows[i].columns[j].value =='')
							m[i][j]=0
						else
						m[i][j] = $scope.rows[i].columns[j].value
		}
		}
			$.ajax({url:'/api/resolve', 
			type:'POST',
			data: {sudoku : m}
			})
			.done(function(result){
				var r = angular.copy(data);
				for(var i=0;i<9;i++){
					for (var j =0;j<9;j++){
						if(result.sudoku[i][j]!=0)
						r[i].columns[j].value = result.sudoku[i][j]
					}
				}
				$scope.rows = r
				$scope.rows_save = r
			})
			 .fail(function(e, msg, excpn){
								 alert('**** AJAX ERROR ' + msg + ' ****' );
			});
	};
	
	$scope.generate = function(){
	   $.ajax({url:'/api/generate', 
			type:'POST',
			data: {nivel : $scope.selectedLevel.levels.id}
			})
			.done(function(result){
				var r = angular.copy(data);
				for(var i=0;i<9;i++){
					for (var j =0;j<9;j++){
						if(result.sudoku[i][j]!=0)
						r[i].columns[j].value = result.sudoku[i][j]
					}
				}
				$scope.rows = r
				$scope.rows_save = r
			})
			 .fail(function(e, msg, excpn){
				 alert('**** AJAX ERROR ' + msg + ' ****' );
			});
	};
	
	$scope.load = function(){
	   $.ajax({url:'/api/load', 
			type:'POST',
			data: {nivel : $scope.selectedLevel.levels.id}
			})
			.done(function(result){
				var r = angular.copy(data);
				alert(JSON.stringify(result.sudoku[1][1]))
				for(var i=0;i<9;i++){
					for (var j =0;j<9;j++){
						if(result.sudoku[i][j]!=0)
						r[i].columns[j].value = result.sudoku[i][j]
					}
				}
				$scope.rows = r
				$scope.rows_save = r
			})
			 .fail(function(e, msg, excpn){
				 alert('**** AJAX ERROR ' + msg + ' ****' );
			});
	};
	
	$scope.save = function(){
				let m = new emptyBoard()
		for(var i=0;i<9;i++){
					for (var j =0;j<9;j++){
						if($scope.rows[i].columns[j].value =='')
							m[i][j]=0
						else
						m[i][j] = $scope.rows[i].columns[j].value
		}
		}
	   $.ajax({url:'/api/sudoku', 
			type:'POST',
			data: {playedSudoku:m}
			})
			.done(function(result){
				alert('DOM@#')
				$scope.clear()
			})
			 .fail(function(e, msg, excpn){
				 alert('**** AJAX ERROR ' + msg + ' ****' );
			});
	};
	
	
}); 
