'use strict';


angular.module('MyApp', ['ngSanitize', 'ngRoute', 'ui.bootstrap', 'highcharts-ng'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'js/app/main/index.html',
				controller: 'MainCtrl'
			})
			.when('/company/:companyNm', {
				templateUrl: 'js/app/main/index.html',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})

	.controller('NavBarCtrl', ['$scope', function ($scope) {
			$scope.isCollapsed = true;
	}])

;
