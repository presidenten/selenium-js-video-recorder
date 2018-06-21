var FfmpegCommand = require('fluent-ffmpeg');
var path = require('path');
var fs = require('fs');

// osx: x64 / other: ia32
var arch = process.platform === 'darwin' ? 'x64' : 'ia32';

// only windows has an extension
var ext = process.platform === 'win32' ? '.exe' : '';

try {
  var ffmpeg = path.join('../vendor/ffmpeg', process.platform, 'ffmpeg' + ext);
  var ffprobe = path.join('../vendor/ffmpeg', process.platform, 'ffprobe' + ext);
  fs.accessSync(ffmpeg, fs.F_OK);
  fs.accessSync(ffprobe, fs.F_OK);

  // folder exists so we need to load ffmpeg and ffprobe from our repo
  FfmpegCommand.setFfmpegPath(ffmpeg);
  FfmpegCommand.setFfprobePath(ffprobe);
} catch (e) {
  console.log('error', e);
}

module.exports = FfmpegCommand;
