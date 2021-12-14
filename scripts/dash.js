var app = angular.module('dash', []);

app.controller('dashcon', function($scope, $http) {

	$http.get('/ecourse').then(function(data){
		$scope.ecourse = data.data;
	})
	$http.get('/coursedetail').then(function(data){
		$scope.coursedetail = data.data;
	})
	$http.get('/facultydetail').then(function(data){
		$scope.facultydetail = data.data;
	})
	$http.get('/projectdetail').then(function(data){
		$scope.projectdetail = data.data;
	})
    $http.get('/vsub').then(function(data){
		$scope.vsub = data.data;
	})
    

    $http.get('/dashboard').then(function(data) {
        $scope.user = data.data[0];
    })
    $http.get('/fdashboard').then(function(data) {
        $scope.fuser = data.data[0];
    })

    $http.get('/ecourse').then(function(data) {
        $scope.ecourse = data.data;
    })
    $http.get('/coursedetail').then(function(data) {
        $scope.coursedetail = data.data;
    })

    $http.get('/send').then(function(data) {
        $scope.course = data.data;
    })

    $http.get('/fcourses').then(function(data) {
        $scope.fic = data.data;
    })
    $http.get('/fcourses1').then(function(data) {
        $scope.fm = data.data;
    })

    $http.get('/submissions').then(function(data) {
        $scope.sd = data.data;
    })
    $http.get('/teamrem').then(function(data) {
        $scope.tr = data.data;
    })
    $http.get('/guidelist').then(function(data) {
        $scope.gl = data.data;

    })
    $http.get('/reglist').then(function(data) {
        $scope.reg = data.data;
    })
    $scope.filesub = function(sid) {
        $location.url(`/filesub.html?sid=${sid}`);
    };

    $http.get('/projectList').then(function(data) {
        $scope.pro = data.data;
    })
})