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

type Country = {
  name: string
  alpha3Code: string
}

type Data = DataItem[]

type DataItem = {
  date: string
  confirmed: string
  deaths: string
  recovered: string
}

function formatDate(date: Date): string {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

  return `${ye}-${mo}-${da}`
}

function App() {
  const [data, setData] = React.useState<Data>([])
  const [countries, setCountries] = React.useState<Country[]>([])
  const [country, setCountry] = React.useState<string>('GBR')

  const date = new Date()
  const today = formatDate(date)
  const oneMonthAgoDate = date.setMonth(date.getMonth() - 1)
  const oneMonthAgo = formatDate(new Date(oneMonthAgoDate))
  const [startDate, setStartDate] = React.useState<string>(oneMonthAgo)

  React.useEffect(() => {
    fetch('https://restcountries.eu/rest/v2/all')
      .then((res) => res.json())
      .then((json) => {
        setCountries(json)
      })
  }, [])

  React.useEffect(() => {
    fetch(
      `https://covidapi.info/api/v1/country/${country}/timeseries/${startDate}/${today}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.result)
      })
  }, [startDate, today, country])

  return (
    <div className="App">
      <h1>
        <span role="img" aria-label="disease emoji">
          🦠
        </span>{' '}
        Covid-19 Tracker
      </h1>
      <fieldset className="App__input__wrapper">
        <label className="App__label" htmlFor="country">
          Country
        </label>
        <select
          className="App__input"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          name="country"
          id="country"
        >
          {countries.map((country) => {
            return (
              <option value={country.alpha3Code} key={country.alpha3Code}>
                {country.name}
              </option>
            )
          })}
        </select>
      </fieldset>
      <fieldset className="App__input__wrapper">
        <label className="App__label" htmlFor="from">
          From
        </label>
        <input
          className="App__input"
          type="date"
          name="from"
          id="from"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </fieldset>
      <div className="App__graph">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="confirmed"
              stroke="#ff3636"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="deaths"
              stroke="#525252"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="recovered"
              stroke="#1eb343"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default App
