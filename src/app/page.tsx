'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/wizard/Stepper';
import { StepCategory } from '@/components/wizard/StepCategory';
import { StepObjective } from '@/components/wizard/StepObjective';
import { StepDetails } from '@/components/wizard/StepDetails';
import { StepRigor } from '@/components/wizard/StepRigor';
import { StepResult } from '@/components/wizard/StepResult';
import { CATALOG_EN, getCategoryById, getObjectiveById } from '@/core/catalog/en';
import { buildPrompt } from '@/core/builder';
import { BuildPromptResult, Category, Objective, RigorLevel, Tone } from '@/core/types';
import { i18n } from '@/i18n/en';
import { ArrowLeft, ArrowRight, Sparkles, Wand2 } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('corporate');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('holiday-announcement');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState<Tone>('formal');
  const [selectedRigor, setSelectedRigor] = useState<RigorLevel>('balanced');
  const [generatedResult, setGeneratedResult] = useState<BuildPromptResult | null>(null);

  // Active Category & Objective
  const currentCategory = getCategoryById(selectedCategoryId) || CATALOG_EN[0];
  const currentObjective =
    getObjectiveById(selectedCategoryId, selectedObjectiveId) ||
    currentCategory.objectives[0];

  const handleSelectCategory = (category: Category) => {
    setSelectedCategoryId(category.id);
    const firstObjective = category.objectives[0];
    if (firstObjective) {
      setSelectedObjectiveId(firstObjective.id);
      setSelectedTone(firstObjective.defaultTone);
      setFieldValues({});
    }
  };

  const handleSelectObjective = (objective: Objective) => {
    setSelectedObjectiveId(objective.id);
    setSelectedTone(objective.defaultTone);
    setFieldValues({});
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep === 4) {
      handleGenerate();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerate = () => {
    const result = buildPrompt({
      categoryId: selectedCategoryId,
      objectiveId: selectedObjectiveId,
      fieldValues,
      tone: selectedTone,
      rigor: selectedRigor,
    });
    setGeneratedResult(result);
    setCurrentStep(5);
  };

  const handleStartOver = () => {
    setSelectedCategoryId('corporate');
    setSelectedObjectiveId('holiday-announcement');
    setFieldValues({});
    setSelectedTone('formal');
    setSelectedRigor('balanced');
    setGeneratedResult(null);
    setCurrentStep(1);
  };

  const handleEditInputs = () => {
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950">
      {/* Top Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-foreground">
                  {i18n.app.name}
                </h1>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                  {i18n.app.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {i18n.app.tagline}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* Progress Stepper */}
        <Stepper
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Step Views */}
        <div className="rounded-2xl border bg-card p-5 sm:p-8 shadow-xs">
          {currentStep === 1 && (
            <StepCategory
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentStep === 2 && (
            <StepObjective
              categoryId={selectedCategoryId}
              selectedObjectiveId={selectedObjectiveId}
              onSelectObjective={handleSelectObjective}
            />
          )}

          {currentStep === 3 && currentObjective && (
            <StepDetails
              objective={currentObjective}
              fieldValues={fieldValues}
              onChangeField={handleFieldChange}
            />
          )}

          {currentStep === 4 && (
            <StepRigor
              selectedTone={selectedTone}
              selectedRigor={selectedRigor}
              onSelectTone={setSelectedTone}
              onSelectRigor={setSelectedRigor}
            />
          )}

          {currentStep === 5 && generatedResult && (
            <StepResult
              result={generatedResult}
              onEdit={handleEditInputs}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        {/* Wizard Bottom Navigation (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-1.5 text-xs sm:text-sm"
            >
              <ArrowLeft className="size-4" />
              <span>{i18n.wizard.navigation.back}</span>
            </Button>

            <Button
              onClick={handleNext}
              className="gap-1.5 text-xs sm:text-sm font-semibold shadow-xs"
            >
              {currentStep === 4 ? (
                <>
                  <Wand2 className="size-4" />
                  <span>{i18n.wizard.navigation.generate}</span>
                </>
              ) : (
                <>
                  <span>{i18n.wizard.navigation.next}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-background/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            {i18n.app.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
