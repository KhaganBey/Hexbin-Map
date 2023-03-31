import { useState, useEffect } from 'react'

import * as d3 from 'd3'

import './Hex.css'
import Hexmap from './Hexmap.jsx'

function App() {
  const [mapFile, setMapFile] = useState(null)
  const [data, setData] = useState(null) 
  
  const mapWidth = 1000 
  const mapHeight = 600    

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
    <div>
      <h1>Hexbin Map Title</h1>
      <Hexmap mapFile={mapFile} data={data} dateFormat={dateFormat} projection={projection} width={mapWidth} height={mapHeight} />
    </div>
  )
}

export default App
