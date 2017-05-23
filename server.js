#!/usr/bin/env node

const fs = require('fs')
const express = require('express')
const request = require('request')
const { createBundleRenderer } = require('vue-server-renderer')

const bundleRenderer = createBundleRenderer(
  // Load the SSR bundle with require.
  require('./dist/vue-ssr-bundle.json'),
  {
    // Yes, I know, readFileSync is bad practice. It's just shorter to read here.
    template: fs.readFileSync('./index.html', 'utf-8')
  }
)

const url =
  'http://realtime.adelaidemetro.com.au/SiriWebServiceSAVM/SiriStopMonitoring.svc/json/SM?MonitoringRef='

const fetchStop = function(stopId, cb) {
  request(url + stopId, function(error, response, body) {
    if (!error) {
      const data = JSON.parse(body)

      if (data.StopMonitoringDelivery && data.StopMonitoringDelivery[0]) {
        const SMD = data.StopMonitoringDelivery[0]
        const visit = SMD.MonitoredStopVisit
        const lines = []
        if (visit) {
          for (const { MonitoredVehicleJourney } of visit) {
            lines.push(
              MonitoredVehicleJourney.LineRef.Value +
                ' To ' +
                MonitoredVehicleJourney.DestinationName[0].Value +
                ' ' +
                eval(
                  'new ' +
                    MonitoredVehicleJourney.MonitoredCall.LatestExpectedArrivalTime.match(
                      /Date\(\S+\)/
                    )[0]
                )
            )
          }

          cb(lines);
        } else {
          console.log('No MonitoredStopVisit')
        }
      } else {
        console.log('No StopMonitoringDelivery')
      }
    }
  })
}

// Create the express app.
const app = express()

// Serve static assets from ./dist on the /dist route.
app.use('/dist', express.static('dist'))

app.get('/api/fetch/:stopId', (req, res) => {
  const stopId = req.params.stopId
  fetchStop(stopId, function(data){
    res.send(data)
  })
})

// Render all other routes with the bundleRenderer.
app.get('*', (req, res) => {
  bundleRenderer
    // Renders directly to the response stream.
    // The argument is passed as "context" to main.server.js in the SSR bundle.
    .renderToStream({ url: req.path })
    .pipe(res)
})

// Bind the app to this port.
app.listen(process.env.PORT || 8080)
