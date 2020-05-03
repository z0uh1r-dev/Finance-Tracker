var app = angular.module('FinanceTrackerApp', [])
                    .factory('stockService', ['$http', function($http) {
                      var stockApi = {};

                      stockApi.searchStocks = function(symbol) {
                        return $http.get('/search_stocks.json?stock=' + symbol);
                      }

                      return stockApi;
                    }])
                    .controller('stocksController', ['$scope', 'stockService', function($scope , stockService) {
                      
                      $scope.stock = {};

                      $scope.lookup = function() {
                        if($scope.ticker != undefined && $scope.ticker != '') {
                          stockService.searchStocks($scope.ticker)
                            .then(function(res) {
                              $scope.stock = {}
                              $scope.stock,error = null;
                              $scope.stock,symbol = res.data.ticker;
                              $scope.stock,name = res.data.name;
                              $scope.stock,last_price = res.data.last_price;
                              $scope.stock,can_be_added = res.data.can_be_added;
                            }, function(err) {
                              $scope.stock = {}
                              $scope.stock.error = err.data.response
                            });

                          $scope.stock = {
                            symbol: 'FOO',
                            name: 'Example Corp.',
                            last_price: '123.00'
                          }
                        } else {
                          $scope.stock = {
                            symbol: {}
                          }
                        }
                      }
                    }]);