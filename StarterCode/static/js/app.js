//1. Use the D3 library to read in `samples.json`.
var jsonData;
d3.json("./samples.json").then(function(data) {
    jsonData = data
    console.log(jsonData);
    // Turning on the dropdown created in the first function below
    dropDown(jsonData.names)
});

 
//Creating the dropdown function
function dropDown(names){
    //finding the element by ID in the HTML
    var selector = d3.select("#selDataset")
    names.forEach(name => {
    selector.append("option")
    .text(name)
    .property("value", name);
    });
    optionChanged(names[0])
}

//Creating the OptionChange function found in HTML
function optionChanged(name){
    // Testing option change
    // console.log(name)
    buildCharts(name)  
    demographicData(name)
}

function buildCharts(name){
    
const chartData = jsonData.samples.filter(sample => sample.id === name)[0];
console.log(chartData)

var ids = chartData.otu_ids
var label = chartData.otu_labels
var values = chartData.sample_values

//2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
var barData = [
  {
    x: values.slice(0,10).reverse(),
    y: ids.map(id => "OTU" + id).slice(0,10).reverse(),
    type: 'bar',
    orientation: 'h'
  }
];

Plotly.newPlot('bar', barData);

//3. Create a bubble chart that displays each sample.

var bubbleData = [
  {
    x: ids,//.map(id => "OTU" + id),
    y: values,
    //type: 'scatter',
    mode: 'markers',
    marker: {
      color: ids,
      size: values
    }
  }
]
var layout = {
  title: 'OTUs',
  showlegend: false,
  xvalues: ids,
  yvalues: values,
  height: 700,
  width: 1000
};

Plotly.newPlot('bubble', bubbleData, layout);
};

//4. Inputting information into the Demographic Summary
function demographicData(name){
  const metaData = jsonData.metadata.filter(metadata => metadata.id == name)[0];
  console.log(metaData)
 
    //finding the element by ID in the HTML
    var selector = d3.select("#sample-metadata")
    selector.html('')
    Object.entries(metaData).forEach(([key, value])=>{
      var text = `${key}: ${value}`
      selector.append('p').text(text)
    })
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: metaData.wfreq,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 3], color: "yellow" },
            { range: [3, 5], color: "lightgreen" },
            { range: [5, 10], color: "darkgreen" }

          ],
          
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, layout);
}


