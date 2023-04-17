import { useLayoutEffect, useState, useRef } from 'react'

import * as d3 from 'd3'
import {hexbin as Hexbin} from "d3-hexbin"
import * as topojson from "topojson-client"

import './Hex.css'
 
const Hexmap = (props) => {
    
    const [hexbinGroup, setHexbinGroup] = useState(null)

    const mapRef = useRef(null)
    
    const formatDate = d3.timeFormat(props.dateFormat)

    const path = d3.geoPath()
        .projection(props.projection)   
    
    const hexbin = Hexbin()
        .radius(5)
        
    const colour = d3.scaleSequential(d3.interpolateMagma)

    const addMap = () => {
        const map = d3.select(mapRef.current)
            .attr('width', props.width)
            .attr('height', props.height)

        map.append("path")
            .datum(topojson.feature(props.mapFile, props.mapFile.objects.land))
            .attr("class", "land")
            .attr("d", path)    
        
        map.append("path")
            .datum(topojson.mesh(props.mapFile, props.mapFile.objects.countries))
            .attr("class", "boundary")  
            .attr("d", path)  
        
        const hexbinGroup = map.append("g") 
            .attr("clip-path", "url(#clip)")   
        
        return hexbinGroup    
    }
    
    const createHexbin = (points, hexbinGroup) => {
        const bins = hexbin(points)
        
        colour
            .domain([d3.max([bins.length, 0])])
        
        hexbinGroup
            .selectAll(".hexagon")
                .data(bins, b => b.x + "," + b.y)  
            .enter().append("path")
                .attr("class", "hexagon")
                .attr("d", hexbin.hexagon())   
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")" )   
                .style("fill", d => d3.color(d.length))
    }
    
    const updateHexbin = (points, hexbinGroup) => {
        const bins = hexbin(points)

        colour
            .domain([d3.max([bins.length, 0])])
        
        const hexagon = hexbinGroup.selectAll(".hexagon").data(bins, b => b.x + "," + b.y)

        hexagon.exit().remove()
        
        hexbinGroup
            .selectAll(".hexagon")
                .data(bins, b => b.x + "," + b.y)  
            .enter().append("path")
                .attr("class", "hexagon")
                .attr("d", hexbin.hexagon())   
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")" )   
            .merge(hexagon)    
                .style("fill", d => d3.color(d.length))
    }

    const selectDateRange = (dateRange) => {
        const filteredData = filterByDateRange(dateRange)
        const filteredPoints = filteredData.map(d => d.projection)

        updateHexbin(filteredPoints, hexbinGroup)
    }

    const filterByDateRange = (dateRange) => {
        const dateDifference = d3.timeDay.count(dateRange.from, dateRange.to)
        if (dateDifference === 0) return []
    
        const keys = d3.range(0, dateDifference + 1).map(d => formatDate(d3.timeDay.offset(dateRange.from, d)))
        
        const filteredData = props.data.filter(d => { if (keys.includes(d.Date)) return d })
        return filteredData
    }   
    
    useLayoutEffect(() => {
        if (props.data && props.mapFile) {
            const points = props.data.map(d => d.projection)
            const hexbinsGroup = addMap()
            setHexbinGroup(hexbinsGroup)
            createHexbin(points, hexbinsGroup)
        }
    }, [props.data])
    
    useLayoutEffect(() => {
        if (props.dateRange && hexbinGroup) selectDateRange(props.dateRange)
    }, [props.dateRange])
    
    return ( 
        <svg id="map" ref={mapRef} width={props.width} height={props.height}>
            
        </svg>
     );
}
 
export default Hexmap;