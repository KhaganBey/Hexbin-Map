# Hexbin-Map
A [Hexbin](https://github.com/d3/d3-hexbin) visualisation of geocoded data created with [React](https://react.dev), [D3](http://d3js.org) and [topojson](https://github.com/topojson/topojson-client). 

## Interaction
The selection chart allows you to select a date range with a [brush](https://github.com/d3/d3-brush) in order to filter the shown data points. The hexbins update to highlight the selected data points. The doughnut chart is also updated to show the percentage of selected data points.        

![Example with 40 data points](https://user-images.githubusercontent.com/124051887/234056535-ee02b26c-c708-42a5-ab7a-7e94769da329.PNG)
&rarr; An example with 40 data points.

## The Data
The data file called `data.csv` can be found in the `./public/data/` folder. It consists of a basic three-column CSV table with the folowing example dataset:

|Date      |Latitude | Longitude|
|----------|---------| ---------|
|30-09-2023|27.174| 78.0421|
|01-01-2023|40.85|  28.29|
|02-06-2023|340.7424|140.9|
|05-12-2023|13.7484| -17.98|
|21-11-2023|400.7424|  -83.98|

You are required to replace the contents of `data.csv` with your own data. 

### Date
The date column allows the data to be later filtered by date using the selection chart. The default date format is day-month-year. In order to change the date format, edit the following line in the `App.jsx` file:

`const dateFormat = "%d-%m-%Y"`

## The Map
The map you see is a TopoJSON file with specific objects corresponding to landmassess and countries. It is stored in the `world-50m.json` file that is located in the `./public/data/` folder. 

## D3 Integration with React
This project uses D3 with [React Refs](https://react.dev/reference/react/useRef) for rendering, meaning the code is mostly portable to a non-React environment. However, manipulating the DOM directly with D3 might be dangerous in a complex React application, so the code would need to be modified for such cases.

## Inspiration
This project is inspired by [this repository](https://github.com/jeffreymorganio/d3-geo-hexbin) by @jeffreymorganio, although the code looks very different due to version difference and the addition of React to the mix.  

