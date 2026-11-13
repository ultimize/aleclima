import React from "react";
import Image from "next/image";

interface LogoProps {
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ light }) => {
  // next/image serve WebP/AVIF ridimensionato: il PNG originale pesa 423 KB
  const img = (
    <Image
      src="/aleclima-logo.png"
      alt="Aleclima e Impianti"
      className="site-logo"
      width={180}
      height={92}
      loading="eager"
    />
  );
  return light ? <span className="site-logo-plate">{img}</span> : img;
};
