var app = angular.module('addproject',[]);

app.controller('addproject',function($scope,$http){
	$http.get('/addproject').then(function(data){
		$scope.user = data.data[0];
	})
})