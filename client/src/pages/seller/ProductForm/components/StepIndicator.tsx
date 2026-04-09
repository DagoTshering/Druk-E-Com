import React from 'react';
import { Check } from 'lucide-react';
import { STEPS } from '../utils/types';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
  canGoToStep: (step: number) => boolean;
  onStepClick: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  completedSteps,
  canGoToStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.has(step.number);
        const isCurrent = currentStep === step.number;
        const canNavigate = canGoToStep(step.number);

        return (
          <React.Fragment key={step.number}>
            <button
              onClick={() => canNavigate && onStepClick(step.number)}
              disabled={!canNavigate}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isCurrent ? 'bg-gold text-dark-base' : ''}
                ${isCompleted && !isCurrent ? 'bg-gold/20 text-gold' : ''}
                ${!isCompleted && !isCurrent ? 'bg-dark-surface text-warm-gray' : ''}
                ${canNavigate && !isCurrent ? 'hover:bg-white/5 cursor-pointer' : ''}
                ${!canNavigate ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isCurrent ? 'bg-gold text-dark-base' : ''}
                  ${isCompleted && !isCurrent ? 'bg-gold text-dark-base' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-white/10 text-warm-gray' : ''}
                `}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number + 1
                )}
              </div>
              <span className="font-body font-medium hidden sm:block">{step.label}</span>
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={`
                  w-12 sm:w-20 h-0.5 mx-2
                  ${completedSteps.has(step.number) ? 'bg-gold' : 'bg-white/10'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
