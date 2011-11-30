var temp = require('temp'),
    sys = require('sys'),
    fs = require('fs'),
    Image = require('node-wkhtml').image()
    http = require('http');

function showError(res, description) {
  res.writeHead(500, {"Content-Type": "text/plain"});
  res.end(description);
}

http.createServer(function (req, res) {
  fs.readdir("/usr/bin", function (err, files) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(files.join("\n"));
  });

  /*
  var img = new Image({ html: "<h2>This is a test</h2>" });
  img.convert(function (err, output) {
    if (err) {
      showError(res, "An error occured: " + err);
    } else {
      res.writeHead(200, {"Content-Type": "image/png"});
      res.end(output);
    }
  });
*/
}).listen(process.env.PORT || 3000);
