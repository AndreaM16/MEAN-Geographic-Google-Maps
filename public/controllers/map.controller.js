'use strict';

angular
    .module('meanMapApp')
    .controller('MapController', MapController);

function MapController($scope, $http, $rootScope, geolocation, GoogleServiceFactory) {

    /** Variable Initialization **/
    var vm      = this;
    vm.formData = {};
    vm.coords   = {};

    /** Initializing Position Marker **/
    getCurrentLocation();

    /** Setting Position Marker on current position **/
    function getCurrentLocation() {
        geolocation.getLocation().then(function(data) {
            vm.currentLat  = vm.formData.latitude  = parseFloat(data.coords.latitude).toFixed(3);
            vm.currentLong = vm.formData.longitude = parseFloat(data.coords.longitude).toFixed(3);
        })
    }

    /** Gets coordinates based on mouse click on the map. When a click event is detected **/
    $rootScope.$on("clicked", function(){
        // Refreshes shown coordinates
        $scope.$apply(function(){
            vm.formData.latitude  = parseFloat(GoogleServiceFactory.clickLat).toFixed(3);
            vm.formData.longitude = parseFloat(GoogleServiceFactory.clickLong).toFixed(3);
        });
    });

    /** Creates a New Marker on submit **/
    vm.createPoint = function() {

        // Grabs all of the text box fields
        var userData = {
            name        : vm.formData.username,
            geo         : {
                            coordinates : [parseFloat(vm.formData.latitude), parseFloat(vm.formData.longitude)],
                            type        : 'Point'
            }
        };

        // Saves marker data to the db
        $http.post('/geometries', userData)
            .success(function() {
                // Once complete, clear the form (except location)
                vm.formData.username = "";
                // Refresh the map with new data
                GoogleServiceFactory.refresh(vm.currentLat, vm.currentLong);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}