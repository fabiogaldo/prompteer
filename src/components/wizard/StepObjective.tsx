'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Objective } from '@/core/types';
import { getAgent } from '@/core/agents';
import { I18nDictionary } from '@/i18n/index';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface StepObjectiveProps {
  objectives: Objective[];
  selectedObjectiveId: string;
  onSelectObjective: (objective: Objective) => void;
  i18n: I18nDictionary;
}

export function StepObjective({
  objectives,
  selectedObjectiveId,
  onSelectObjective,
  i18n,
}: StepObjectiveProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {i18n.stepObjective.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {i18n.stepObjective.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.map((objective) => {
          const isSelected = objective.id === selectedObjectiveId;
          const agent = getAgent(objective.recommendedAgent);

          return (
            <Card
              key={objective.id}
              onClick={() => onSelectObjective(objective)}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
                  : 'hover:border-foreground/30'
              }`}
            >
              <CardHeader className="space-y-2 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Sparkles className="size-3 text-amber-500" />
                    <span>{i18n.stepObjective.recommendedAgentLabel}</span>
                    <strong className="font-semibold text-foreground">{agent.name}</strong>
                  </Badge>

                  {isSelected && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="size-3.5" />
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg font-semibold">{objective.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {objective.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {i18n.stepObjective.previewLabel}
                  </p>
                  <div className="rounded-lg bg-muted/60 p-3 border font-mono text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {objective.outputPreviewSnippet}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
