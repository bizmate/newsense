'use strict';

angular.module('MyApp')
	.controller('MainCtrl',
		['$scope', '$http',
		function ($scope, $http) {

			console.log('main controller');

			$scope.input = {
				companyUrl: null,
				companyName: null,
			}
			$scope.loading = false;

			$scope.list = null;

			$scope.analyzeWithName = function() {
				$scope.loading = true;
				console.log('analyzeWithUrl', $scope.input.companyName);

				var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?text=" +
					encodeURIComponent($scope.input.companyName) + "&absolute_max_results=50&indexes=news_eng&print=all&summary=quick" +
					"&apikey=6997fba7-6014-4fde-bbec-dd85c1d9fee9";

				// var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?text=IBM&absolute_max_results=50&indexes=news_eng&print=fields&print_fields=reference%2C+title%2C+links%2C+summary%2C+date%2C+place%2C+company%2C+rss_category&summary=quick&apikey=6997fba7-6014-4fde-bbec-dd85c1d9fee9"
				$http.get(url)
				.success(function(data) {
					$scope.loading = false;
					console.log(data);
					$scope.list = data.documents;
				})
				.error(function(data, status, headers, config) {
					$scope.loading = false;
					console.log('error');
				});

			};

			$scope.clearInput = function() {
				$scope.input.companyName = null;
				$scope.list = null;
			}


	}]);
