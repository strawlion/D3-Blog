angular.module('scaleSetup', [])
.service('scaleSetupService', function() {

    return {
        getXDomain: getXDomain,
        getYMax: getYMax
    };

        function getXDomain(data, xAccessor) {

            var xValues = [];

            data.forEach(function(lineData) {
                lineData.forEach(function(lineValue) {
                    var xValue = xAccessor(lineValue);
                    xValues.push(xValue);
                });
            });

            return d3.extent(xValues);
        }

        function getYMax(data, yAccessor) {
            var yMax = d3.max(data, function(lineData) {
                return d3.max(lineData, yAccessor);
            });
            
            return yMax;       
        }

});