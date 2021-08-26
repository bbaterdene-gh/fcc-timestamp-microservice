
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const app = express()

app.use(helmet())
app.use(compression())
app.use(cors())

const port = process.env.PORT || 3000

app.get('/api/:date?', (req, res) => {
  let { date } = req.params
  // no date
  if (!date) {
    date = new Date()
    res.send({
      unix: date.getTime(),
      utc: date.toUTCString(),
    })
    return
  }

  date = date.split('-')

  // epoch
  if ( date.length === 1) {
    date = isNaN(date[0]) ? date[0] : +date[0]
    date = new Date(date)
  } else if ( date.length <= 3 ){
  // year, month, day
    const year = +date[0] || 0
    const month = date[1] ? +date[1]-1 : 0
    const day = date[2] ? +date[2] : 1

    date = new Date()
    date.setUTCFullYear(year)
    date.setUTCMonth(month)
    date.setUTCDate(day)
    date.setUTCHours(0, 0, 0, 0)
  } else {
    res.status(400)
    res.send({
      error: "Invalid Date"
    })
  }

  res.send({
    unix: date.getTime(),
    utc: date.toUTCString(),
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

