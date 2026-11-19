'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { I18nDictionary } from '@/i18n/index';
import { Sparkles, ShieldCheck, ExternalLink, Info } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  i18n: I18nDictionary;
}

export function OnboardingModal({ open, onOpenChange, i18n }: OnboardingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-5">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold">
              {i18n.onboardingModal.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {i18n.onboardingModal.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* 3 Steps Overview */}
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
            <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5 shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                {i18n.onboardingModal.step1Title}
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {i18n.onboardingModal.step1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mt-0.5 shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                {i18n.onboardingModal.step2Title}
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {i18n.onboardingModal.step2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
            <div className="p-1.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 mt-0.5 shrink-0">
              <ExternalLink className="size-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">
                {i18n.onboardingModal.step3Title}
              </h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {i18n.onboardingModal.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Core Concept Banner */}
        <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-3 dark:border-amber-800 dark:bg-amber-950/40 text-xs">
          <div className="flex items-start gap-2">
            <Info className="size-4 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-semibold text-amber-900 dark:text-amber-200">
                {i18n.onboardingModal.coreNoticeTitle}
              </strong>{' '}
              <span className="text-amber-800 dark:text-amber-300">
                {i18n.onboardingModal.coreNoticeBody}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto text-xs font-semibold"
          >
            {i18n.onboardingModal.dismissButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

