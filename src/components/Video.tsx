export function Video() {
  const videoSrc = process.env.NEXT_PUBLIC_MINDMENTOR_VIDEO_URL?.trim();
  const hasVideo = Boolean(videoSrc);

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="relative aspect-video rounded-xl border-2 border-black overflow-hidden">
        {hasVideo ? (
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            poster="/thumbnail.png"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#efe9d5] px-6 text-center">
            <div className="max-w-md space-y-3">
              <p className="text-lg font-semibold text-gray-900">Video coming soon</p>
              <p className="text-sm leading-6 text-gray-700">
                The demo video is not bundled in the app yet. Set NEXT_PUBLIC_MINDMENTOR_VIDEO_URL to point to a hosted MP4.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}