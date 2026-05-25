export const flights = {
  outbound: {
    flightNumber: '', // 填入班機號碼，例如 'IT280'
    from: { code: 'TPE', city: '台北', terminal: 'T1' },
    to: { code: 'PUS', city: '釜山', terminal: '' },
    departure: '2026-06-03T02:40:00',
    arrival: '2026-06-03T06:10:00',
    airline: '',
  },
  return: {
    flightNumber: '', // 填入班機號碼
    from: { code: 'PUS', city: '釜山', terminal: 'T2' },
    to: { code: 'TPE', city: '台北', terminal: '' },
    departure: '2026-06-06T19:10:00',
    arrival: '2026-06-06T20:35:00',
    airline: '',
  },
}
