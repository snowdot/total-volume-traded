import React, { useRef, useEffect, useState } from 'react';
import './Chart.css';
import * as d3 from 'd3';
import data from '../data/volumes.json';

const getBrowserVisibilityProp = () => {
    if (typeof document.hidden !== 'undefined') {
        return 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        return 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        return 'webkitvisibilitychange';
    }
}

const getBrowserDocumentHiddenProp = () => {
    if (typeof document.hidden !== 'undefined') {
        return 'hidden';
    } else if (typeof document.msHidden !== 'undefined') {
        return 'msHidden';
    } else if (typeof document.webkitHidden !== 'undefined') {
        return 'webkitHidden';
    }
}

const getIsDocumentHidden = () => {
    return !document[getBrowserDocumentHiddenProp()];
}

const Chart = ({ value, price, setTotal }) => {
    const svgRef = useRef(null);
    const [isVisible, setIsVisible] = useState(getIsDocumentHidden());

    useEffect(() => {
        const visibilityChange = getBrowserVisibilityProp();

        document.addEventListener(visibilityChange, onVisibilityChange, false);

        return () => {
            document.removeEventListener(visibilityChange, onVisibilityChange)
        }    
    });

    useEffect(() => {
        const volumes = data.map(elem => (Number(elem.AMOUNT_IN_ETH) + Number(elem.AMOUNT_OUT_ETH)) / Math.pow(10, 18));
        const TOTAL_VOLUME = volumes.reduce((acc, cur) => acc + cur, 0);
        const DATA = [];

        data.forEach(elem => {
            const volume = (Number(elem.AMOUNT_IN_ETH) + Number(elem.AMOUNT_OUT_ETH)) / Math.pow(10, 18)
            DATA.push({
                ...elem,
                VOLUME_ETH: volume,
                VOLUME_USD: volume * price,
                percent: volume / TOTAL_VOLUME
            });
        });

        const outerWidth = 720;
        const outerHeight = 360;
        const supportWidth = 16;
        const supportMargin = outerWidth * 0.12;
        const supportHeight = 40;
        const supportTop = 20;
        const margin = {
            top: supportHeight + 4,
            left: supportMargin + supportWidth * 4 + 20,
            bottom: (outerHeight - 274) - supportHeight - 2 - 4,
            right: supportMargin + supportWidth * 4
        };
        const innerWidth = outerWidth - margin.left - margin.right;
        const innerHeight = outerHeight - margin.top - margin.bottom;
        const paddingInner = 0.1;
        const duration = 1000;
        const colors = ['#9467bd','#bcbd22','#e377c2','#ff7f0e','#17becf'];
        const bgColor = '#F3F7F9';
        const darkColor = 'black';
        const lightColor = 'white';
        const strokeWidth = 4;
        const radius = 6;
        const circleR = 4;
        const million = 1000000;
        const billion = 1000000000;

        d3.selectAll('*').interrupt();
        d3.selectAll('.particle').remove();

        const xScale = d3.scaleBand()
            .range([0, innerWidth])
            .domain(DATA.map(d => d.PAIR))
            .paddingInner(paddingInner);

        const yScale = d3.scaleLinear()
            .range([innerHeight, 0])
            .nice();

        if(value === 'percent') {
            yScale.domain([0, 100]);
            setTotal('Total');
        } else if(value === 'eth') {
            yScale.domain([0, 10]);
            setTotal(`${DATA.reduce((acc, cur) => acc + cur.VOLUME_ETH / million, 0).toFixed(1)}M`);
        } else {
            yScale.domain([0, 10]);
            setTotal(`${DATA.reduce((acc, cur) => acc + cur.VOLUME_USD / billion, 0).toFixed(1)}B`);
        }

        const svg = d3.select(svgRef.current)
            .data([null])
            .join('svg')
                .classed('chart', true)
                .attr('width', outerWidth)
                .attr('height', outerHeight);

        const g = svg.selectAll('g')
            .data([null])
            .join('g')
                .classed('group', true)
                .attr('transform', `translate(${margin.left},${margin.top})`);
    
        svg.selectAll('.support1')
            .data([null])
            .join('rect')
                .classed('support1', true)
                .attr('x', supportMargin + supportWidth)
                .attr('y', margin.top)
                .attr('rx', radius)
                .attr('width', supportWidth)
                .attr('height', outerHeight)
                    .style('fill', lightColor)
                    .style('stroke', darkColor)
                    .style('stroke-width', strokeWidth);

        svg.selectAll('.support2')
            .data([null])
            .join('rect')
                .classed('support2', true)
                .attr('x', outerWidth - supportWidth - supportMargin - supportWidth)
                .attr('y', margin.top)
                .attr('rx', radius)
                .attr('width', supportWidth)
                .attr('height', outerHeight)
                    .style('fill', lightColor)
                    .style('stroke', darkColor)
                    .style('stroke-width', strokeWidth);

        svg.selectAll('.support3')
            .data([null])
            .join('rect')
                .classed('support3', true)
                .attr('x', supportMargin)
                .attr('y', margin.top + supportTop)
                .attr('rx', 2)
                .attr('width', outerWidth - supportMargin * 2)
                .attr('height', supportWidth / 3)
                    .style('fill', lightColor)
                    .style('stroke', darkColor)
                    .style('stroke-width', strokeWidth);

        svg.selectAll('.support4')
            .data([null])
            .join('rect')
                .classed('support4', true)
                .attr('x', supportMargin)
                .attr('y', outerHeight - supportHeight - strokeWidth / 2)
                .attr('rx', radius * 2)
                .attr('width', outerWidth - supportMargin * 2)
                .attr('height', supportHeight + 20)
                    .style('fill', lightColor)
                    .style('stroke', darkColor)
                    .style('stroke-width', strokeWidth);

        svg.selectAll('.support5')
            .data([null])
            .join('circle')
                .classed('support5', true)
                .attr('cx', supportMargin + supportWidth + supportWidth / 2)
                .attr('cy', margin.top + supportTop + supportWidth / 2)
                .attr('r', circleR)
                    .style('fill', 'transparent');

        svg.selectAll('.support6')
            .data([null])
            .join('circle')
                .classed('support6', true)
                .attr('cx', outerWidth - supportWidth - supportMargin - supportWidth + supportWidth / 2)
                .attr('cy', margin.top + supportTop + supportWidth / 2)
                .attr('r', circleR)
                    .style('fill', 'transparent');

        svg.selectAll('.surface1')
            .data([null])
            .join('rect')
                .classed('surface1', true)
                .attr('x', 0)
                .attr('y', outerHeight - strokeWidth)
                .attr('rx', radius)
                .attr('width', 20)
                .attr('height', strokeWidth)
                    .style('fill', darkColor)

        svg.selectAll('.surface2')
            .data([null])
            .join('rect')
                .classed('surface2', true)
                .attr('x', 24)
                .attr('y', outerHeight - strokeWidth)
                .attr('rx', radius)
                .attr('width', 4)
                .attr('height', strokeWidth)
                    .style('fill', darkColor);

        svg.selectAll('.surface3')
            .data([null])
            .join('rect')
                .classed('surface3', true)
                .attr('x', 32)
                .attr('y', outerHeight - strokeWidth)
                .attr('rx', radius)
                .attr('width', outerWidth - 40)
                .attr('height', strokeWidth)
                    .style('fill', darkColor);

        svg.selectAll('.surface4')
            .data([null])
            .join('rect')
                .classed('surface4', true)
                .attr('x', outerWidth - 4)
                .attr('y', outerHeight - strokeWidth)
                .attr('rx', radius)
                .attr('width', 4)
                .attr('height', strokeWidth)
                    .style('fill', darkColor);

        g.selectAll('.bar')
            .data(DATA)
            .join('rect')
                .classed('bar', true)
                .attr('x', d => xScale(d.PAIR))
                .attr('rx', 2.5)
                .attr('width', (d, i) => 44)
                .attr('y', outerHeight)
                .attr('height', (d, i) => {
                    if(value === 'percent') {
                        return innerHeight - yScale(d.VOLUME_ETH / TOTAL_VOLUME * 100);
                    } else if(value === 'eth') {
                        return innerHeight - yScale(d.VOLUME_ETH / million);
                    } else {
                        return innerHeight - yScale(d.VOLUME_USD / billion);
                    }
                })
                .style('fill', (d, i) => colors[i])
            .transition()
                .duration(duration)
                .ease(d3.easePolyOut)
                .attr('y', (d, i) => {
                    if(value === 'percent') {
                        return yScale(d.VOLUME_ETH / TOTAL_VOLUME * 100) - 15;
                    } else if(value === 'eth') {
                        return yScale(d.VOLUME_ETH / million) - 13;
                    } else {
                        return yScale(d.VOLUME_USD / billion) - 13;
                    }
                });

        g.selectAll('.tube-left')
            .data(DATA)
            .join('path')
                .classed('tube-left', true)
                .attr('d', (d, i) => `M ${xScale(d.PAIR)} 0 ${xScale(d.PAIR)} 240`)
                .style('fill', 'transparent')
                .style('stroke', darkColor)
                .style('stroke-width', strokeWidth);

        g.selectAll('.tube-right')
            .data(DATA)
            .join('path')
                .classed('tube-right', true)
                .attr('d', (d, i) => `M ${xScale(d.PAIR) + 44} 0 ${xScale(d.PAIR) + 44} 240`)
                .style('fill', 'transparent')
                .style('stroke', darkColor)
                .style('stroke-width', strokeWidth);

        g.selectAll('.tube-bot')
            .data(DATA)
            .join('path')
                .classed('tube-bot', true)
                .attr('d', (d, i) => `M ${xScale(d.PAIR)} 240 C ${xScale(d.PAIR)} 270, ${xScale(d.PAIR) + 44} 270, ${xScale(d.PAIR) + 44} 240`)
                .style('fill', 'transparent')
                .style('stroke', darkColor)
                .style('stroke-width', strokeWidth);
                
        g.selectAll('.overlay')
            .data(DATA)
            .join('path')
                .classed('overlay', true)
                .attr('d', (d, i) => {
                    return `M ${xScale(d.PAIR) + 46} ${innerHeight}
                    ${xScale(d.PAIR) + 46} ${innerHeight}
                    ${xScale(d.PAIR) - 2} ${innerHeight}
                    ${xScale(d.PAIR) - 2} 240
                    ${xScale(d.PAIR) - 2} 240 
                    C ${xScale(d.PAIR) - 2} 272, 
                    ${xScale(d.PAIR) + 46} 272,
                    ${xScale(d.PAIR) + 46} 240 z`;
                })
                .style('fill', bgColor)
                .style('stroke', 'transparent')
                .style('stroke-width', strokeWidth);

        g.selectAll('.tube-top')
            .data(DATA)
            .join('rect')
                .classed('tube-top', true)
                .attr('x', (d, i) => xScale(d.PAIR) - 7.5)
                .attr('y', -14)
                .attr('rx', radius)
                .attr('width', 58)
                .attr('height', 12)
                    .style('fill', 'transparent')
                    .style('stroke', darkColor)
                    .style('stroke-width', strokeWidth);

        g.selectAll('.tube-shadow')
            .data(DATA)
            .join('rect')
                .classed('tube-shadow', true)
                .attr('x', (d, i) => xScale(d.PAIR) + 8)
                .attr('y', margin.top)
                .attr('rx', radius)
                .attr('width', 10)
                .attr('height', 180)
                    .style('fill', bgColor)
                    .style('opacity', 0.2)
                    .style('stroke', 'transparent')
                    .style('stroke-width', 1);

        if(value === 'percent') {
            const lines = new Array(20).fill(1);
            g.selectAll('.tube-line').remove();
            lines.forEach((line, ind) => {
                g.selectAll(`.tube-lines${ind}`)
                .data(DATA)
                .join('rect')
                    .classed(`tube-lines${ind} tube-line`, true)
                    .attr('x', (d, i) => xScale(d.PAIR))
                    .attr('y', ind * 13.8 - 14)
                    .attr('rx', radius)
                    .attr('width', () => {
                        return ind % 5 === 0 ? 10 : 5;
                    })
                    .attr('height', 2)
                        .style('fill', darkColor);
            });
        } else {
            const lines = new Array(10).fill(1);
            g.selectAll('.tube-line').remove();
            lines.forEach((line, ind) => {
                g.selectAll(`.tube-lines${ind}`)
                .data(DATA)
                .join('rect')
                    .classed(`tube-lines${ind} tube-line`, true)
                    .attr('x', (d, i) => xScale(d.PAIR))
                    .attr('y', ind * 27.6 - 14)
                    .attr('rx', radius)
                    .attr('width', () => {
                        if(ind === 5) {
                            return 8;
                        } else {
                            return 4;
                        }                        
                    })
                    .attr('height', 2)
                        .style('fill', darkColor);
            });
        }

        g.selectAll('.tube-label')
            .data(DATA)
            .join('text')
                .classed('tube-label', true)
                .text(d => {
                    if(value === 'percent') {
                        return `${parseFloat(d.VOLUME_ETH / TOTAL_VOLUME * 100).toFixed(1)}%`;
                    } else if(value === 'eth') {
                        return `${parseFloat(d.VOLUME_ETH / 1000000).toFixed(1)}M`;
                    } else {
                        return `${parseFloat(d.VOLUME_USD / 1000000000).toFixed(1)}B`;
                    }
                })
                .attr('x', (d, i) => xScale(d.PAIR) + 8)
                .attr('y', (d, i) => -100)
                .style('font-size', 12)
            .transition()
                .delay(duration)
                .duration(duration)
                .ease(d3.easePolyOut)
                .attr('y', (d, i) =>{
                    if(value === 'percent') {
                        return yScale(d.VOLUME_ETH / TOTAL_VOLUME * 100) - 15;
                    } else if(value === 'eth') {
                        return yScale(d.VOLUME_ETH / million) - 13;
                    } else {
                        return yScale(d.VOLUME_USD / billion) - 13;
                    }
                });

        const xAxis = d3.axisBottom(xScale);
        const xAxisValues = svg.selectAll('.xAxis-label')
            .data([null])
            .join('g')
                .classed('xAxis-label', true)
                .attr('transform', `translate(${margin.left - 10}, ${innerHeight + margin.top + 6})`)
                .call(xAxis);

        const yAxisLabel = svg.selectAll('.yAxis-label')
            .data([null])
            .join('g')
                .append('text')
                .classed('yAxis-label', true)
                .text(d => {
                    if(value === 'percent') {
                        return '% in total volume';
                    } else if(value === 'eth') {
                        return `volume traded in ${value.toUpperCase()} (millions)`;
                    } else {
                        return `volume traded in ${value.toUpperCase()} (billions)`;
                    }
                })
                .attr('transform', 'rotate(-90)')
                .attr('x', -outerHeight / 2)
                .attr('y', supportMargin + 28)
                    .style('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .style('font-weight', 'bold')
                    .style('fill', darkColor);

        const createParticles = () => {
            DATA.forEach((part, ind) => {
                g.selectAll(`.particles`)
                    .data([null])
                        .join('circle')
                            .classed(`particle`, true)
                            .attr('cx', xScale(part.PAIR) + getRandomInt(15,30))
                            .attr('cy', outerHeight - 104)
                            .attr('r', getRandomInt(2,4))
                            .style('fill', colors[ind])
                            .style('stroke', '#f3f7f96e')
                            .style('stroke-width', 1)
                            .style('opacity', 0.8)
                .transition()
                    .delay(getRandomInt(duration,5000))
                    .duration(getRandomInt(1000,5000))
                    .ease(d3.easePolyOut)
                        .attr('cx', xScale(part.PAIR) + getRandomInt(4,40))
                        .attr('cy', -margin.top)
                        .attr('r', `${getRandomInt(4,8)}`)
                        .style('opacity', 0)
            });
        }

        const interval = setTimeout(() => {
            if(isVisible) {
                setInterval(() => {
                    createParticles();
                }, getRandomInt(duration, 500));
            }
        }, duration * 2);

        return () => {
            clearTimeout(interval);
        }
    }, [value, price, setTotal, isVisible]);

    const onVisibilityChange = () => {
        setIsVisible(getIsDocumentHidden());
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    return (
        <div className='canvas'>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default Chart;
