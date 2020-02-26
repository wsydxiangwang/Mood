let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = AudioContext ? new AudioContext() : '';

let soundBuffer = {
  getBuffer(link) {
    return new Promise((resolve, reject) => {
      if (audioCtx) {
        let request = new XMLHttpRequest();
        request.open("GET", link, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
          audioCtx.decodeAudioData(request.response, function(buffer) {
            resolve(buffer)
          }, function(e) {
            console.log('reject');
            reject(e);
          });
        };
        request.send();
      } else {
        reject('not support AudioContext');
      }
    })
  },
  createSound(buffer) {
    if (audioCtx.state == 'suspended') {
      console.log('重启audioCtx');
      audioCtx.resume();
    }
    let source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    return source;
  }
}
export default soundBuffer;
