import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Plus,
    Users,
} from 'lucide-react';

import { DashboardCharts } from '@/components/dashboard-charts';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    yr_level: string;
    birthday: string;
    status?: string;
    age?: number;
}

interface DashboardProps {
    totalStudents?: number;
    programCounts?: Record<string, number>;
    genderCounts?: Record<string, number>;
    yearLevelCounts?: Record<string, number>;
    statusCounts?: Record<string, number>;
    recentStudents?: Student[];
}

export default function Dashboard({
    totalStudents = 0,
    programCounts = {},
    genderCounts = {},
    yearLevelCounts = {},
    statusCounts = {},
    recentStudents = [],
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Welcome to the student management system.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <AppearanceToggleTab />
                        <Button asChild className="gap-2 shrink-0">
                            <Link href="/students">
                                <Plus className="size-4" />
                                Manage Students
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Total Students Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                <h3 className="text-3xl font-bold tracking-tight mt-2">{totalStudents.toLocaleString()}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Registered in database</p>
                            </div>
                            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Users className="size-6" />
                            </div>
                        </div>
                    </div>

                    {/* Programs Breakdown Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-6 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-muted-foreground">Programs Distribution</p>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                <BookOpen className="size-4" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(programCounts).length > 0 ? (
                                Object.entries(programCounts).map(([prog, count]) => (
                                    <div
                                        key={prog}
                                        className="flex items-center gap-1.5 rounded-lg border border-sidebar-border px-2.5 py-1 text-xs"
                                    >
                                        <span className="font-semibold text-foreground">{prog}:</span>
                                        <span className="text-muted-foreground font-mono">{count}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground">No program data yet</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-6 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <GraduationCap className="size-4" />
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-foreground mt-2">Students CRUD Tab</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Search, add, update, and remove students in real-time.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="w-full mt-4 justify-between">
                            <Link href="/students">
                                <span>Go to Students Tab</span>
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Interactive Visual Charts Section */}
                <div className="space-y-3">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">Student Analytics & Visual Insights</h2>
                        <p className="text-xs text-muted-foreground">
                            Interactive visual breakdown of academic programs, gender ratio, year cohorts, and student statuses.
                        </p>
                    </div>
                    <DashboardCharts
                        totalStudents={totalStudents}
                        programCounts={programCounts}
                        genderCounts={genderCounts}
                        yearLevelCounts={yearLevelCounts}
                        statusCounts={statusCounts}
                    />
                </div>

                {/* Recent Students Table Section */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-xs">
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">Recently Registered Students</h2>
                            <p className="text-xs text-muted-foreground">Latest students added to the system</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
                            <Link href="/students">
                                View All Students
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Program</th>
                                    <th className="px-4 py-3">Year Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/60">
                                {recentStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                                            No student records available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                                #{student.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {student.first_name} {student.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary">{student.program}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">Year {student.yr_level}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
