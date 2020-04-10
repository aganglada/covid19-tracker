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

function formatDate(date: Date): string {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)

  return `${ye}-${mo}-${da}`
}

function App() {
  const [data, setData] = React.useState<Data>({})
  const [country, setCountry] = React.useState<string>('GBR')

  const date = new Date()
  const today = formatDate(date)
  const oneMonthAgoDate = date.setMonth(date.getMonth() - 1)
  const oneMonthAgo = formatDate(new Date(oneMonthAgoDate))
  const [startDate, setStartDate] = React.useState<string>(oneMonthAgo)

  React.useEffect(() => {
    fetch(
      `https://covidapi.info/api/v1/global/timeseries/${startDate}/${today}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.result)
      })
  }, [startDate, today])

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
          {Object.keys(data).map((country) => {
            return (
              <option value={country} key={country}>
                {country}
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
