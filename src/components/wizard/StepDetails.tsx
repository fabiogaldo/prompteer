'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Objective } from '@/core/types';
import { I18nDictionary } from '@/i18n/index';
import { Info } from 'lucide-react';

interface StepDetailsProps {
  objective: Objective;
  fieldValues: Record<string, string>;
  onChangeField: (fieldId: string, value: string) => void;
  i18n: I18nDictionary;
}

export function StepDetails({
  objective,
  fieldValues,
  onChangeField,
  i18n,
}: StepDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {i18n.stepDetails.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {i18n.stepDetails.subtitle}
        </p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-950 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
        <Info className="size-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <p className="leading-relaxed">{i18n.stepDetails.tipNotice}</p>
      </div>

      <div className="space-y-5">
        {objective.fields.map((field) => {
          const value = fieldValues[field.id] || '';

          return (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none text-foreground"
                >
                  {field.label}
                </label>
                <Badge
                  variant={field.required ? 'outline' : 'secondary'}
                  className="text-[10px] font-normal px-2 py-0"
                >
                  {field.required ? i18n.stepDetails.requiredTag : i18n.stepDetails.optionalTag}
                </Badge>
              </div>

              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}

              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  rows={3}
                  value={value}
                  onChange={(e) => onChangeField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full text-sm resize-y"
                />
              ) : (
                <Input
                  id={field.id}
                  type="text"
                  value={value}
                  onChange={(e) => onChangeField(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full text-sm"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
