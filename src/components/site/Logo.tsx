import Image from "next/image";

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <Image
      className="mark"
      src="/porada-logo.png"
      width={size}
      height={size}
      alt="Porada"
      priority
    />
  );
}
