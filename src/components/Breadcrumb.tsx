import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkshopProgress } from "@/hooks/useWorkshopProgress";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface BreadcrumbProps {
  steps: Step[];
  currentStep: number;
}

export const Breadcrumb = ({ steps, currentStep }: BreadcrumbProps) => {
  const { resetProgress } = useWorkshopProgress();
  const navigate = useNavigate();

  const handleClearProgress = () => {
    if (confirm("Are you sure you want to clear all progress and start over?")) {
      resetProgress();
      sessionStorage.clear();
      toast({
        title: "Progress cleared",
        description: "All progress has been reset. Returning to welcome page...",
      });
      navigate("/");
    }
  };

  return (
    <nav className="fixed left-0 top-16 bottom-0 w-64 border-r bg-background p-6 overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4">
            ONBOARDING PROGRESS
          </h2>
          <ol className="relative space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isUpcoming = step.id > currentStep;

            return (
              <li key={step.id} className="relative animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-background text-primary shadow-lg shadow-primary/20",
                      isUpcoming && "border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm">{step.id}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 pt-1">
                    <h3
                      className={cn(
                        "font-semibold transition-colors",
                        isCurrent && "text-foreground",
                        (isCompleted || isUpcoming) && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 h-6 w-0.5 transition-colors",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </li>
            );
          })}
          </ol>
        </div>
        
        {/* Clear progress link at the bottom */}
        <div className="mt-auto pt-8">
          <button
            onClick={handleClearProgress}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear progress
          </button>
        </div>
      </div>
    </nav>
  );
};
