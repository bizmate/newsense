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

			$scope.sentimentCount = {
				'neutral': 0,
				'positive': 0,
				'negative': 0
			};

			$scope.sentimentStats = {
				'neutral': 0,
				'positive': 0,
				'negative': 0
			};

			$scope.pieChartData = [];

			$scope.pieChartConfig = {
				chart: {
									plotBackgroundColor: null,
									plotBorderWidth: null,
									plotShadow: false
							},
							title: "Percentage",
							tooltip: {
									pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							plotOptions: {
									pie: {
											allowPointSelect: true,
											cursor: 'pointer',
											dataLabels: {
													enabled: false
											},
											showInLegend: true
									}
							},
							series: [{
									type: 'pie',
									name: 'Percentage',
									data: $scope.pieChartData
							}]
			};

			$scope.analyzeWithName = function() {
				$scope.loading = true;
				$scope.totalScore = 0;
				$scope.averageScore = 0;
				$scope.count = 0;
				// console.log('analyzeWithUrl', $scope.input.companyName);

				// var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?text=" +
				// 	encodeURIComponent($scope.input.companyName) + "&absolute_max_results=50&indexes=news_eng&print=all&summary=quick" +
				// 	"&apikey=6997fba7-6014-4fde-bbec-dd85c1d9fee9";

				var url = "http://nameless-tor-4963.herokuapp.com/api/news/" + encodeURIComponent($scope.input.companyName);

				// var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?text=IBM&absolute_max_results=50&indexes=news_eng&print=fields&print_fields=reference%2C+title%2C+links%2C+summary%2C+date%2C+place%2C+company%2C+rss_category&summary=quick&apikey=6997fba7-6014-4fde-bbec-dd85c1d9fee9"
				$http.get(url, { cache: true })
				.success(function(data) {
					$scope.loading = false;
					console.log(data);
					if (data.length) {
						angular.forEach(data, function(item) {
							$scope.count++;
							$scope.totalScore += item.score;
							if (item.sentiment == 'positive') {
								$scope.sentimentCount['positive']++;
							}
							else if (item.sentiment == 'negative') {
								$scope.sentimentCount['negative']++;
							}
							else {
								$scope.sentimentCount['neutral']++;
							}
						});
						$scope.averageScore = $scope.totalScore / $scope.count;
						$scope.sentimentStats['positive'] = $scope.sentimentCount['positive'] / $scope.count * 100;
						$scope.sentimentStats['negative'] = $scope.sentimentCount['negative'] / $scope.count * 100;
						$scope.sentimentStats['neutral'] = $scope.sentimentCount['neutral'] / $scope.count * 100;

						$scope.pieChartData.push(['Positive', $scope.sentimentStats['positive']]);
						$scope.pieChartData.push(['Negative', $scope.sentimentStats['negative']]);
						$scope.pieChartData.push(['Neutral', $scope.sentimentStats['neutral']]);
					}
					$scope.list = data;
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

			$scope.getDateStr = function(dateStr) {
				return new Date(dateStr);
			}


	}]);
