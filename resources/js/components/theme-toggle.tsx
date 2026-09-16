import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className={`size-9 rounded-lg border-sidebar-border text-foreground hover:bg-muted ${className}`}
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="size-4 text-amber-400 transition-transform duration-200" />
            ) : (
                <Moon className="size-4 text-slate-700 dark:text-slate-200 transition-transform duration-200" />
            )}
        </Button>
    );
}

