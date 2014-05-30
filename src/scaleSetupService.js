angular.module('customCharts.scaleSetup', [])
.service('scaleSetupService', function() {

    // This service provides utility methods to operate on nested arrays
    // Ex:
    // [
    //   [{ x: 0, y: 5 }, { x: 1, y: 2 }],
    //   [{ x: 0, y: 1 }, { x: 1, y: 3 }]
    // ]

    return {
        getDomain:   getDomain,
        getMaxValue: getMaxValue
    };


    // Gets the extent of the values returned from the accessor
    // function in the dataset
    function getDomain(dataset, valueAccessor) {

        var dataPointValues = [];
        dataset.forEach(function(dataArray) {
            dataArray.forEach(function(dataPoint) {
                var value = valueAccessor(dataPoint);
                dataPointValues.push(value);
            });
        });

        return d3.extent(dataPointValues);
    }

    // Gets the max value returned from the accessor function 
    // in the dataset
    function getMaxValue(dataset, valueAccessor) {

        var maxValue = d3.max(dataset, function(dataArray) {
            return d3.max(dataArray, valueAccessor);
        });
        
        return maxValue;       
    }


});