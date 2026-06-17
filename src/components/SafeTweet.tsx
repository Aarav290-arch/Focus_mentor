"use client";
interface SafeTweetProps {
  id: string;
}

export default function SafeTweet({ id }: SafeTweetProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Community post</p>
          <p className="text-xs text-gray-500">Tweet ID {id}</p>
        </div>
        <span className="rounded-full border border-black px-2 py-1 text-xs font-medium text-gray-700">
          X
        </span>
      </div>
      <p className="text-sm leading-6 text-gray-700">
        See the original post on X without relying on the third-party embed API.
      </p>
      <a
        href={`https://x.com/i/web/status/${id}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center rounded-full bg-[#7fb236] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6d9d2f]"
      >
        Open post
      </a>
    </div>
  );
}
