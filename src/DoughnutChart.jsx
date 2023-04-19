import {useRef, useLayoutEffect} from 'react'

import * as d3 from 'd3'

import './App.css'

const DoughnutChart = props => {

    const pieRef = useRef(null)
    
    const margin = 20
    const borderWidth = 10
    const radius = Math.min(props.width, props.height) / 2
    
    const format = d3.format(".0%") 
    const colour = d3.scaleOrdinal(["steelblue", "lightsteelblue"])
    
    const path = d3.arc()
        .outerRadius(radius - margin)
        .innerRadius(radius - margin - borderWidth)
    
    const cake = d3.pie()
        .sort(null)
        .value(d => d)        

    const pie = d3.select(pieRef.current)
    
    const createPieChart = () => {
        
        pie.append("g")
            .attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")")
            .attr("class", "g")

        pie.append("text")
            .attr("class", "percentage")    
            .attr("transform", "translate(" + props.width / 2 + "," + props.height / 2 + ")") 
        
        updatePieChart([1, 0])    
    }
    
    const updatePieChart = (selection) => {
        
        const g = d3.select(".g")
        const label = d3.select(".percentage")

        g.selectAll(".arc").remove()
        
        const arc = g.selectAll(".arc")
            .data(cake(selection))
            .enter()
            .append("g")
                .attr("class", "arc")
        
        arc.append("path")
            .attr("d", path)
            .attr("fill", (d, i) => colour(i))        
        
        label.text(() => format(selection[0] / ( selection[0] + selection[1])))
    }
    
    useLayoutEffect(() => {
        if (props.selection) 
        {
            const data = [props.selection.length, props.data.length - props.selection.length]
            updatePieChart(data)
        }
    }, [props.selection])

    useLayoutEffect(() => {
        if (props.data)
        {
            createPieChart()
        }
    }, [props.data])
    
    return ( 
        <svg id='pie' ref={pieRef} width={props.width} height={props.height}>
            
        </svg>
     );
}
 
export default DoughnutChart;