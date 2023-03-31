# Hexbin-Map
A [Hexbin](https://github.com/d3/d3-hexbin) visualisation of geocoded data created with [React](https://react.dev), [D3](http://d3js.org) and [topojson](https://github.com/topojson/topojson-client). 

## The Map
The map you see is a TopoJSON file with specific objects corresponding to landmassess and countries. It is stored in the `world-50m.json` file that is located in the `./public/data/` folder. 

## The Data
Likewise, the data file called `data.csv` can be found in the `./public/data/` folder. It consists of a basic three-column CSV table with the folowing example dataset:

|Date      |Latitude | Longitude|
|----------|---------| ---------|
|30-09-2023|270.174| 78.0421|
|01-10-2023|480.8507|  2.29|
|02-10-2023|400.7424|-73.9|
|05-10-2023|400.7484| -173.98|
|02-12-2023|400.7424|  -83.98|

The date column is optional for now.

You are required to replace the contents of `data.csv` with your own data. 
