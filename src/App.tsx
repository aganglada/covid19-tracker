import * as React from 'react'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './App.css'

type Data = {
  [date: string]: Omit<DataItem, 'date'>[]
}

type DataItem = {
  date: string
  confirmed: string
  deaths: string
  recovered: string
}

function App() {
  const [data, setData] = React.useState<Data>({})
  const [country, setCountry] = React.useState<string>('GBR')

  React.useEffect(() => {
    const d = new Date()
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

    const today = `${da}-${mo}-${ye}`

    console.log(today)

    fetch(`https://covidapi.info/api/v1/global/timeseries/2020-01-10/${today}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.result)
      })
  }, [])

  return (
    <div className="App">
      <h1>Covid-19 Tracker</h1>
      <div className="App__country-selector__wrapper">
        <select
          className="App__country-selector"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          name="country"
        >
          {Object.keys(data).map((country) => {
            return (
              <option value={country} key={country}>
                {country}
              </option>
            )
          })}
        </select>
      </div>
      <div className="App__graph">
        <ResponsiveContainer>
          <LineChart data={data[country]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="confirmed"
              stroke="red"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="deaths" stroke="black" />
            <Line type="monotone" dataKey="recovered" stroke="green" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
