import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
        >
          {/* Mountain shape */}
          <polygon
            points="16,4 28,28 4,28"
            fill="#2D6A4F"
          />
          {/* Snow cap */}
          <polygon
            points="16,4 20,14 12,14"
            fill="#D8F3DC"
          />
          {/* Small peak */}
          <polygon
            points="22,14 30,28 14,28"
            fill="#52B788"
            opacity="0.7"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
