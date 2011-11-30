var spawn = require('child_process').spawn,
    temp = require('temp'),
    sys = require('sys'),
    fs = require('fs');

exports.createImage = function(text, opts, callback) {

  opts = opts || {};

  if (!callback) {
    return;
  }

  opts.font = opts.font || 'Arial-Regular';
  opts.size = opts.size || 12;
  opts.fill = opts.fill || 'black';
  opts.background = opts.background || 'transparent';

  var tempFile = temp.path({suffix: ".png"});

  var convert = spawn('convert', ['-font', opts.font,
                                  '-background', opts.background,
                                  '-fill', opts.fill,
                                  '-pointsize', opts.size,
                                  'label:' + text,
                                  tempFile]);

  var error;

  convert.stderr.on('data', function (data) {
    error = data;
  });

  convert.on('exit', function (code) {
    if (code != 0) {
      fs.unlink(tempFile);
      callback(error || 1, null);
    } else {
      fs.readFile(tempFile, function (err, data) {
        fs.unlink(tempFile);
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    }
  });
};

