import * as d3 from 'd3'

import SelectionChart from "./SelectionChart"

const Selection = props => {

    const parseDate = d3.timeParse(props.dateFormat)
    const dateArray = props.data ? d3.rollup(props.data, d => d.length, v => v.Date) : null
    const dates = props.data ? Array.from(dateArray).map(d => {
        return {
            date: parseDate(d[0]), 
            count: d[1]
        }}) : null  
    
    const chartData = dates ? props.data : null
    
    return ( 
        <>
            <SelectionChart data={chartData} width={props.chartWidth} height={props.chartHeight} dates={dates} setDateRange={props.setDateRange} />
            <RadialChart />
        </>    
     );
}
 
export default Selection;