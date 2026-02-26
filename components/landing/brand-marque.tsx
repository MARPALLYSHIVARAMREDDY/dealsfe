import { cn } from "@/lib/utils"
import Image from "next/image"
import { ReusableMarquee } from "../marquee"

const logos = [
  {
    name: "Nike",
    img: "/images/nike.png",
  },
  {
    name: "Adidas",
    img: "/images/adidas.png",
  },
  {
    name: "Melody Mokctails",
    img: "/images/melody.png",
  },
  {
    name: "Puma",
    img: "/images/rpuma.png",
  },
  {
    name: "Reebok",
    img: "/images/reeback.png",
  },
]

const firstRow = logos

const LogoCard = ({ img, name }: { img: string; name: string }) => {
  return (
    <div
      className={cn(
        "relative h-28 w-40 flex items-center justify-center cursor-pointer overflow-hidden rounded-xl border p-4",

        // light mode
        "border-gray-950/10 bg-gray-950/1 hover:bg-gray-950/5",

        // dark mode
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <Image
        src={img}
        alt={`${name} logo`}
        width={100}
        height={100}
        className="object-contain"
      />
    </div>
  )
}

export function MarqueeDemo() {
  return (
    <ReusableMarquee
      items={firstRow}
      renderItem={(logo) => <LogoCard key={logo.name} {...logo} />}
      pauseOnHover
      speed="20s"
    />
  )
}