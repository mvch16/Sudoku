Sudoku.controller('SudokuController', function SudokuController($scope, data) {
	'use strict';
	
	$scope.rows = angular.copy(data);	
	$scope.rows_save = angular.copy(data);
    $scope.levels = ["Facil", "Medio", "Dificil"];
	$scope.selectedLevel = {
		levels: $scope.levels[1]
	}
	//alert(JSON.stringify(data[0].columns[3]))
	function createEmptyRows() {
		var rows = angular.copy(data);
		for (var l=0; l<9; l++)
			for(var c=0; c<9; c++){
				rows[l].columns[c].value = "";
				rows[l].columns[c].class = "";	
			}
		return rows;
	}

	function isSolved(rows)
	{
		for(var i = 0; i < 9; i++)
			for(var k=0; k<9; k++)
				if(rows[i].columns[k].value === "")
					return false;
		return true;
	}

	function changeClass(old_class, new_class) {
        if (old_class === "correct")
        	return old_class;
        else
        	return new_class;        
    }
	
	$scope.getLevel = function(level){
		
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

	$scope.init = function() {		
		$scope.rows = jQuery.extend(true, [], $scope.rows_save);
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
	    var edges = getCaseEdgesByCoords(rowId, columnId);
	    		
        for(var j = edges.row.min; j < edges.row.max; j++)
            for(var k=edges.column.min; k<edges.column.max; k++)
            {
                if((value == $scope.rows[j].columns[k].value) && j != rowId && k != columnId){
					$scope.rows[rowId].columns[columnId].class = changeClass($scope.rows[rowId].columns[columnId].class,"error");
	            	$scope.rows[j].columns[k].class = changeClass($scope.rows[j].columns[k].class, "error");
	            	}
            }	    	   		
   	};
   	   	   
	$scope.possibilities = function(row_id, column_id) {
		row_id = row_id - 1;
		column_id = column_id - 1;
		var pos = getPossibilities($scope.rows, row_id, column_id);
		$scope.rows[row_id].columns[column_id].possibilities = angular.copy(pos);
		$scope.currentPossibilities = angular.copy(pos);
	};
	
	$scope.solve = function() {
		var results = solveRows($scope.rows);
		if(results['state']){
			$scope.rows = jQuery.extend(true, [], results['rows']);
			alert("solved");			
		}
		else
			alert("can't be solved")
	};
	
	$scope.generate = function(){
	   $.ajax({url:'/api/generate', 
			type:'POST',
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
			})
			 .fail(function(e, msg, excpn){
				 alert('**** AJAX ERROR ' + msg + ' ****' );
			});
	};
}); 
