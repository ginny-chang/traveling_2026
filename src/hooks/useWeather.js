// Open-Meteo API — free, no key required
// Busan: 35.1796°N, 129.0756°E
import { useState, useEffect } from 'react'

const LAT = 35.1796
const LON = 129.0756

const WMO = (code) => {
  if (code === 0)  return { label: 'CLEAR',   desc: 'Clear Sky' }
  if (code <= 3)   return { label: 'CLOUDY',  desc: 'Partly Cloudy' }
  if (code <= 48)  return { label: 'FOG',     desc: 'Foggy' }
  if (code <= 55)  return { label: 'DRIZZLE', desc: 'Drizzle' }
  if (code <= 67)  return { label: 'RAIN',    desc: 'Rain' }
  if (code <= 77)  return { label: 'SNOW',    desc: 'Snow' }
  if (code <= 82)  return { label: 'SHOWERS', desc: 'Rain Showers' }
  if (code <= 99)  return { label: 'STORM',   desc: 'Thunderstorm' }
  return { label: 'N/A', desc: '—' }
}

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Asia%2FSeoul`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const c = data.current
        const cond = WMO(c.weather_code)
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          wind: Math.round(c.wind_speed_10m),
          humidity: c.relative_humidity_2m,
          label: cond.label,
          desc: cond.desc,
        })
      })
      .catch(() => setWeather(null))
      .finally(() => setLoading(false))
  }, [])

  return { weather, loading }
}
