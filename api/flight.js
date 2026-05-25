// Vercel Serverless Function — AviationStack proxy
// Needed because free plan uses HTTP (blocked by browsers from HTTPS pages)

export default async function handler(req, res) {
  const { iata, date } = req.query
  const key = process.env.AVIATIONSTACK_KEY

  if (!key) return res.status(500).json({ error: 'API key not configured' })
  if (!iata) return res.status(400).json({ error: 'Missing iata param' })

  const params = new URLSearchParams({ access_key: key, flight_iata: iata })
  if (date) params.append('flight_date', date)

  try {
    const resp = await fetch(`http://api.aviationstack.com/v1/flights?${params}`)
    const data = await resp.json()
    // Cache 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60')
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
