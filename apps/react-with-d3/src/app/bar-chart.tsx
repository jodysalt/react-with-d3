import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Props {
  margin: { left: number; right: number; top: number; bottom: number };
  width: number;
  height: number;
  data?: { name: string; value: number }[];
}

function BarChart({ margin, width, height, data = [] }: Props) {
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const svgRef = useRef<SVGSVGElement>(null);
  const [ parts ] = useState<any>({});

  useEffect(() => {
    if (svgRef.current === null) return;

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, ({ value }: any) => value)])
      .range([graphHeight, 0]);

    const x = d3
      .scaleBand()
      .domain(data.map(({ name }) => name))
      .range([0, graphWidth])
      .paddingInner(0.3)
      .paddingOuter(0.2);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    if(!parts.body) parts.body = svg.append('g');
    parts.body
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    if(!parts.xAxis) parts.xAxis = parts.body.append('g');
    parts.xAxis
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${graphHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -5)
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-40)');

    if(!parts.yAxis) parts.yAxis = parts.body.append('g');
    parts.yAxis.attr('class', 'y axis').call(d3.axisLeft(y));

    const rects = parts.body.selectAll('rect').data(data);

    rects.exit().remove();

    rects
      .attr('y', ({ value }: any) => y(value))
      .attr('x', ({ name }: any) => x(name) || 0)
      .attr('width', x.bandwidth())
      .attr('height', ({ value }: any) => graphHeight - y(value));

    rects
      .enter()
      .append('rect')
      .attr('y', ({ value }: any) => y(value))
      .attr('x', ({ name }: any) => x(name) || 0)
      .attr('width', x.bandwidth())
      .attr('height', ({ value }: any) => graphHeight - y(value))
      .attr('fill', 'grey');

    console.log(data);

  }, [svgRef, data]);

  return <svg ref={svgRef} />;
}

export default BarChart;
