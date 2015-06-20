'use strict';

angular.module('MyApp')
	.controller('MainCtrl',
		['$scope',
		function ($scope) {

			console.log('main controller');

			$scope.input = {
				companyUrl: null,
			}

			$scope.analyzeWithUrl = function() {
				console.log('analyzeWithUrl', $scope.input.companyUrl);
			}


	}]);
