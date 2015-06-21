'use strict';

angular.module('MyApp')
	.controller('MainCtrl',
		['$scope', '$http', '$routeParams', '$timeout',
		function ($scope, $http, $routeParams, $timeout) {

			$scope.input = {
				companyUrl: null,
				companyName: null,
			}
			$scope.loading = false;

			$scope.list = null;

			$scope.relatedCompanies = null;

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

			function updatePieChartConfig() {
				$scope.pieChartConfig = {
					chart: {
										plotBackgroundColor: null,
										plotBorderWidth: null,
										plotShadow: false
								},
								title: {
									text: '',
								},
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
			}

			$scope.parseServerData = function(data) {


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

				if (data.results.length) {

					angular.forEach(data.results, function(item) {
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

					$scope.pieChartData = [];
					$scope.pieChartData.push(['Positive', $scope.sentimentStats['positive']]);
					$scope.pieChartData.push(['Negative', $scope.sentimentStats['negative']]);
					$scope.pieChartData.push(['Neutral', $scope.sentimentStats['neutral']]);

					updatePieChartConfig();

					$scope.list = data.results;

					// $scope.$apply();

				}

				if (data.companies.length) {
					$scope.relatedCompanies = data.companies;
				}
			};

			$scope.analyzeWithName = function() {

				$scope.loading = true;
				$scope.totalScore = 0;
				$scope.averageScore = 0;
				$scope.count = 0;

				if(localStorage.getItem('search_' + encodeURIComponent($scope.input.companyName))) {
					$timeout(function(){
						$scope.loading = false;
						var localData = JSON.parse(localStorage.getItem('search_' + encodeURIComponent($scope.input.companyName)));
						$scope.parseServerData(localData);
					}, 1000);
				}
				else {
					var url = "http://nameless-tor-4963.herokuapp.com/api/news/" + encodeURIComponent($scope.input.companyName)
								+ '/totals/30.json';

					$http.get(url, { cache: true })
					.success(function(data) {
						$scope.loading = false;
						console.log(data);
						$scope.parseServerData(data);
						localStorage.setItem('search_' + encodeURIComponent($scope.input.companyName), JSON.stringify(data));
					})
					.error(function(data, status, headers, config) {
						$scope.loading = false;
						console.log('error');
					});
				}

			};

			$scope.clearInput = function() {
				$scope.input.companyName = null;
				$scope.list = null;
			};

			$scope.getDateStr = function(dateStr) {
				return new Date(dateStr);
			};

			function getTime() {
				return new Date().getTime();
			}

			if ($routeParams.companyNm) {
				$scope.input.companyName = $routeParams.companyNm;
				$scope.analyzeWithName();
			}

	}]);
