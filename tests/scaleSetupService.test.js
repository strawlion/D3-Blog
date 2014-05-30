describe('scaleSetupService', function() {
    
    var scaleSetupService;
    var dataset;
    var xAccessor = function(data) { return data.x; }; 
    var yAccessor = function(data) { return data.y; };

    beforeEach(module('customCharts.scaleSetup'));
    beforeEach(inject(function($injector) {
        scaleSetupService = $injector.get('scaleSetupService');

        dataset = [
                    [{x: 0, y: 5}, {x: 1, y: 3}],
                    [{x: 1, y: 2}, {x: 2, y: 0}]
                  ];
    }));


    it('should, given a nested array, get the domain', function() {
        
        var expectedResult = [0, 2];
        var actualResult = scaleSetupService.getDomain(dataset, xAccessor);
        expect(actualResult).toEqual(expectedResult);
    });

    it ('should, given a nested array, get the max value', function() {

        var expectedResult = 5;
        var actualResult = scaleSetupService.getMaxValue(dataset, yAccessor);
        expect(actualResult).toEqual(expectedResult);
    });

});