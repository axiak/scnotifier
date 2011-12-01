var createImage = require('./createImage'),
    url = require('url'),
    http = require('http');

function showError(res, description) {
  res.writeHead(500, {"Content-Type": "text/plain"});
  res.end(description);
}

function dateDiff(eventDate) {
  var currentDate = new Date();

  var inThePast = false;

  // Difference in hours
  var diff = Math.round((eventDate.getTime() - currentDate.getTime()) / 3600000);
  if (diff < 0) {
    inThePast = true;
    diff = -diff;
  }

  var days = Math.floor(diff / 24);
  var result = "";

  if (days > 0) {
    result = "" + days + (days === 1 ? " day" : " days");
  }

  var hours = diff % 24;

  result += " " + hours + (hours === 1 ? " hour" : " hours");

  if (inThePast) {
    result += " ago";
  } else {
    result = "in " + result;
  }
  return result;
}

var excludedIps = ["127.0.0.1", "24.61.10.10"];

var FONT = 'Helvetica-Bold'; // 'Times-Bold';

http.createServer(function (req, res) {
  var referer = req.headers.referer || '';
  var remoteAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (referer.indexOf('http://www.reddit.com/r/starcraft/') !== 0 &&
      excludedIps.indexOf(remoteAddr) === -1) {
    res.writeHead(403, {"Content-Type": "text/plain"});
    res.end("Cannot access server outside reddit sc.");
    return;
  }

  var parsedUrl = url.parse(req.url, true);

  var eventTitle = parsedUrl.query.title;
  var eventDate = new Date(parsedUrl.query.date);

  createImage.createImage(eventTitle + " " + dateDiff(eventDate),
              {font: FONT, fill: "white", background: "black", size: 15},

              function (err, output) {
                if (err) {
                  showError(res, "An error occured: " + err);
                } else {
                  res.writeHead(200, {"Content-Type": "image/png"});
                  res.end(output);
                }
              });
}).listen(process.env.PORT || 3000);
