var app = angular.module('dash', ['googlechart']);

app.controller('dashcon', function($scope, $http ) {
    
	$http.get('/ecourse').then(function(data){
		$scope.ecourse = data.data;
	})
	$http.get('/coursedetail').then(function(data){
		$scope.coursedetail = data.data;
	})
    $http.get('/chartbatch').then(function(data){
       
		$scope.cb = data.data;
        $scope.ba=$scope.cb[0];
        $scope.de=$scope.cb[1];
        $scope.barChartObject = {};
    $scope.barChartObject.type = 'BarChart';
    $scope.barChartObject.data = {"cols": [
    {id: "t", label: "Batch", type: "string"},
    {id: "s", label: "No of projects", type: "number"}
    ], "rows": $scope.ba};

$scope.barChartObject.options = {
	'title': 'Batch'
};
$scope.barChartObject1 = {};
    $scope.barChartObject1.type = "PieChart";
    $scope.barChartObject1.data = {"cols": [
    {id: "t", label: "Dept", type: "string"},
    {id: "s", label: "No of projects", type: "number"}
    ], "rows": $scope.de};

$scope.barChartObject1.options = {
	'title': 'Department'
};


	})

    $http.get('/admindashboard').then(function(data){
		$scope.admin = data.data;
	})

	$http.get('/facultydetail').then(function(data){
		$scope.facultydetail = data.data;
	})
	$http.get('/projectdetail').then(function(data){
		$scope.projectdetail = data.data;
	})
    $http.get('/vsub').then(function(data){
		$scope.vsub = data.data;
        $scope.pieChartObject = {};
    $scope.pieChartObject.type = "PieChart";

    //set title
    $scope.pieChartObject.options = {
        'title': 'Submission Status'
    };
    //set data
    $scope.pieChartObject.data = {"cols": [
        {id: "t", label: "Status", type: "string"},
        {id: "s", label: "no of teams", type: "number"}
        ], "rows": [
            {c: [
                {v: "submitted"},
                {v: $scope.vsub[0]},
            ]},
           
            {c: [
                {v: "not submitted"},
                {v: $scope.vsub[1]},
            ]}
    ]};
        })
    $scope.showForm= false;

$scope.onClickForm = function(){
    $scope.showForm = true;
}
$http.get('/guideteams').then(function(data) {
    $scope.gt = data.data;
})
$http.get('/teamsub').then(function(data) {
    $scope.ts = data.data;
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
    $http.get('/filesubdet').then(function(data) {
        $scope.fsd = data.data[0];
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