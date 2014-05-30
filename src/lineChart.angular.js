angular.module('customCharts.line', ['scaleSetup'])
.factory('lineChart', function(scaleSetupService) {

    // Data format
    /*
        [ 
            [{ x: , y: }, { x: , y: }], Line One
            [{ x: , y: }, { x: , y: }]  Line Two
        ]
    */
    return function() {
        
        // Private Variables
        var chartWidth  = 400;
        var chartHeight = 200;

        var xAccessor = function(data) { return data.x; };
        var yAccessor = function(data) { return data.y; }; 

        var xScale     = d3.scale.linear();
        var yScale     = d3.scale.linear();
        var colorScale = d3.scale.category10();

        var line = d3.svg.line().x(X).y(Y);


        function chart(selection) {

            selection.each(function(data) {

                // Update x scale
                var xDomain = scaleSetupService.getDomain(data, xAccessor);
                
                xScale
                .domain(xDomain)
                .range([0, chartWidth]);


                // Update y scale
                var yMax = scaleSetupService.getMaxValue(data, yAccessor);

                yScale
                .domain([0, yMax])
                .range([chartHeight, 0]);


                var chartContainerData = d3.select(this).selectAll('svg.chartContainer').data([data]);

                // Create containers if they don't exist
                var chartContainer = chartContainerData.enter().append('svg').attr('class', 'chartContainer');
                var lineContainer  = chartContainer.append('g').attr('class', 'lineContainer');

                if (chartContainer.empty()) {
                    chartContainer = d3.select(this).selectAll('svg.chartContainer');
                    lineContainer  = chartContainer.selectAll('g.lineContainer');
                }

                chartContainer.attr('width',  chartWidth)
                              .attr('height', chartHeight); 


                // Perform the data join
                var lineData = lineContainer.selectAll('path.line')
                                            .data(data);

                // Update
                lineData.attr('d', line);

                // Enter
                lineData.enter()
                    .append('path')
                        .attr('class', 'line')
                        .attr('d', line)
                        .attr('fill', 'none')
                        .attr('stroke', function(data, index) {
                            return colorScale(index);
                        });

                // Exit
                lineData.exit()
                        .remove();
            });
        }


        // Accessor functions for our line
        function X(data) {
            var xValue = xAccessor(data);
            return xScale(xValue);
        }

        function Y(data) {
            var yValue = yAccessor(data);
            return yScale(yValue);
        }

        // Public Variables/ (Getters and Setters)
       chart.width = function(newWidth) {
            if (!arguments.length) return chartWidth;
            chartWidth = newWidth;
            
            return this;
        };

        chart.height = function(newHeight) {
            if (!arguments.length) return chartHeight;
            chartHeight = newHeight;
            
            return this;
        };


        chart.xAccessor = function(newXAccessor) {
            if (!arguments.length) return xAccessor;
            xAccessor = newXAccessor;

            return this;
        };

        chart.yAccessor = function(newYAccessor) {
            if (!arguments.length) return yAccessor;
            yAccessor = newYAccessor;

            return this;
        };

        return chart;
    }

});