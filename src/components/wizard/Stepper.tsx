'use client';

import { Progress } from '@/components/ui/progress';
import { I18nDictionary } from '@/i18n/index';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  i18n: I18nDictionary;
}

export function Stepper({ currentStep, totalSteps = 5, onStepClick, i18n }: StepperProps) {
  const stepLabels = [
    i18n.wizard.steps.category,
    i18n.wizard.steps.objective,
    i18n.wizard.steps.details,
    i18n.wizard.steps.rigor,
    i18n.wizard.steps.result,
  ];

  const progressPercent = Math.min(Math.round(((currentStep - 1) / (totalSteps - 1)) * 100), 100);
  const stepText = i18n.wizard.stepIndicator
    .replace('{current}', String(currentStep))
    .replace('{total}', String(totalSteps));

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-muted-foreground">
        <span className="font-semibold text-primary">{stepText}</span>
        <span className="hidden sm:inline-block">
          {stepLabels[currentStep - 1] || ''}
        </span>
      </div>

      <Progress value={progressPercent} className="h-2 w-full" />

      <div className="hidden sm:grid grid-cols-5 gap-2 pt-1 text-center text-xs">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = onStepClick && isCompleted;

          return (
            <button
              key={label}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(stepNumber)}
              className={`truncate rounded px-1.5 py-0.5 transition-colors ${
                isCurrent
                  ? 'font-semibold text-primary'
                  : isCompleted
                  ? 'text-foreground/80 hover:text-primary cursor-pointer'
                  : 'text-muted-foreground/60 cursor-default'
              }`}
            >
              {stepNumber}. {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
