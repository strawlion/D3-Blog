angular.module('customCharts', ['customCharts.line'])
.service('chartService', function(lineChart) {

   return {
        lineChart: lineChart
   };

});