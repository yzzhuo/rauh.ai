const getPeakLevel = (analyzer) => {
  const array = new Uint8Array(analyzer.fftSize);
  analyzer.getByteTimeDomainData(array);
  return (
    array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) /
    128
  );
};

const createMediaStream = (stream: MediaStream, isRecording?: boolean, callback?: (peak: number) => void) => {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyzer = context.createAnalyser();
  source.connect(analyzer);
  const tick = () => {
    const peak = getPeakLevel(analyzer);
    if (isRecording && callback) {
      callback(peak);
      requestAnimationFrame(tick);
    }
  };
  tick();
};

export { createMediaStream }