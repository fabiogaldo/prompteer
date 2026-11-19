'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/wizard/Stepper';
import { StepCategory } from '@/components/wizard/StepCategory';
import { StepObjective } from '@/components/wizard/StepObjective';
import { StepDetails } from '@/components/wizard/StepDetails';
import { StepRigor } from '@/components/wizard/StepRigor';
import { StepResult } from '@/components/wizard/StepResult';
import { OnboardingModal } from '@/components/wizard/OnboardingModal';
import { getCatalog, getCategoryById, getObjectiveById } from '@/core/catalog/index';
import { buildPrompt } from '@/core/builder';
import { BuildPromptResult, Category, Locale, Objective, RigorLevel, Tone } from '@/core/types';
import { getI18n } from '@/i18n/index';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Info,
  Sparkles,
  Wand2,
} from 'lucide-react';

function WizardApp() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get('lang');
  const urlOnboarding = searchParams.get('onboarding');

  // Derive locale from URL unless explicitly toggled by user
  const initialLocale: Locale = urlLang === 'pt' ? 'pt' : 'en';
  const [userLocale, setUserLocale] = useState<Locale | null>(null);
  const locale: Locale = userLocale ?? initialLocale;

  // Onboarding modal state: opens on ?onboarding=1 or user button click
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(false);
  const isOnboardingOpen = userModalOpen || (urlOnboarding === '1' && !onboardingDismissed);

  const handleOpenChange = (open: boolean) => {
    setUserModalOpen(open);
    if (!open) {
      setOnboardingDismissed(true);
    }
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('corporate');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('holiday-announcement');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [selectedTone, setSelectedTone] = useState<Tone>('formal');
  const [selectedRigor, setSelectedRigor] = useState<RigorLevel>('balanced');
  const [generatedResult, setGeneratedResult] = useState<BuildPromptResult | null>(null);

  const i18n = getI18n(locale);
  const categories = getCatalog(locale);
  const currentCategory = getCategoryById(selectedCategoryId, locale) || categories[0];
  const currentObjective =
    getObjectiveById(selectedCategoryId, selectedObjectiveId, locale) ||
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
      locale,
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

  const handleLocaleChange = (newLocale: Locale) => {
    setUserLocale(newLocale);
    // If a prompt has already been generated, re-build it in the newly selected language
    if (generatedResult) {
      const refreshed = buildPrompt({
        categoryId: selectedCategoryId,
        objectiveId: selectedObjectiveId,
        fieldValues,
        tone: selectedTone,
        rigor: selectedRigor,
        locale: newLocale,
      });
      setGeneratedResult(refreshed);
    }
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

          {/* Right Header: How it Works & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserModalOpen(true)}
              className="gap-1.5 text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="size-3.5" />
              <span className="hidden sm:inline">{i18n.header.howItWorks}</span>
            </Button>

            {/* Language Switcher */}
            <div
              className="flex items-center gap-0.5 rounded-lg border bg-muted/60 p-0.5 text-xs font-semibold"
              aria-label={i18n.header.languageLabel}
            >
              <button
                type="button"
                onClick={() => handleLocaleChange('en')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  locale === 'en'
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLocaleChange('pt')}
                className={`px-2 py-1 rounded-md transition-colors ${
                  locale === 'pt'
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                PT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Top Info Banner */}
      <aside className="border-b bg-amber-500/10 border-amber-500/20 px-4 py-2.5 text-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-900 dark:text-amber-200">
              <strong className="font-semibold">{i18n.banner.title}</strong>{' '}
              {i18n.banner.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setUserModalOpen(true)}
            className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80 text-amber-950 dark:text-amber-100 cursor-pointer"
          >
            {i18n.banner.learnMore}
          </button>
        </div>
      </aside>

      {/* Main Wizard Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* Progress Stepper */}
        <Stepper
          currentStep={currentStep}
          totalSteps={5}
          onStepClick={(step) => setCurrentStep(step)}
          i18n={i18n}
        />

        {/* Step Views */}
        <div className="rounded-2xl border bg-card p-5 sm:p-8 shadow-xs">
          {currentStep === 1 && (
            <StepCategory
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectCategory}
              i18n={i18n}
            />
          )}

          {currentStep === 2 && currentCategory && (
            <StepObjective
              objectives={currentCategory.objectives}
              selectedObjectiveId={selectedObjectiveId}
              onSelectObjective={handleSelectObjective}
              i18n={i18n}
            />
          )}

          {currentStep === 3 && currentObjective && (
            <StepDetails
              objective={currentObjective}
              fieldValues={fieldValues}
              onChangeField={handleFieldChange}
              i18n={i18n}
            />
          )}

          {currentStep === 4 && (
            <StepRigor
              selectedTone={selectedTone}
              selectedRigor={selectedRigor}
              onSelectTone={setSelectedTone}
              onSelectRigor={setSelectedRigor}
              i18n={i18n}
            />
          )}

          {currentStep === 5 && generatedResult && (
            <StepResult
              result={generatedResult}
              onEdit={handleEditInputs}
              onStartOver={handleStartOver}
              i18n={i18n}
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

      {/* Onboarding Dialog Modal */}
      <OnboardingModal
        open={isOnboardingOpen}
        onOpenChange={handleOpenChange}
        i18n={i18n}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950" />}>
      <WizardApp />
    </Suspense>
  );
}
