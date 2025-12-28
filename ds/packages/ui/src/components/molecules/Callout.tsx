import React from 'react';
import { cn } from '@/helpers/cn';
import { Button } from '@/components/atoms/button';
import { Megaphone, ArrowRight } from 'lucide-react';
import { Stack, Inline, Box } from '@/components/layout';

export interface CalloutProps {
  title: string;
  description: string;
  primaryAction: { label: string; onClick?: () => void };
  secondaryAction?: { label: string; onClick?: () => void };
  icon?: React.ReactNode;
  variant?: 'brand' | 'neutral';
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  variant = 'brand',
  className = ''
}) => {
  
  const isBrand = variant === 'brand';

  return (
    <div 
        className={cn(
            "relative overflow-hidden rounded-[32px] shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
            isBrand ? "bg-[var(--lpd-color-brand-primary)] text-[var(--lpd-color-text-base)]" : "bg-[var(--lpd-color-slate-900)] text-white",
            className
        )}
    >
        {/* Decorative Background Circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <Box padding={8} md={{ padding: 12 }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left">
            <Box 
                background={isBrand ? 'inverse' : 'subtle'} 
                radius="2xl" 
                className="shrink-0 w-16 h-16 flex items-center justify-center shadow-lg"
            >
                {icon || <Megaphone size={28} />}
            </Box>

            <Stack gap={2} className="flex-1 relative z-10">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h3>
                <p className={cn(
                    "text-base md:text-lg leading-relaxed font-medium opacity-80",
                    !isBrand && "text-slate-400"
                )}>
                    {description}
                </p>
            </Stack>

            <Inline gap={3} className="shrink-0 relative z-10 w-full md:w-auto" align="center" justify="center">
                {secondaryAction && (
                    <Button 
                        variant="outline" 
                        className={isBrand ? "border-black/10 text-[var(--lpd-color-text-base)] hover:bg-black/5" : "border-slate-700 text-slate-300 hover:bg-slate-800"}
                        onClick={secondaryAction.onClick}
                    >
                        {secondaryAction.label}
                    </Button>
                )}
                <Button 
                    variant={isBrand ? 'primary' : 'secondary'}
                    className={isBrand ? "bg-[var(--lpd-color-text-base)] text-white hover:brightness-110 shadow-lg" : ""}
                    onClick={primaryAction.onClick}
                    rightIcon={<ArrowRight size={18}/>}
                >
                    {primaryAction.label}
                </Button>
            </Inline>
          </div>
        </Box>
    </div>
  );
};
