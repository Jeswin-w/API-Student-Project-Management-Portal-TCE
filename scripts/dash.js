var app = angular.module('dash',[]);

app.controller('dashcon',function($scope,$http){
	$http.get('/dashboard').then(function(data){
		$scope.user = data.data[0];
	})


})

