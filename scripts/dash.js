var app = angular.module('dash',[]);

app.controller('dashcon',function($scope,$http){
	$http.get('/dashboard').then(function(data){
		$scope.user = data.data[0];
	})
	$http.get('/fdashboard').then(function(data){
		$scope.user = data.data[0];
	})

	$http.get('/ecourse').then(function(data){
		$scope.ecourse = data.data;
	})

	$http.get('/send').then(function(data){
		$scope.course = data.data;
	})

	$http.get('/fcourses').then(function(data){
		$scope.fic = data.data;
	})
	$http.get('/fcourses1').then(function(data){
		$scope.fm = data.data;
	})
})

