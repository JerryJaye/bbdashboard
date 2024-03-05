// URL to the dataset
const datasetUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Verify the data structure and accessibility
d3.json(datasetUrl).then(data => {
    createDropdownMenu(data.samples);
    const currentSampleId = data.samples[0].id;
    // Verify currentSampleID
       
    });

    // Function creatDropdownMenu.
function createDropdownMenu(samples) {
    let dropdownMenu = d3.select("#selDataset");
    samples.forEach(sample => {
        dropdownMenu.append("option").text(sample.id).property("value", sample.id);
})};

// Function - updatevisualisations
function updateVisualizations(sampleId, data) {
    updateBarChart(sampleId, data);
    updateBubbleChart(sampleId, data);
    updateMetadata(sampleId, data);
    updateBellyButtonWash(sampleId,data)
}
 
// Function - updateBarChart.
function updateBarChart(sampleId, data) {
    d3.json(datasetUrl).then(data => {
        const samples = data.samples;
        const resultArray = samples.filter(sample => sample.id == sampleId);
        const result = resultArray[0];
             
        const otu_ids = result.otu_ids;
        const otu_labels = result.otu_labels;
        const sample_values = result.sample_values;
        
        // Trace for the bar chart
        var trace = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

      //  var data = [trace];
        var layout = {
            title: "Top 10 OTUs Found",
            height: 450,
            width: 600,
            showlegend: false
        };
        Plotly.newPlot("bar", [trace], layout);
    });
}

// Function- update Bubble Chart
function updateBubbleChart(sampleId, data) {
    d3.json(datasetUrl).then(data => {
        // Find the selected sample from the samples array
        const selectedSample = data.samples.find(sample => sample.id === sampleId);
        
        if (!selectedSample) {
            console.error("Sample ID not found:", sampleId);
            return; // Exit the function if the sample ID is not found
        }
        
        // Extract data for plotting: otu_ids, sample_values, and otu_labels
        const otu_ids = selectedSample.otu_ids;
        const sample_values = selectedSample.sample_values;
        const otu_labels = selectedSample.otu_labels;
        
        // Now, use the extracted data to create a trace for the bubble chart

        var trace = {
            x: otu_ids, // Data for the X-axis
            y: sample_values, // Data for the Y-axis
            text: otu_labels, // Hover text
            mode: 'markers',
            marker: {
                size: sample_values.map(value => value * 0.75), // Marker size
                color: otu_ids, // Marker color
                colorscale: 'Earth'
        }
    };
    var layout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
        height: 400,
        width: 1200,
        showlegend: false
        };
     Plotly.newPlot('bubble', [trace], layout);
    });
}

// Function updateMetadata
function updateMetadata(sampleId, data) {
    d3.json(datasetUrl).then(data => {
        const metadata = data.metadata;
        const result = metadata.find(meta => meta.id.toString() === sampleId);
        
        // Select the metadata display area
        const displayArea = d3.select("#sample-metadata");

        // Clear existing metadata
        displayArea.html("");

        // Append new metadata
        Object.entries(result).forEach(([key, value]) => {
            displayArea.append("p").text(`${key}: ${value}`);
        });
    })
}

function updateBellyButtonWash(sampleId, data) {
        // Find the metadata object for the given sampleId
    d3.json(datasetUrl).then(data => {
        // Find the metadata object for the given sampleId
        const sampleMetadata = data.metadata.find(meta => meta.id.toString() === sampleId);

        // Proceed only if metadata is found
        if (sampleMetadata) {
            const wfreqValue = sampleMetadata.wfreq;

            // Gauge chart data and layout
            const gaugeData = [{
                type: "indicator",
                mode: "gauge+number",
                value: wfreqValue,
                title: { text: "Belly Button Wash Frequency<br><span style='font-size:0.8em;color:gray'>Scrubs per Week</span>" },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "red" },
                    steps: [
                        { range: [0, 1], color: "#f8f3ec" },
                        { range: [1, 2], color: "#f4f1e4" },
                        { range: [2, 3], color: "#e9e6c9" },
                        { range: [3, 4], color: "#e2e4b1" },
                        { range: [4, 5], color: "#d5e49d" },
                        { range: [5, 6], color: "#b7cc92" },
                        { range: [6, 7], color: "#8cbf88" },
                        { range: [7, 8], color: "#8abb8f" },
                        { range: [8, 9], color: "#85b48a" }
                    ],
                }
            }];

            const layout = {
                width: 600,
                height: 450,
                margin: { t: 0, b: 0 }
            };

            // Render the gauge chart in the 'gauge' div
            Plotly.newPlot('gauge', gaugeData, layout);
        } else {
            console.error('Metadata not found for sampleId:', sampleId);
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

// First Pass Visualistation
d3.json(datasetUrl).then(data => {
    const currentSampleId = data.samples[0].id;
        updateVisualizations(currentSampleId, data);
});

// Subsequent Passes Visualisation
d3.select("#selDataset").on("change", function() {
    const selectedSampleId = d3.select(this).property("value");
        updateVisualizations(selectedSampleId);
});
