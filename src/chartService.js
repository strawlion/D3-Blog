angular.module('customCharts', ['lineChart'])
.service('chartService', function(lineChart) {

   return {
        lineChart: lineChart
   };

});