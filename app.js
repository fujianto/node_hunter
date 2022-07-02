var fs = require('fs');
const os = require("os");
const axios = require('axios');
const express = require('express')
const app = express()
const port = 3000
const skills = fs.readFileSync('./skills.txt',
  { encoding: 'utf8', flag: 'r' });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  console.log(`open / `)
  const charms = fs.readFileSync('./mycharms.txt',
    { encoding: 'utf8', flag: 'r' });
  var arrPos = Array.from(Array(21).keys())
  var arrSlot = Array.from(Array(4).keys())
  var arrNeg = arrPos.map(i => -i)
  var arrNumbers = [...arrNeg, ...arrPos]
  res.render(__dirname + "/index", { skills: skills.split("\n"), charms: charms.split("\n"), numbers: arrNumbers, slot: arrSlot})
})

function isDuplicate(item, source) {
  for (var i = 0; i < source.length; i++) {
    if (item === source[i]) {
      return true
    }
  }

  return false
}

function processInput(text) {

  fs.open('./mycharms.txt', 'a', 666, function (e, id) {
    fs.write(id, os.EOL + text, null, 'utf8', function () {
      fs.close(id, function () {
        console.log('file is updated');
      });
    });
  });
}

app.get('/mycharm', (req, res) => {
  const charms = fs.readFileSync('./mycharms.txt',
    { encoding: 'utf8', flag: 'r' });
  var charmList = charms.split("\r\n")
  if (!isDuplicate(req.query.charm, charmList)) {
   processInput(req.query.charm, charmList)
  } else {
    res.json({
      message: 'Charm Exists'
    })
  }
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
