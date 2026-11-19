'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BuildPromptResult } from '@/core/types';
import { I18nDictionary } from '@/i18n/index';
import { toast } from 'sonner';
import {
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface StepResultProps {
  result: BuildPromptResult;
  onEdit: () => void;
  onStartOver: () => void;
  i18n: I18nDictionary;
}

export function StepResult({ result, onEdit, onStartOver, i18n }: StepResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyOnly = async () => {
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      toast.success(i18n.stepResult.copySuccessToast);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(i18n.stepResult.copyErrorToast);
    }
  };

  const handlePrimaryCTA = async () => {
    try {
      // 1. Copy to clipboard first
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);

      // 2. Trigger notification
      if (result.actionType === 'open_direct') {
        toast.success(
          i18n.stepResult.openDirectToast.replace('{agent}', result.recommendedAgent.name)
        );
      } else {
        toast.success(
          i18n.stepResult.copyAndOpenToast.replace('{agent}', result.recommendedAgent.name)
        );
      }

      // 3. Open target URL in a new tab
      window.open(result.targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback if clipboard API throws
      window.open(result.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const primaryCTAText =
    result.actionType === 'open_direct'
      ? i18n.stepResult.openDirectCTA.replace('{agent}', result.recommendedAgent.name)
      : i18n.stepResult.copyAndOpenCTA.replace('{agent}', result.recommendedAgent.name);

  const charCountText = i18n.stepResult.charCount.replace(
    '{count}',
    String(result.charCount)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {i18n.stepResult.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {i18n.stepResult.subtitle}
        </p>
      </div>

      {/* Recommended Agent Card */}
      <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                {i18n.stepResult.recommendedAgentCardTitle}: {result.recommendedAgent.name}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              {result.recommendedAgent.name}
            </Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            <strong>{i18n.stepResult.whyAgent}</strong> {result.agentReason}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Generated Prompt Box */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 border-b">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {i18n.stepResult.promptBoxTitle}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono">
                {charCountText}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyOnly}
                className="gap-1.5 text-xs h-7"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span>{i18n.stepResult.copiedPrompt}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>{i18n.stepResult.copyPrompt}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <pre className="font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap bg-muted/40 p-4 rounded-lg border max-h-[420px] overflow-y-auto select-all">
            {result.prompt}
          </pre>
        </CardContent>
      </Card>

      {/* Primary and Secondary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <Button
          size="lg"
          onClick={handlePrimaryCTA}
          className="flex-1 gap-2 font-semibold text-sm shadow-md"
        >
          <ExternalLink className="size-4" />
          <span>{primaryCTAText}</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleCopyOnly}
          className="gap-2 text-sm"
        >
          {copied ? (
            <>
              <Check className="size-4 text-emerald-600" />
              <span>{i18n.stepResult.copiedPrompt}</span>
            </>
          ) : (
            <>
              <Copy className="size-4" />
              <span>{i18n.stepResult.copyPrompt}</span>
            </>
          )}
        </Button>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t text-xs text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="gap-1.5 text-xs"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>{i18n.stepResult.editSettings}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onStartOver}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          <span>{i18n.stepResult.createAnother}</span>
        </Button>
      </div>
    </div>
  );
}
