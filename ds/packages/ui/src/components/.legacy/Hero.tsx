import React from 'react';
import { cn } from '../../helpers/cn';
import { Button } from '../../components/atoms/button';
import { Badge } from '../../components/atoms/Badge';
import { Stack, Inline, Box, Container } from '../../components/layout';
import { ArrowRight, PlayCircle } from 'lucide-react';

export interface HeroProps {
  variant?: 'clean' | 'split' | 'immersive';
  title: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  imageSrc?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  variant = 'split',
  title,
  subtitle,
  badge,
  ctaText = 'Comenzar Ahora',
  secondaryCtaText,
  imageSrc,
  onCtaClick,
  className = ''
}) => {

  if (variant === 'clean') {
    return (
      <Box 
        radius="3xl" 
        border
        className={cn("relative overflow-hidden text-center shadow-sm", className)}
        paddingY={24}
        paddingX={6}
        style={{ 
            background: `radial-gradient(at 0% 0%, var(--lpd-color-brand-primary) 0px, transparent 50%), radial-gradient(at 100% 100%, var(--lpd-color-brand-secondary) 0px, transparent 50%)`,
            backgroundColor: 'var(--lpd-color-bg-subtle)'
        }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               background: 'radial-gradient(var(--lpd-color-text-base) 1px, transparent 1px)', 
               backgroundSize: '20px 20px'
             }} 
        />

        <Container size="md" className="relative z-10">
          <Stack gap={8} align="center">
            {badge && <Badge variant="brand" className="shadow-sm">{badge}</Badge>}
            <h1 className="text-5xl md:text-7xl font-black text-[var(--lpd-color-text-base)] tracking-tight leading-[1.1]">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--lpd-color-text-muted)] max-w-2xl leading-relaxed font-medium">
              {subtitle}
            </p>
            <Inline gap={4} justify="center">
              <Button size="lg" onClick={onCtaClick} rightIcon={<ArrowRight size={20}/>}>
                {ctaText}
              </Button>
              {secondaryCtaText && (
                 <Button size="lg" variant="outline" leftIcon={<PlayCircle size={20}/>}>
                   {secondaryCtaText}
                 </Button>
              )}
            </Inline>
          </Stack>
        </Container>
      </Box>
    );
  }

  // --- Variant 2: Immersive (Image Background) ---
  if (variant === 'immersive') {
    return (
      <div className={cn("relative overflow-hidden rounded-[40px] min-h-[600px] flex items-center shadow-2xl", className)}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
             {imageSrc ? (
                 <img src={imageSrc} alt="Hero bg" className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full bg-[var(--lpd-color-slate-900)]" />
             )}
             {/* Gradient Overlay for Text Readability */}
             <div className="absolute inset-0 bg-gradient-to-r from-[var(--lpd-color-slate-950)]/90 to-transparent" />
        </div>

        <Container className="relative z-10 w-full py-24">
            <Stack gap={8} className="max-w-3xl">
                {badge && <Badge variant="inverse" className="self-start">{badge}</Badge>}
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                    {title}
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed max-w-xl font-medium">
                    {subtitle}
                </p>
                <Inline gap={4}>
                    <Button 
                        size="lg" 
                        className="bg-white text-[var(--lpd-color-slate-950)] hover:bg-slate-100 border-transparent shadow-xl"
                        onClick={onCtaClick}
                    >
                        {ctaText}
                    </Button>
                     {secondaryCtaText && (
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 backdrop-blur-md">
                            {secondaryCtaText}
                        </Button>
                    )}
                </Inline>
            </Stack>
        </Container>
      </div>
    );
  }

  // --- Variant 3: Split (Default) ---
  return (
    <Box background="base" radius="3xl" border className={cn("overflow-hidden shadow-sm", className)}>
        <div className="flex flex-col lg:flex-row items-center gap-0">
          <Stack gap={8} className="flex-1 p-8 md:p-12 lg:p-20">
              {badge && <Badge variant="neutral" className="self-start">{badge}</Badge>}
              <h1 className="text-4xl md:text-6xl font-black text-[var(--lpd-color-text-base)] tracking-tight leading-[1.1]">
                  {title}
              </h1>
              <p className="text-lg md:text-xl text-[var(--lpd-color-text-muted)] leading-relaxed font-medium">
                  {subtitle}
              </p>
              <Inline gap={4}>
                  <Button size="lg" onClick={onCtaClick}>
                      {ctaText}
                  </Button>
                  {secondaryCtaText && (
                      <Button size="lg" variant="ghost">
                          {secondaryCtaText}
                      </Button>
                  )}
              </Inline>
              
              {/* Trust Indicator Mini */}
              <Box paddingY={6} className="mt-4 border-t border-[var(--lpd-color-border-subtle)]">
                <Inline gap={4} align="center">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-9 h-9 rounded-full bg-[var(--lpd-color-bg-subtle)] border-2 border-[var(--lpd-color-bg-base)] flex items-center justify-center text-[10px] font-bold">
                            {i}
                          </div>
                        ))}
                    </div>
                    <p className="text-sm font-bold text-[var(--lpd-color-text-muted)]">Trusted by <span className="text-[var(--lpd-color-brand-primary)]">2,000+</span> global teams</p>
                </Inline>
              </Box>
          </Stack>
          
          <div className="w-full lg:w-1/2 h-80 lg:h-auto self-stretch bg-[var(--lpd-color-bg-subtle)] relative overflow-hidden">
               {imageSrc ? (
                   <img src={imageSrc} alt="Hero" className="w-full h-full object-cover absolute inset-0" />
               ) : (
                  <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, var(--lpd-color-brand-primary) 0%, var(--lpd-color-brand-secondary) 100%)`, opacity: 0.15 }}
                  >
                      <div className="absolute inset-0 opacity-[0.1]" 
                           style={{ 
                             background: 'radial-gradient(var(--lpd-color-text-base) 1px, transparent 1px)', 
                             backgroundSize: '32px 32px'
                           }} 
                      />
                      <span className="font-black text-4xl opacity-20 tracking-widest uppercase">Visual Asset</span>
                  </div>
               )}
          </div>
        </div>
    </Box>
  );
};
