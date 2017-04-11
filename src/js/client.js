import '../style.sass';

const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    chart = d3.select("#chart"),
    width = parseInt(chart.style("width")),
    height = parseInt(chart.style("height")),
    tooltip = d3.select("#d3-tip");

const svg = chart.append("svg")
    .attr("width", width)
    .attr("height", height);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(50).strength(0.5))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("y", d3.forceY(height/ 2))
    .force("x", d3.forceX(width/2))
    .force("size", d3.forceCollide(10).strength(0.5))
;
d3.json(url, function(error, graph) {
  if (error) throw error;
  
  const link = svg.append("g")
      .attr("class", "links")
      .selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
  ;

  const node = chart.append("g")
    .attr('class', 'img')
    .selectAll(".node")
    .data(graph.nodes)
    .enter().append("image")
    .on('mouseover', tipShow)
    .on('mouseout', tipHide)
    .attr("class", function(d) { return "node flag flag-" + d.code})
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
     ); 
;

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked)
  ;

  simulation.force("link")
      .links(graph.links)
  ;

  function ticked() {
    link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    ;

    node
        .style("left", (d) => { return (d.x - 5) + "px"; })
        .style("top", (d) => { return (d.y - 5) + "px"; })
    ;
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function tipShow(d) {
  tooltip.style("display", "block")
    .text(d.country)
    .style("left", (d.x + 25) + "px")
    .style("top", (d.y - 25) + "px");
}

function tipHide(d) {
  tooltip.style("display", "none");
}