// Function to grab ID names
function buildMetadata(sample){
    // Json Name
    d3.json('samples.json').then((data) =>
        {
            //location of ID demographic information
            metadata = data.metadata;
            results = metadata.filter(object => object.id == sample)
            array = results[0]
            
            // Build Demographic Information
            panel = d3.select("#sample-metadata")
            panel.html("")
            Object.entries(array).forEach(([x, y])=>{
                panel.append("h6").text(`${x}: ${y}`)
            });
        }
    );
}

// Function to build all Charts
function buildCharts(sample){
    // Json Name
    d3.json('samples.json').then((data) =>
        {
            // location of ID data
            samples = data.samples;
            results = samples.filter(object => object.id == sample)
            array = results[0]
            panel = d3.select("#sample-metadata")
            
            // location of ID names, used for gauge
            metadata = data.metadata;
            metaResults = metadata.filter(object => object.id == sample)
            metaArray = metaResults[0]

            // Variables used for graphs
            ids = array.otu_ids;
            values = array.sample_values;
            label = array.otu_labels;
            wash = metaArray.wfreq;

            // Bubble Chart
            traceBubble = {
                x: ids,
                y: values,
                text: label,
                mode: 'markers',
                marker: {
                    color: ids,
                    size: values
                }
            };

            data = [traceBubble]
            layoutbubble = {
                width: 1200,
                height: 500,
                xaxis: {
                    title: 'OTU ID'
                }
            }

            Plotly.newPlot('bubble', data, layoutbubble)


            // Bar Chart
            let layoutBar = [{
                y: ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
                x: values.slice(0, 10).reverse(),
                text: label.slice(0, 10).reverse(),
                type: "bar",
                orientation: 'h'
            }];

            Plotly.newPlot('bar', layoutBar)
            


            // Gauge Chart
            traceGauge = [
                {
                    domain: ids,
                    value: wash,
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: {range: [null, 10]},
                        steps: [
                            {range: [0,2], color: "red"},
                            {range: [2,4], color: "orange"},
                            {range: [4,6], color: "Yellow"},
                            {range: [6,8], color: "lightgreen"},
                            {range: [8,10], color: "green"}
                        ],
                        bar: {color: 'Black'}
                    }
                }
            ];

            layoutgauge = {
                title: {
                    text: 'Belly Button Washing Frequency', 
                    font: {size: 20}
                }
            }

            Plotly.newPlot('gauge', traceGauge, layoutgauge)
        }
    );
}


// Selection function
function init() {
    x = d3.select("#selDataset");

    d3.json('samples.json').then((data) =>
        {
            names = data.names;
            results =  names.forEach((object) => {
                x.append('option').text(object).property('value', object);
            });

            const y = names[0];
            buildCharts(y);
            buildMetadata(y);
        }
    );   
}
// Fetch new data each time a new sample is selected
function optionChanged(newSample) {

    buildCharts(newSample);
    buildMetadata(newSample);
}

init();