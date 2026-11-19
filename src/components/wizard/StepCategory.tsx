'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/core/types';
import { I18nDictionary } from '@/i18n/index';
import { Briefcase, ShoppingBag, Palette, CheckCircle2 } from 'lucide-react';

interface StepCategoryProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (category: Category) => void;
  i18n: I18nDictionary;
}

export function StepCategory({
  categories,
  selectedCategoryId,
  onSelectCategory,
  i18n,
}: StepCategoryProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="size-6 text-blue-600 dark:text-blue-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="size-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Palette':
        return <Palette className="size-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <Briefcase className="size-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {i18n.stepCategory.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {i18n.stepCategory.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;

          return (
            <Card
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
                  : 'hover:border-foreground/30'
              }`}
            >
              <CardHeader className="space-y-2 pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-background border shadow-xs">
                    {getIcon(category.icon)}
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="size-3.5" />
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {i18n.stepCategory.exampleUseCasesLabel}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.exampleUseCases.map((example) => (
                      <Badge
                        key={example}
                        variant="secondary"
                        className="text-[11px] font-normal py-0 px-2"
                      >
                        {example}
                      </Badge>
                    ))}
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
