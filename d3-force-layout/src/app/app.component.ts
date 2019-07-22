import { Component, OnInit } from '@angular/core';
declare var d3: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'd3-force-layout';

  ngOnInit() {
    const margin = {
      top: 20,
      bottom: 0,
      right: 0,
      left: 0
    };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Load Color Scale
    const c10 = d3.scale.category10();
    // Create an SVG element and append it to the DOM
    const svgElement = d3.select('.main')
      .append('svg').attr({ 'width': width + margin.left + margin.right, 'height': height + margin.top + margin.bottom })
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // Load External Data
    d3.json('/assets/GOT_DATA.json',  (dataset) => {
      // Extract data from dataset
      const nodes = dataset.nodes;
      const  links = dataset.links;
      // Create Force Layout
      const force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .gravity(0.05)
        .charge(-200)
        .linkDistance(200);
      // Add links to SVG
      const link = svgElement.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', (d) =>  d.weight / 10)
        .style('stroke', '#ccc');
      // Add nodes to SVG
      const node = svgElement.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(force.drag);
      // Add labels to each node
      const label = node.append('text')
        .attr('dx', 12)
        .attr('dy', '0.35em')
        .attr('font-size', (d) => d.influence * 1.5 > 9 ? d.influence * 1.5 : 9)
        .text( (d) => d.character);
      // Add circles to each node
      const circle = node.append('circle')
        .attr('r',  (d) => d.influence / 2 > 5 ? d.influence / 2 : 5)
        .attr('fill',  (d) => c10(d.zone * 10));
      // This function will be executed for every tick of force layout
      force.on('tick',  () => {
        // Set X and Y of node
        node.attr('r',  (d) => d.influence)
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y);
        // Set X, Y of link
        link.attr('x1',  (d) => d.source.x);
        link.attr('y1',  (d) => d.source.y);
        link.attr('x2',  (d) => d.target.x);
        link.attr('y2',  (d) => d.target.y);
        // Shift node a little
        node.attr('transform',  (d) => 'translate(' + d.x + ',' + d.y + ')');
      });
      // Start the force layout calculation
      force.start();
    });
  }
}
