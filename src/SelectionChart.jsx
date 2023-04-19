import { useRef, useLayoutEffect } from "react"

import * as d3 from 'd3'

import './App.css'

const SelectionChart = props => {

    const chartRef = useRef(null)
    
    const margin = {top: 20, right: 20, bottom: 30, left: 75}
    
    const w = props.width - margin.left - margin.right
    const h = props.height - margin.top - margin.bottom
    
    const formatDate = d3.timeFormat(props.dateFormat)

    const chart = d3.select(chartRef.current)
        
    const createChart = () => {
            
        const g = chart.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        const x = d3.scaleTime()
            .domain(d3.extent(props.dates, d => d.date))  
            .rangeRound([0, w])
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(props.dates, d => d.count)])
            .rangeRound([h, 0])
        
        const area = d3.area()
            .x(d => x(d.date))    
            .y0(y(0))
            .y1(d => y(d.count))

        g.append("path")
            .datum(props.dates.filter(d => { if (d3.extent(props.dates, f => f.date).includes(d.date)) { return d }}))
            .attr("fill", "lightsteelblue")
            .attr("d", area)
            
        g.append("path")
            .datum(props.dates.filter(d => { if (d3.extent(props.dates, f => f.date).includes(d.date)) { return d }}))
            .attr("class", "selection")
            .attr("fill", "steelblue")
            .attr("d", area)
            .attr("clip-path", "url(#selectionClipPath)")      
        
        const xAxis = d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%d %b %Y"))
        g.append("g")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis)
        
        const yAxis = d3.axisLeft(y)
            g.append("g")
                .call(yAxis)
            .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("dx", "-30px")
                .attr("dy", "-55px")
                .attr("text-anchor", "end")
                .attr("font-size", "14px")
                .text("Items / Day")   
        
        const brushed = ({ selection }) => {
            if (!selection) return
            
            const x0 = selection[0]
            const x1 = selection[1]
            
            const dateRange = {
                from: x.invert(x0),
                to: x.invert(x1)
            }
            
            props.setSelection(filterByDateRange(dateRange))

            updateSelectionChart(x0, x1)
        }

        const brush = d3.brushX()
            .extent([[1 ,0], [w, h - 1]])
            .on("start brush end", brushed)

        g.append("g")
            .attr("class", "brush")
            .call(brush)         
    }  
    
    const filterByDateRange = (dateRange) => {
        const dateDifference = d3.timeDay.count(dateRange.from, dateRange.to)
        if (dateDifference === 0) return []
    
        const keys = d3.range(0, dateDifference + 1).map(d => formatDate(d3.timeDay.offset(dateRange.from, d)))
        
        const filteredData = props.data.filter(d => { if (keys.includes(d.Date)) return d })
        return filteredData
    }   

    const selectionClipPath = chart.append("defs")
            .append("clipPath")
                .attr("id", "selectionClipPath")
            .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", w)
                .attr("height", h)       
    
    const updateSelectionChart = (x0, x1) => {
        selectionClipPath
            .attr("x", x0)
            .attr("width", x1 - x0)
    }
    
    /*const removeSelection = () => {
        chart.select(".brush").call(brush.move, null)
    }    */        
    
    useLayoutEffect(() => {
        if (props.data)
        {
            createChart()
        }
    }, [props.data])

    return ( 
        <svg id='chart' ref={chartRef} width={props.width} height={props.height}>
            
        </svg>
     );
}
 
export default SelectionChart;