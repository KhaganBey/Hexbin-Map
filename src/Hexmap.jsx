import { useLayoutEffect, useState, useRef } from 'react'

import * as d3 from 'd3'
import {hexbin as Hexbin} from "d3-hexbin"
import * as topojson from "topojson-client"

import './App.css'
 
const Hexmap = (props) => {
    
    const [hexbinGroup, setHexbinGroup] = useState(null)

    const mapRef = useRef(null)

    const path = d3.geoPath()
        .projection(props.projection)   
    
    const hexbin = Hexbin()
        .radius(5)
        
    const colour = d3.scaleSequential(d3.interpolateMagma)

    const addMap = () => {
        const map = d3.select(mapRef.current)

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

    const selectDateRange = (selection) => {
        const filteredPoints = selection.map(d => d.projection)
        
        updateHexbin(filteredPoints, hexbinGroup)
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
        if (props.selection && hexbinGroup) selectDateRange(props.selection)
    }, [props.selection])
    
    return ( 
        <svg id="map" ref={mapRef} width={props.width} height={props.height}>
            
        </svg>
     );
}
 
export default Hexmap;