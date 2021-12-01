var app = angular.module('dash',[]);

app.controller('dashcon',function($scope,$http){
	$http.get('/dashboard').then(function(data){
		$scope.user = data.data[0];
	})

	$http.get('/ecourse').then(function(data){
		$scope.ecourse = data.data;
	})

	$http.get('/send').then(function(data){
		$scope.course = data.data;
	})
 
})

