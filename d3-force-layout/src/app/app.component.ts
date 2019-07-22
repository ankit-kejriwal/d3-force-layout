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
    const links = [
      {source: 'Microsoft', target: 'Amazon', type: 'licensing'},
      {source: 'Microsoft', target: 'HTC', type: 'licensing'},
      {source: 'Samsung', target: 'Apple', type: 'suit'},
      {source: 'Motorola', target: 'Apple', type: 'suit'},
      {source: 'Nokia', target: 'Apple', type: 'resolved'},
      {source: 'HTC', target: 'Apple', type: 'suit'},
      {source: 'Kodak', target: 'Apple', type: 'suit'},
      {source: 'Microsoft', target: 'Barnes & Noble', type: 'suit'},
      {source: 'Microsoft', target: 'Foxconn', type: 'suit'},
      {source: 'Oracle', target: 'Google', type: 'suit'},
      {source: 'Apple', target: 'HTC', type: 'suit'},
      {source: 'Microsoft', target: 'Inventec', type: 'suit'},
      {source: 'Samsung', target: 'Kodak', type: 'resolved'},
      {source: 'LG', target: 'Kodak', type: 'resolved'},
      {source: 'RIM', target: 'Kodak', type: 'suit'},
      {source: 'Sony', target: 'LG', type: 'suit'},
      {source: 'Kodak', target: 'LG', type: 'resolved'},
      {source: 'Apple', target: 'Nokia', type: 'resolved'},
      {source: 'Qualcomm', target: 'Nokia', type: 'resolved'},
      {source: 'Apple', target: 'Motorola', type: 'suit'},
      {source: 'Microsoft', target: 'Motorola', type: 'suit'},
      {source: 'Motorola', target: 'Microsoft', type: 'suit'},
      {source: 'Huawei', target: 'ZTE', type: 'suit'},
      {source: 'Ericsson', target: 'ZTE', type: 'suit'},
      {source: 'Kodak', target: 'Samsung', type: 'resolved'},
      {source: 'Apple', target: 'Samsung', type: 'suit'},
      {source: 'Kodak', target: 'RIM', type: 'suit'},
      {source: 'Nokia', target: 'Qualcomm', type: 'suit'}
    ];

    const nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach((indLink) => {
      indLink.source = nodes[indLink.source] || (nodes[indLink.source] = {name: indLink.source});
      indLink.target = nodes[indLink.target] || (nodes[indLink.target] = {name: indLink.target});
    });

    const width = 960;
    const    height = 500;

    const force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-300)
        .on('tick', tick)
        .start();

    const svg = d3.select('.main').append('svg')
        .attr('width', width)
        .attr('height', height);

    const link = svg.selectAll('.link')
        .data(force.links())
      .enter().append('line')
      .style('fill', 'red')
      .style('stroke', '#666');

    const node = svg.selectAll('.node')
        .data(force.nodes())
      .enter().append('g')
        .attr('class', 'node')
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .call(force.drag);

    node.append('circle')
        .attr('r', 8);

    node.append('text')
        .attr('x', 12)
        .attr('dy', '.35em')
        .text((d) => d.name);

    function tick() {
      link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

      node
          .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
    }

    function mouseover() {
      d3.select(this).select('circle').transition()
          .duration(750)
          .attr('r', 16);
    }

    function mouseout() {
      d3.select(this).select('circle').transition()
          .duration(750)
          .attr('r', 8);
    }
  }
}
