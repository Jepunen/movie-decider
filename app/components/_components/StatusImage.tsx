import React from "react";
import Image from "next/image";

export interface StatusImageProps {
  status: "default" | "hosting" | "waiting" | "joining" | "setting";
}

const images: Record<StatusImageProps["status"], { src: string; alt: string }> =
  {
    default: { src: "/squirrels/EatingSquirrel.png", alt: "Default Status" },
    hosting: { src: "/squirrels/HostSquirrel.png", alt: "Hosting Status" },
    waiting: { src: "/squirrels/WaitingSquirrel.png", alt: "Waiting Status" },
    joining: { src: "/squirrels/JoiningSquirrel.png", alt: "Joining Status" },
    setting: { src: "/squirrels/SettingSquirrel.png", alt: "Setting Status" },
  };

export default function StatusImage({ status }: StatusImageProps) {
  const { src, alt } = images[status] ?? images.default;

  return (
    <div className="relative w-full h-80">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 335px"
        className="object-contain"
        priority
      />
    </div>
  );
}
