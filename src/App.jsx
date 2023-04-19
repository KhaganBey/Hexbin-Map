import { useState, useEffect } from 'react'

import * as d3 from 'd3'

import './App.css'
import './Hexmap.jsx'

import Hexmap from './Hexmap.jsx'
import SelectionChart from './SelectionChart.jsx'
import Selection from './Selection'

function App() {
  const [mapFile, setMapFile] = useState(null)
  const [data, setData] = useState(null) 

  const [selection, setSelection] = useState(null)
  
  const mapWidth = 1000 
  const mapHeight = 600    

  const chartWidth = 800
  const chartHeight = 200
  
  const pieWidth = 200
  const pieHeight = 200
  
  const dateFormat = "%d-%m-%Y"
  const projection = d3.geoMercator()
        .scale(150)
        .translate([mapWidth / 2, mapHeight / 2])   
  
  const init = async () => {
    const map = await d3.json('./data/world-50m.json')
    const rawData = await d3.csv('./data/data.csv')
    const ddata = rawData.map(d => d = { ...d, projection : projection([d.Longitude, d.Latitude]) })
    
    setData(ddata)
    setMapFile(map)
}
  
  useEffect(() => {
    init()
  }, [])
  
  return (
    <div className="App">
      <h1>Project Hexglobe</h1>
      
      <Hexmap mapFile={mapFile} data={data} projection={projection} width={mapWidth} height={mapHeight} selection={selection} />
      
      <Selection data={data} dateFormat={dateFormat} chartWidth={chartWidth} chartHeight={chartHeight} pieWidth={pieWidth} pieHeight={pieHeight} setSelection={setSelection} selection={selection} />  
    </div>
  )
}

export default App
