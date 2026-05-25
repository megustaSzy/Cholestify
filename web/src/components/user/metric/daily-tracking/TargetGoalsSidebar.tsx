import Image from "next/image";
import { Card, } from "@/components/ui/card";

export default function TargetGoalsSidebar() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Motivational Image Card */}
      <Card className="shadow-sm border border-border overflow-hidden p-0 w-full h-[130px] sm:h-[150px] lg:h-[130px]">
        <div className="relative w-full h-full">
          <Image
            src="/healthy-food.png"
            alt="Healthy vegetables for clinical tracking"
            fill
            sizes="(max-width: 1024px) 100vw, 220px"
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-tight">
            Konsisten dalam pencatatan akan memantau kesehatan Anda
          </p>
        </div>
      </Card>
    </div>
  );
}
