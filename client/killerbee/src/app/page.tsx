import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-[#0b0c0d]">
      <div>
        <Image src="/assets/bee.svg" alt="Bee logo" width={340} height={340} />
      </div>
      <Button className="flex mt-[100px] p-7 hover:bg-[#E0B200]">
        <Link className="text-xl font-bold" href="/login">
          Connexion
        </Link>
      </Button>
    </div>
  );
}
