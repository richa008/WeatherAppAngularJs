//MODULE
var weatherApp = angular.module("weatherApp", ["ngResource", "ngRoute"]);


//ROUTES
weatherApp.config(function($routeProvider){
   
    $routeProvider.when('/', {
        templateUrl: 'home.htm',
        controller: 'homeController'
    })
    .when('/forecast', {
        templateUrl: 'forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:days', {
        templateUrl: 'forecast.htm',
        controller: 'forecastController'
    })
});


//SERVICES
weatherApp.service('forecastService', function(){
   
    this.city = 'New York, NY';
    
});

//CONTROLLERS
weatherApp.controller("homeController", ['$scope', 'forecastService', function($scope, forecastService){
    
    $scope.city = forecastService.city;
    
    $scope.$watch('city', function(){
       forecastService.city = $scope.city; 
    });
    
}]);

weatherApp.controller("forecastController", ['$scope', '$resource', 'forecastService', '$routeParams', function($scope, $resource, forecastService, $routeParams){
    
    $scope.city = forecastService.city;
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}});
    
    $scope.weatherResult = $scope.weatherAPI.get({
        q: $scope.city,
        cnt: $routeParams.days || 2,
        appid: '2de143494c0b295cca9337e1e96b00e0'
    });
    
    $scope.convertToFarenheit = function(degK){     
        return Math.round(1.8 * (degK - 273)) + 32;
    };
    
    $scope.convertDate = function(dateValue){
        return new Date(dateValue * 1000); 
    };
    
    console.log($scope.weatherResult);
}]);

//DIRECTIVES
weatherApp.directive("weatherReport", function(){
   
    return{
        restrict: 'E',
        templateUrl: 'weatherReport.htm',
        replace: true,
        scope:{
            weatherDay: "=",
            convertTemperatureUnit: "&",
            convertToDate: "&",
            dateFormat: "@"
        }
    }
});