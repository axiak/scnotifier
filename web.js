var temp = require('temp'),
    sys = require('sys'),
    fs = require('fs'),
    gm = require('gm'),
    http = require('http');

function showError(res, description) {
  res.writeHead(500, {"Content-Type": "text/plain"});
  res.end(description);
}

http.createServer(function (req, res) {
  var tempFile = temp.path({suffix: ".png"});
  gm(200, 400, "#ddff99f3")
    .drawText(10, 50, "from scratch")
    .write(tempFile, function (err) {
      if (!err) {
        fs.readFile(tempFile, function (err, data) {
          if (!err) {
            res.writeHead(200, {"Content-Type": "image/png"});
            res.end(data);
          } else {
            showError(res, "Reading the temp file: " + err);
          }
        });
      } else {
        showError(res, "Writing the image: " + err);
      }
    });
}).listen(process.env.PORT || 3000);
