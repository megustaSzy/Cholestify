import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const goals = [
  { label: "Calories", value: "2,200 kcal", color: "bg-blue-500" },
  { label: "Exercise", value: "60 min", color: "bg-blue-400" },
];

export default function TargetGoalsSidebar() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Target Goals Card */}
      <Card className="shadow-sm border border-border w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Target Goals</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 pt-0">
          {goals.map((goal) => (
            <div
              key={goal.label}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${goal.color}`} />
                <span className="text-muted-foreground">{goal.label}</span>
              </div>

              <span className="font-medium text-foreground">{goal.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

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
            Consistent tracking leads to better clinical outcomes.
          </p>
        </div>
      </Card>
    </div>
  );
}
