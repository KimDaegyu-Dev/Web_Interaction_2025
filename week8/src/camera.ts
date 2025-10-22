async function getWebcamStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
  });
}

async function getVideoStream(video: HTMLVideoElement): Promise<string> {
  video.src = "./sample.mp4";
  video.crossOrigin = "anonymous";
  return Promise.resolve("./sample.mp4");
}

async function startMediaSource(
  video: HTMLVideoElement,
  mediaPromise: Promise<MediaStream | string>
) {
  try {
    // Stop any existing tracks to prevent AbortError
    if (video.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
    video.srcObject = null; // Clear previous source
    video.src = ""; // Clear previous src for video files
    video.load(); // Reload the video element
    video.loop = true;

    const media = await mediaPromise;
    if (typeof media !== "string") {
      video.srcObject = media;
    } else {
      video.src = media;
    }
    await video.play();
  } catch (error) {
    console.error("Failed to start media source:", error);
  }
}

export { getWebcamStream, getVideoStream, startMediaSource };
