'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RigorLevel, Tone } from '@/core/types';
import { i18n } from '@/i18n/en';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Scale,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react';

interface StepRigorProps {
  selectedTone: Tone;
  selectedRigor: RigorLevel;
  onSelectTone: (tone: Tone) => void;
  onSelectRigor: (rigor: RigorLevel) => void;
}

const TONE_OPTIONS: { id: Tone; key: keyof typeof i18n.stepRigor.tones }[] = [
  { id: 'formal', key: 'formal' },
  { id: 'direct', key: 'direct' },
  { id: 'friendly', key: 'friendly' },
  { id: 'persuasive', key: 'persuasive' },
];

const RIGOR_OPTIONS: {
  id: RigorLevel;
  key: keyof typeof i18n.stepRigor.rigorLevels;
  icon: typeof Sparkles;
}[] = [
  { id: 'creative', key: 'creative', icon: Sparkles },
  { id: 'balanced', key: 'balanced', icon: Scale },
  { id: 'strict', key: 'strict', icon: ShieldAlert },
];

export function StepRigor({
  selectedTone,
  selectedRigor,
  onSelectTone,
  onSelectRigor,
}: StepRigorProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {i18n.stepRigor.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {i18n.stepRigor.subtitle}
        </p>
      </div>

      {/* Section 1: Tone of Voice */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            {i18n.stepRigor.toneSectionTitle}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {i18n.stepRigor.toneSectionSubtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONE_OPTIONS.map((item) => {
            const toneData = i18n.stepRigor.tones[item.key];
            const isSelected = selectedTone === item.id;

            return (
              <Card
                key={item.id}
                onClick={() => onSelectTone(item.id)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-xs p-3.5 flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
                    : 'hover:border-foreground/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {toneData.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {toneData.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 2: Factuality & Verification Rigor */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            {i18n.stepRigor.rigorSectionTitle}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {i18n.stepRigor.rigorSectionSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {RIGOR_OPTIONS.map((item) => {
            const rigorData = i18n.stepRigor.rigorLevels[item.key];
            const isSelected = selectedRigor === item.id;
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                onClick={() => onSelectRigor(item.id)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-xs p-4 flex flex-col justify-between ${
                  isSelected
                    ? item.id === 'strict'
                      ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
                    : 'hover:border-foreground/30'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <div className="p-1.5 rounded-md bg-muted">
                      <Icon className={`size-4 ${item.id === 'strict' ? 'text-amber-600' : 'text-primary'}`} />
                    </div>
                    <Badge
                      variant={item.id === 'strict' ? 'outline' : 'secondary'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {rigorData.badge}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {rigorData.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className={`size-4 ${item.id === 'strict' ? 'text-amber-600' : 'text-primary'}`} />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rigorData.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Prominent Educational Warning when Strict Rigor is selected */}
        {selectedRigor === 'strict' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {i18n.stepRigor.strictNotice.title}
                </h4>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/90">
                  {i18n.stepRigor.strictNotice.body}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
