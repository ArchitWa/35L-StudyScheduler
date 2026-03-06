import { useEffect, useState } from "react";

const DEFAULT_FALLBACK_AVATAR = "https://i.pravatar.cc/100?img=1";

export default function Avatar({
  src,
  alt = "avatar",
  className = "",
  fallbackSrc = DEFAULT_FALLBACK_AVATAR,
}) {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImageSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  function handleError() {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
