const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const index = fs.readFileSync('./index.html', 'utf-8')

const url =
  'http://realtime.adelaidemetro.com.au/SiriWebServiceSAVM/SiriStopMonitoring.svc/json/SM?MonitoringRef='

const fetchStop = function(stopId, cb) {
  axios
    .get(url + stopId)
    .then(function(response) {
      const data = response.data
      const lines = []
      if (data.StopMonitoringDelivery && data.StopMonitoringDelivery[0]) {
        const SMD = data.StopMonitoringDelivery[0]
        const visit = SMD.MonitoredStopVisit

        if (visit) {
          for (const { MonitoredVehicleJourney } of visit) {
            const arrivalTime = eval(
              'new ' +
                MonitoredVehicleJourney.MonitoredCall.LatestExpectedArrivalTime.match(
                  /Date\(\S+\)/
                )[0]
            )
            lines.push({
              line: MonitoredVehicleJourney.LineRef.Value,
              destination: MonitoredVehicleJourney.DestinationName[0].Value,
              arrivalTime
            })
          }
        } else {
          console.log('No MonitoredStopVisit')
        }

        cb(lines)
      } else {
        console.log('No StopMonitoringDelivery')
      }
    })
    .catch(console.log)
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

app.use('/dist', express.static(path.join(__dirname, 'dist')))

app.get('/', function(req, res) {
  res.send(index)
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Example app listening on port 3000!')
})
