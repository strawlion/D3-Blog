describe('lineChart', function() {


// Data format
/*
    [ 
        [{ x: , y: }, { x: , y: }], // Line One
        [{ x: , y: }, { x: , y: }]  // Line Two
    ]
*/
    var chartService;
    var lineChart;
    var dataset;
    var chartContainer;

    beforeEach(module('lineChart'));
    beforeEach(module('customCharts'));
    beforeEach(inject(function($injector) {
        dataset = [
                     [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }]
                   ];

        chartService = $injector.get('chartService');
        lineChart    = chartService.lineChart();
        chartContainer = d3.select('body')
                            .append('div')
                            .attr('class', 'testContainer');
    }));

    // We want a fresh chart container after every test
    afterEach(function() {
        chartContainer.remove();
    });


    it('should provide getters and setters', function() {
        var defaultChartWidth  = lineChart.width();
        var defaultChartHeight = lineChart.height(); 

        lineChart.width(100)
                 .height(50);

        var newChartWidth  = lineChart.width();
        var newChartHeight = lineChart.height();


        expect(defaultChartWidth).not.toBe(100);
        expect(defaultChartHeight).not.toBe(50);
        expect(newChartWidth).toBe(100);
        expect(newChartHeight).toBe(50);
    });


    it('should render a chart with minimal requirements', function() {
        
        chartContainer.datum(dataset)
                      .call(lineChart);

        var lineContainer = chartContainer.selectAll('svg.chartContainer');
        var line          = lineContainer.selectAll('path.line');

        expect(lineContainer.empty()).not.toBe(true);
        expect(line.empty()).not.toBe(true);
    });


    it('should redraw the chart with updated attributes', function() {
        lineChart.width(100);
        
        chartContainer.datum(dataset)
                      .call(lineChart);

        lineChart.width(200);
        chartContainer.call(lineChart);

        var lineChartContainer      = chartContainer.select('svg.chartContainer');
        var lineChartContainerWidth = parseInt(lineChartContainer.attr('width'));
        expect(lineChartContainerWidth).not.toEqual(100);
        expect(lineChartContainerWidth).toEqual(200);
    });


    it('should update a chart with new data', function() {
        chartContainer.datum(dataset)
                      .call(lineChart);

        var firstChartDataset = chartContainer.select('g.lineContainer').datum();
        var firstChartLine    = chartContainer.selectAll('path.line');
        var firstLineDataset  = firstChartLine.datum();
        var firstLineData     = firstChartLine.attr('d');

        var secondDataset = [
                                [{ x: 0, y: 3  }, { x: 1, y: 2  }, { x: 2, y: 1  }]
                            ];

        chartContainer.datum(secondDataset)
                      .call(lineChart);

        var secondChartDataset  = chartContainer.select('g.lineContainer').datum();
        var secondChartLine     = chartContainer.selectAll('path.line');
        var secondLineDataset   = secondChartLine.datum();
        var secondLineData      = secondChartLine.attr('d');
        

        // Check if lineContainer data was updated
        expect(firstChartDataset).toBe(dataset);
        expect(secondChartDataset).toBe(secondDataset);

        // Check if lines themselves have been updated
        expect(firstLineDataset).toBe(dataset[0]);
        expect(secondLineDataset).toBe(secondDataset[0]);

        // Check if the actual drawing is different
        expect(firstLineData).not.toEqual(secondLineData);
    });


    it('should render two charts with distinct configurations', function() {
        chartContainer.append('div')
                      .datum(dataset)
                      .call(lineChart);


        var secondDataset = [
                                [{ x: 1, y: 3  }, { x: 2, y: 2  }, { x: 3, y: 1  }]
                            ];
        var secondLineChart = chartService.lineChart()
                                          .width(20000)
                                          .height(10000);

        chartContainer.append('div')
                      .datum(secondDataset)
                      .call(secondLineChart);

        var charts = chartContainer.selectAll('.chartContainer');

        expect(charts.size()).toBe(2);
        expect(secondLineChart.width()).not.toBe(lineChart.width());
    });


    it('should draw a line for each line data array in the dataset', function() {
        var multiDataset = [ 
                             [{ x: 1, y: 20}, { x: 2, y: 40 }, { x: 3, y: 10}, {x: 4, y: 35 }],
                             [{ x: 1, y: 23}, { x: 2, y: 43 }, { x: 3, y: 13}, {x: 4, y: 38 }], 
                             [{ x: 1, y: 26}, { x: 2, y: 46 }, { x: 3, y: 16}, {x: 4, y: 41 }]
                           ];

        chartContainer.datum(multiDataset)
                      .call(lineChart);

        var lines = chartContainer.select('g.lineContainer').selectAll('path.line');
        var lineOneData   = d3.select(lines[0][0]).datum();
        var lineTwoData   = d3.select(lines[0][1]).datum();
        var lineThreeData = d3.select(lines[0][2]).datum();

        expect(lines.size()).toBe(3);
        expect(lineOneData).toBe(multiDataset[0]);
        expect(lineTwoData).toBe(multiDataset[1]);
        expect(lineThreeData).toBe(multiDataset[2]);               
    });

   it('should redraw every line correctly when drawing with new data', function() {
        var firstMultiDataset = [ 
                                    [{ x: 1, y: 20}, { x: 2, y: 40 }, { x: 3, y: 10}, {x: 4, y: 35 }],
                                    [{ x: 1, y: 23}, { x: 2, y: 43 }, { x: 3, y: 13}, {x: 4, y: 38 }], 
                                    [{ x: 1, y: 26}, { x: 2, y: 46 }, { x: 3, y: 16}, {x: 4, y: 41 }]
                                ];

        chartContainer.datum(firstMultiDataset)
                      .call(lineChart);

        var firstChartLines         = chartContainer.select('g.lineContainer').selectAll('path.line');
        var firstChartLineOneData   = d3.select(firstChartLines[0][0]).attr('d');
        var firstChartLineTwoData   = d3.select(firstChartLines[0][1]).attr('d');
        var firstChartLineThreeData = d3.select(firstChartLines[0][2]).attr('d');


        var secondMultiDataset = [ 
                                    [{ x: 1, y: 2  }, { x: 2, y: 4   }, { x: 3, y: 1},   {x: 4, y: 3.5 }],
                                    [{ x: 1, y: 2.3}, { x: 2, y: 4.3 }, { x: 3, y: 1.3}, {x: 4, y: 3.8 }], 
                                    [{ x: 1, y: 2.6}, { x: 2, y: 4.6 }, { x: 3, y: 1.6}, {x: 4, y: 4.1 }]
                                 ];

        chartContainer.datum(secondMultiDataset)
                      .call(lineChart);

        var secondChartLines        = chartContainer.select('g.lineContainer').selectAll('path.line');
        var secondChartLineOneData   = d3.select(secondChartLines[0][0]).attr('d');
        var secondChartLineTwoData   = d3.select(secondChartLines[0][1]).attr('d');
        var secondChartLineThreeData = d3.select(secondChartLines[0][2]).attr('d');


        expect(secondChartLines.size()).toBe(3);
        expect(firstChartLineOneData).not.toEqual(secondChartLineOneData);
        expect(firstChartLineTwoData).not.toEqual(secondChartLineTwoData);
        expect(firstChartLineThreeData).not.toEqual(secondChartLineThreeData);
    });

    it('should render a chart for each dataset', function() {
        var datasets = [ 
                         [
                            [{ x: 1, y: 20}, { x: 2, y: 40 }, { x: 3, y: 10}, {x: 4, y: 35 }]
                         ],
                         [
                            [{ x: 1, y: 23}, { x: 2, y: 43 }, { x: 3, y: 13}, {x: 4, y: 38 }]
                         ], 
                         [
                            [{ x: 1, y: 26}, { x: 2, y: 46 }, { x: 3, y: 16}, {x: 4, y: 41 }]
                         ]
                       ];

        chartContainer.selectAll('div.testContainer')
                      .data(datasets)
                    .enter().append('div')
                      .attr('class', 'testContainer')
                      .call(lineChart);


        var charts = chartContainer.selectAll('.chartContainer');
        var chartOneData   = d3.select(charts[0][0]).datum();
        var chartTwoData   = d3.select(charts[0][1]).datum();
        var chartThreeData = d3.select(charts[0][2]).datum();

        expect(charts[0].length).toBe(datasets.length);
        expect(chartOneData).toBe(datasets[0]);
        expect(chartTwoData).toBe(datasets[1]);
        expect(chartThreeData).toBe(datasets[2]);
    });


});