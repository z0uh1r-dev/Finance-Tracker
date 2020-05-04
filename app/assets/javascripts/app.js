var app = angular.module('FinanceTrackerApp', [])
                    .factory('stockService', ['$http', function($http) {
                      var stockApi = {};

                      stockApi.searchStocks = function(symbol) {
                        return $http.get('/search_stocks.json?stock=' + symbol);
                      }

                      stockApi.addStockToPortfolio = function(symbol) {
                        return $http.post('/user_stocks.json?stock=' + symbol);
                      }

                      return stockApi;
                    }])
                    .factory('friendService', ['$http', function($http) {
                      var friendApi = {};

                      friendApi.searchFriends = function(search_param) {
                        return $http.get('/search_friends.json?search_param=' + search_param);
                      }

                      friendApi.addFriend = function(friend_id) {
                        return $http.post('/add_friend.json?friend=' + friend_id);
                      }

                      return friendApi;
                    }])
                    .controller('stocksController', ['$scope', 'stockService', function($scope , stockService) {
                      
                      $scope.stock = {};

                      $scope.lookup = function() {
                        if($scope.ticker != undefined && $scope.ticker != '') {
                          stockService.searchStocks($scope.ticker)
                            .then(function(res) {
                              $scope.stock = {}
                              $scope.stock.error = null;
                              $scope.stock.message = null;
                              $scope.stock.symbol = res.data.ticker;
                              $scope.stock.name = res.data.name;
                              $scope.stock.last_price = res.data.last_price;
                              $scope.stock.can_be_added = res.data.can_be_added;
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

                      $scope.add = function() {
                        if($scope.stock != undefined && $scope.stock. symbol != '') {
                          stockService.addStockToPortfolio($scope.stock.symbol)
                            .then(function(res){
                              $scope.stock.error = null;
                              $scope.stock.message = res.data.response;
                              $scope.stock.name = null;
                              $scope.ticker = null;
                              $('#stock-list').load('my_portfolio.js');
                            }, function(err) {
                              $scope.stock = {};
                              $scope.stock.error = "Stock cannot be added.";
                            })
                        } else {
                          $scope.stock.error = "Stock cannot be added.";
                        }
                      }
                    }])
                    .controller('friendsController', ['$scope', 'friendService', function($scope, friendService) {
                      $scope.friends = {}

                      $scope.lookup = function() {
                        if($scope.friend_search_param != undefined && $scope.friend_search_param != '') {
                          friendService.searchFriends($scope.friend_search_param)
                            .then(function(res) {
                              $scope.friends.error = null;
                              $scope.friends.message = null;
                              $scope.friends.list = res.data;
                            }, function(err) {
                              $scope.friends = {};
                              $scope.friends.error = err.data.response;
                            }); 
                        } else {
                          $scope.friends = {};
                        }
                      }

                      $scope.add = function(friend_id) {
                        $scope.friends = {};

                        if(friend_id != undefined && friend_id != '') {
                          friendService.addFriend(friend_id)
                            .then(function(res) {
                              $scope.friends.error = null;
                              $scope.friends.message = res.data.response;
                              $scope.friend_search_param = null;
                              $("#friends-list").load('my_friends.js');
                            }, function(err) {
                              $scope.friends.error = err.data.response;
                            })
                        } else {
                          $scope.firends.error = "Friend cannot be added.";
                        }
                      }
                    }])