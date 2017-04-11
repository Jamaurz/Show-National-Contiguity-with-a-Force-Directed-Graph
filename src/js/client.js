import '../style.sass';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let svg = d3.select("#root").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url, function(error, data) {
  if (error) throw error;
  
  const timeBase = d3.min(data, (d) => d.Seconds);
       
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((d, st) => {
      let info;
       if (d.Doping !== "") {
        info = d.Doping;
      } else {
        info = "No Doping Allegation";
      }
      return `<strong>${d.Name} - ${d.Nationality}</strong>
      <div><span>Year:${d.Year}, time:${d.Time}</span></div>
      <div>${info}</div>
    `});

  svg.call(tip);
  let timePlas = 10;
  let maxTime = d3.max(data, d => d.Seconds) + timePlas - timeBase;
  let minTime = d3.min(data, d => d.Seconds) - 20 - timeBase;
  let x = d3.scaleTime()
    .domain([maxTime, minTime])
    .range([0, width]);

  let y = d3.scaleLinear()
    .domain([1, data.length + 1])
    .range([0, height]);

  function timeSet(sec) {
    let time = new Date(1970, 0, 1); 
    time.setSeconds(sec);
    return d3.timeFormat("%M:%S")(time)
  }
  
  let xAxis = d3.axisBottom(x)
    .tickFormat(timeSet)
    .ticks(d3.timeMillisecond.every(30));
  
  let yAxis = d3.axisLeft(y)
    .ticks(8);
  
   svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  
  svg.append("g")
      .call(yAxis)
      .append("text")
      .attr("x", 0)
      .attr("y", 10)
      .attr("dy", "-2em")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Ranking")
      .attr('font-size', '1.4em')
      .style('fill', 'black');
 
   svg.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr('class', 'text')
    .attr('transform', 'translate(10, 5)')
    .text((d) => d.Name)
    .attr("x", (d) => x(d.Seconds - timeBase))
    .attr("y", (d) => y(d.Place))
  
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", (d) => x(d.Seconds - timeBase))
    .attr("cy", (d) => y(d.Place))
    .attr("fill", function(d) {
      if (d.Doping == "") {
        return "green";
      }
      return "lightgreen";
    })
    .on('mouseover', function(d) {
      d3.select(this).attr('fill', "orange");
      tip.show(d);
    })
    .on('mouseout', function(d) { 
      let color = (d.Doping == "") ? "green" :"lightgreen";
      d3.select(this).attr('fill', color);
      tip.hide(d);
    });
    // legend
  var legend = svg.selectAll(".legend")
      .data([{color: "green", text:"No doping allegations"}, {color: "lightgreen", text: "Riders with doping allegations"}])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0,"  +(i * 20 + 200) + ")"; });

  legend.append("circle")
      .attr("r", 5)
      .attr("cx", width - 10)
      .attr("cy", 12)
      .style("fill", (d) => d.color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d.text)
});