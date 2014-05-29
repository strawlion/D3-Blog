describe('scaleSetupService', function() {
    
    var scaleSetupService;
    var dataset;
    var xAccessor = function(data) { return data.x; }; 
    var yAccessor = function(data) { return data.y; };

    beforeEach(module('scaleSetup'));
    beforeEach(inject(function($injector) {
        scaleSetupService = $injector.get('scaleSetupService');

        dataset = [
                    [{x: 0, y: 5}, {x: 1, y: 3}],
                    [{x: 1, y: 2}, {x: 2, y: 0}]
                  ];
    }));


    it('should, given a nested array, get the x extent', function() {
        
        var expectedResult = [0, 2];
        var actualResult = scaleSetupService.getXDomain(dataset, xAccessor);
        expect(actualResult).toEqual(expectedResult);
    });

    it ('should, given a nested array, get the max y value', function() {

        var expectedResult = 5;
        var actualResult = scaleSetupService.getYMax(dataset, yAccessor);
        expect(actualResult).toEqual(expectedResult);
    });

});