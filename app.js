const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const index = fs.readFileSync('./index.html', 'utf-8')
const CsvDb = require('./csv-db/facade')
const csvDb = new CsvDb('./google_transit/stops.txt', [
  'stop_id',
  'stop_code',
  'stop_name',
  'stop_desc',
  'stop_lat',
  'stop_lon',
  'zone_id',
  'stop_url',
  'location_type',
  'parent_station',
  'stop_timezone',
  'wheelchair_boarding'
])

//console.log(csvDb.search('1651'))

const url =
  'http://realtime.adelaidemetro.com.au/SiriWebServiceSAVM/SiriStopMonitoring.svc/json/SM?MonitoringRef='

const evalDate = dateString => {
  return eval('new ' + dateString.match(/Date\(\S+\)/)[0])
}

const fetchStop = function(stopId, cb) {
  axios
    .get(url + stopId)
    .then(function(response) {
      const data = response.data
      const lines = []
      if (data.StopMonitoringDelivery && data.StopMonitoringDelivery[0]) {
        const SMD = data.StopMonitoringDelivery[0]
        const responseTimestamp = evalDate(SMD.ResponseTimestamp)
        const visit = SMD.MonitoredStopVisit

        if (visit) {
          for (const { MonitoredVehicleJourney } of visit) {
            lines.push({
              line: MonitoredVehicleJourney.LineRef.Value,
              destination: MonitoredVehicleJourney.DestinationName[0].Value,
              arrivalTime: evalDate(
                MonitoredVehicleJourney.MonitoredCall.LatestExpectedArrivalTime
              )
            })
          }
        } else {
          console.log('No MonitoredStopVisit')
        }

        cb({
          responseTimestamp,
          lines
        })
      } else {
        console.log('No StopMonitoringDelivery')
      }
    })
    .catch(console.log)
}

const formatResult = (list) => {
  return list.map(item => {
    return {
      value: item.stop_name,
      code: item.stop_code
    }
  })
}

if (process.env.NODE_ENV === 'dev') {
  app.use(cors())
  console.log('CORS enabled.')
}

app.get('/api/fetch/:stopId', (req, res) => {
  const stopId = req.params.stopId
  fetchStop(stopId, function(data) {
    res.send(data)
  })
})

app.get('/api/search/:searchText', (req, res) => {
  const searchText = req.params.searchText
  var result = []
  if (searchText) {
    result = formatResult(csvDb.search(searchText))
  }

  res.json(result)
})

app.use('/dist', express.static(path.join(__dirname, 'dist')))

app.get('/', function(req, res) {
  res.send(index)
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!')
})
