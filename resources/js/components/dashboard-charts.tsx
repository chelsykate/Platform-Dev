import { BookOpen, GraduationCap, Users } from 'lucide-react';
import { useState } from 'react';

interface DashboardChartsProps {
    totalStudents: number;
    programCounts: Record<string, number>;
    genderCounts: Record<string, number>;
    yearLevelCounts: Record<string, number>;
    statusCounts: Record<string, number>;
}

export function DashboardCharts({
    totalStudents,
    programCounts,
    genderCounts,
    yearLevelCounts,
    statusCounts,
}: DashboardChartsProps) {
    const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
    const [hoveredGender, setHoveredGender] = useState<string | null>(null);

    // Programs data
    const programsList = ['BSIT', 'BSCS', 'BSIS'];
    const maxProgramCount = Math.max(...programsList.map((p) => programCounts[p] || 0), 1);

    // Gender data
    const femaleCount = genderCounts['female'] || 0;
    const maleCount = genderCounts['male'] || 0;
    const otherCount = genderCounts['other'] || 0;
    const totalGender = femaleCount + maleCount + otherCount || 1;

    // SVG donut calculations
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const femalePct = (femaleCount / totalGender) * 100;
    const malePct = (maleCount / totalGender) * 100;
    const otherPct = (otherCount / totalGender) * 100;

    const femaleStroke = (femalePct / 100) * circumference;
    const maleStroke = (malePct / 100) * circumference;
    const otherStroke = (otherPct / 100) * circumference;

    const femaleOffset = 0;
    const maleOffset = -femaleStroke;
    const otherOffset = -(femaleStroke + maleStroke);

    // Status counts
    const activeCount = statusCounts['active'] || 0;
    const inactiveCount = statusCounts['inactive'] || 0;
    const graduatedCount = statusCounts['graduated'] || 0;

    // Year level data
    const yearLevels = [
        { label: '1st Year', key: '1', color: 'bg-blue-500' },
        { label: '2nd Year', key: '2', color: 'bg-cyan-500' },
        { label: '3rd Year', key: '3', color: 'bg-indigo-500' },
        { label: '4th Year', key: '4', color: 'bg-purple-500' },
    ];
    const maxYearCount = Math.max(...yearLevels.map((y) => yearLevelCounts[y.key] || 0), 1);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. PROGRAM DISTRIBUTION BAR CHART */}
            <div className="flex flex-col rounded-xl border border-sidebar-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                    <div>
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <BookOpen className="size-4 text-blue-500" />
                            Enrollment by Program
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Students per academic degree</p>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {programsList.length} Programs
                    </span>
                </div>

                <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
                    {programsList.map((program) => {
                        const count = programCounts[program] || 0;
                        const percentage = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0';
                        const barWidth = `${Math.round((count / maxProgramCount) * 100)}%`;

                        const barColor =
                            program === 'BSIT'
                                ? 'bg-blue-500 dark:bg-blue-600'
                                : program === 'BSCS'
                                  ? 'bg-emerald-500 dark:bg-emerald-600'
                                  : 'bg-purple-500 dark:bg-purple-600';

                        return (
                            <div
                                key={program}
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredProgram(program)}
                                onMouseLeave={() => setHoveredProgram(null)}
                            >
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        <span className={`size-2 rounded-full ${barColor}`} />
                                        {program}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-foreground font-mono">{count}</span>
                                        <span className="text-muted-foreground font-mono text-[11px]">
                                            ({percentage}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden relative">
                                    <div
                                        className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out group-hover:brightness-110`}
                                        style={{ width: barWidth }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-[11px] text-muted-foreground pt-3 border-t border-sidebar-border/40 text-center">
                    Hover over bars to inspect program enrollment ratios
                </div>
            </div>

            {/* 2. GENDER RATIO DONUT CHART */}
            <div className="flex flex-col rounded-xl border border-sidebar-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                    <div>
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <Users className="size-4 text-pink-500" />
                            Gender Ratio
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Distribution across student body</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-3">
                    <div className="relative size-36 flex items-center justify-center">
                        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background Track */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="12"
                                className="text-muted/30"
                            />
                            {/* Female Arc */}
                            {femaleStroke > 0 && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#ec4899"
                                    strokeWidth="12"
                                    strokeDasharray={`${femaleStroke} ${circumference}`}
                                    strokeDashoffset={femaleOffset}
                                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                    onMouseEnter={() => setHoveredGender('Female')}
                                    onMouseLeave={() => setHoveredGender(null)}
                                />
                            )}
                            {/* Male Arc */}
                            {maleStroke > 0 && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#3b82f6"
                                    strokeWidth="12"
                                    strokeDasharray={`${maleStroke} ${circumference}`}
                                    strokeDashoffset={maleOffset}
                                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                    onMouseEnter={() => setHoveredGender('Male')}
                                    onMouseLeave={() => setHoveredGender(null)}
                                />
                            )}
                            {/* Other Arc */}
                            {otherStroke > 0 && (
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke="#a855f7"
                                    strokeWidth="12"
                                    strokeDasharray={`${otherStroke} ${circumference}`}
                                    strokeDashoffset={otherOffset}
                                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                    onMouseEnter={() => setHoveredGender('Other')}
                                    onMouseLeave={() => setHoveredGender(null)}
                                />
                            )}
                        </svg>

                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-xs font-medium text-muted-foreground">
                                {hoveredGender || 'Total'}
                            </span>
                            <span className="text-xl font-bold tracking-tight text-foreground font-mono">
                                {hoveredGender === 'Female'
                                    ? femaleCount
                                    : hoveredGender === 'Male'
                                      ? maleCount
                                      : hoveredGender === 'Other'
                                        ? otherCount
                                        : totalStudents}
                            </span>
                        </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="flex items-center justify-center gap-4 mt-4 w-full text-xs">
                        <div
                            className="flex items-center gap-1.5 cursor-pointer"
                            onMouseEnter={() => setHoveredGender('Female')}
                            onMouseLeave={() => setHoveredGender(null)}
                        >
                            <span className="size-2.5 rounded-full bg-pink-500" />
                            <span className="text-muted-foreground">Female</span>
                            <span className="font-semibold font-mono">({femalePct.toFixed(0)}%)</span>
                        </div>
                        <div
                            className="flex items-center gap-1.5 cursor-pointer"
                            onMouseEnter={() => setHoveredGender('Male')}
                            onMouseLeave={() => setHoveredGender(null)}
                        >
                            <span className="size-2.5 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">Male</span>
                            <span className="font-semibold font-mono">({malePct.toFixed(0)}%)</span>
                        </div>
                    </div>
                </div>

                <div className="text-[11px] text-muted-foreground pt-3 border-t border-sidebar-border/40 text-center">
                    Interactive donut: hover on segments or legend to preview
                </div>
            </div>

            {/* 3. YEAR LEVEL DISTRIBUTION */}
            <div className="flex flex-col rounded-xl border border-sidebar-border bg-card p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-sidebar-border/60">
                    <div>
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <GraduationCap className="size-4 text-purple-500" />
                            Year Level Cohorts
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Student counts across 4 year levels</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-3 space-y-3.5">
                    {yearLevels.map((year) => {
                        const count = yearLevelCounts[year.key] || 0;
                        const percentage = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0';
                        const barWidth = `${Math.round((count / maxYearCount) * 100)}%`;

                        return (
                            <div key={year.key} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-medium text-foreground">{year.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold font-mono text-foreground">{count}</span>
                                        <span className="text-[11px] text-muted-foreground font-mono">
                                            ({percentage}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${year.color} transition-all duration-500`}
                                        style={{ width: barWidth }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-[11px] text-muted-foreground pt-3 border-t border-sidebar-border/40 text-center">
                    Visual cohort progression from 1st Year to 4th Year
                </div>
            </div>

            {/* 4. STUDENT STATUS BREAKDOWN BAR (Spans full width or 3 columns) */}
            <div className="md:col-span-2 lg:col-span-3 rounded-xl border border-sidebar-border bg-card p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-sidebar-border/60">
                    <div>
                        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            Student Status Breakdown
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Real-time tracking of Active, Inactive, and Graduated students
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Active: {activeCount}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Inactive: {inactiveCount}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                            <GraduationCap className="size-3 text-purple-500" />
                            Graduated: {graduatedCount}
                        </span>
                    </div>
                </div>

                {/* Status Segmented Progress Bar */}
                <div className="mt-4">
                    <div className="h-4 w-full rounded-full bg-muted/60 overflow-hidden flex">
                        {activeCount > 0 && (
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500 hover:brightness-110"
                                style={{ width: `${(activeCount / (totalStudents || 1)) * 100}%` }}
                                title={`Active: ${activeCount} (${((activeCount / (totalStudents || 1)) * 100).toFixed(1)}%)`}
                            />
                        )}
                        {inactiveCount > 0 && (
                            <div
                                className="h-full bg-amber-500 transition-all duration-500 hover:brightness-110"
                                style={{ width: `${(inactiveCount / (totalStudents || 1)) * 100}%` }}
                                title={`Inactive: ${inactiveCount} (${((inactiveCount / (totalStudents || 1)) * 100).toFixed(1)}%)`}
                            />
                        )}
                        {graduatedCount > 0 && (
                            <div
                                className="h-full bg-purple-500 transition-all duration-500 hover:brightness-110"
                                style={{ width: `${(graduatedCount / (totalStudents || 1)) * 100}%` }}
                                title={`Graduated: ${graduatedCount} (${((graduatedCount / (totalStudents || 1)) * 100).toFixed(1)}%)`}
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 font-mono">
                        <span>
                            Active: {totalStudents > 0 ? ((activeCount / totalStudents) * 100).toFixed(1) : 0}%
                        </span>
                        <span>
                            Inactive: {totalStudents > 0 ? ((inactiveCount / totalStudents) * 100).toFixed(1) : 0}%
                        </span>
                        <span>
                            Graduated: {totalStudents > 0 ? ((graduatedCount / totalStudents) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
