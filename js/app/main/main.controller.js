'use strict';

angular.module('MyApp')
	.controller('MainCtrl',
		['$scope', '$http', '$routeParams', '$timeout', '$filter',
		function ($scope, $http, $routeParams, $timeout, $filter) {

			$scope.input = {
				companyUrl: null,
				companyName: null,
			}
			$scope.loading = false;

			$scope.list = null;

			$scope.relatedCompanies = null;

			$scope.showSearchHistory = false;

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
			$scope.lineChartData = [];
			$scope.searchHistory = [];

			$scope.getSearchHistory = function() {
				for (var key in localStorage){
					// console.log(key);
					var regexp = /search_(\S+)/i;
					var matches = key.match(regexp);
					if (matches) {
						var match = matches[1];
						match = match.replace("%20", " ");
						$scope.searchHistory.push(match);
					}
				}
			}

			$scope.getSearchHistory();

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

			function updateLineChartConfig() {
				$scope.lineChartConfig = {
	        chart: {
	            type: 'spline'
	        },
	        title: {
	            text: ''
	        },
	        xAxis: {
	            type: 'datetime',
	            // dateTimeLabelFormats: { // don't display the dummy year
	            //     month: '%e',
	            //     year: '%b'
	            // },
	            title: {
	                text: ''
	            },
	            // labels: {
	            // 	display: false
	            // }
	            labels: {
                  formatter: function () {
                  	return '';
                  	// console.log(this);
                  	// var d = new Date(parseInt(this.x));
                  	// return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                   //    // return Highcharts.dateFormat('%m/%d', this.value);
                  }
              },
	        },
	        yAxis: {
	            title: {
	                text: 'Score'
	            },
	            min: -1,
	        },
	        // tooltip: {
	            // formatter: function() {
	            // 		console.log(this);
             //     var d = new Date(parseInt(this.x));
             //      return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

             //  }
	        // },

	        plotOptions: {
	            spline: {
	                // marker: {
	                //     enabled: true
	                // }
	            }
	        },

	        series: [{
	            name: 'Time',
	            data: $scope.lineChartData
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

					$scope.lineChartData = [];

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
						if (item.date) {
							var dateData = item.date;
							var dateNum = dateData[0] + '000';
							// console.log(dateNum, item.score);
							item.dateNum = dateNum;
						}
					});

					$scope.list = $filter('orderBy')(data.results, 'dateNum');
					angular.forEach($scope.list, function(item) {
						if (item.dateNum) {
							var dateOb = new Date(parseInt(item.dateNum));
							$scope.lineChartData.push([item.dateNum, item.score]);
						}
					});

					console.log(data.results);
					$scope.averageScore = $scope.totalScore / $scope.count;
					$scope.sentimentStats['positive'] = $scope.sentimentCount['positive'] / $scope.count * 100;
					$scope.sentimentStats['negative'] = $scope.sentimentCount['negative'] / $scope.count * 100;
					$scope.sentimentStats['neutral'] = $scope.sentimentCount['neutral'] / $scope.count * 100;

					$scope.pieChartData = [];
					$scope.pieChartData.push(['Positive', $scope.sentimentStats['positive']]);
					$scope.pieChartData.push(['Negative', $scope.sentimentStats['negative']]);
					$scope.pieChartData.push(['Neutral', $scope.sentimentStats['neutral']]);

					updatePieChartConfig();
					updateLineChartConfig();

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
