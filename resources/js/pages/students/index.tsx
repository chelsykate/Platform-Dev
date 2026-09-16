import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Loader2,
    Mail,
    Pencil,
    Plus,
    Search,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

interface Student {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    program: string;
    gender: string;
    birthday: string;
    yr_level: string;
    status?: 'active' | 'inactive' | 'graduated';
    age?: number;
    created_at?: string;
    updated_at?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedStudents {
    data: Student[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    students: PaginatedStudents;
    filters: {
        search?: string;
        program?: string;
        status?: string;
    };
    programs: string[];
    statusCounts?: {
        all: number;
        active: number;
        inactive: number;
        graduated: number;
    };
}

const PROGRAM_OPTIONS = ['BSIT', 'BSCS', 'BSIS'];
const GENDER_OPTIONS = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Other', value: 'other' },
];
const YEAR_LEVEL_OPTIONS = [
    { label: '1st Year', value: '1' },
    { label: '2nd Year', value: '2' },
    { label: '3rd Year', value: '3' },
    { label: '4th Year', value: '4' },
];
const STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Graduated', value: 'graduated' },
];

export default function StudentsIndex({
    students,
    filters,
    programs,
    statusCounts = { all: 0, active: 0, inactive: 0, graduated: 0 },
}: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedProgram, setSelectedProgram] = useState(filters.program || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<Student | null>(null);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Create form
    const createForm = useForm({
        first_name: '',
        last_name: '',
        email: '',
        program: 'BSIT',
        gender: 'female',
        birthday: '',
        yr_level: '1',
        status: 'active',
    });

    // Edit form
    const editForm = useForm({
        first_name: '',
        last_name: '',
        email: '',
        program: 'BSIT',
        gender: 'female',
        birthday: '',
        yr_level: '1',
        status: 'active',
    });

    // Delete form
    const deleteForm = useForm({});

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/students',
            {
                search: searchQuery || undefined,
                program: selectedProgram === 'all' ? undefined : selectedProgram,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusTabChange = (statusVal: string) => {
        setSelectedStatus(statusVal);
        router.get(
            '/students',
            {
                search: searchQuery || undefined,
                program: selectedProgram === 'all' ? undefined : selectedProgram,
                status: statusVal === 'all' ? undefined : statusVal,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedProgram('all');
        setSelectedStatus('all');
        router.get('/students', {}, { preserveState: true, replace: true });
    };

    const openEditDialog = (student: Student) => {
        setActiveStudent(student);
        const bday = student.birthday ? student.birthday.substring(0, 10) : '';
        editForm.setData({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            program: student.program,
            gender: student.gender,
            birthday: bday,
            yr_level: String(student.yr_level),
            status: student.status || 'active',
        });
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const openDeleteDialog = (student: Student) => {
        setActiveStudent(student);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/students', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Student added successfully.');
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeStudent) return;
        editForm.put(`/students/${activeStudent.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                setActiveStudent(null);
                toast.success('Student updated successfully.');
            },
        });
    };

    const handleDeleteSubmit = () => {
        if (!activeStudent) return;
        deleteForm.delete(`/students/${activeStudent.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setActiveStudent(null);
                toast.success('Student removed successfully.');
            },
        });
    };

    // Format birthday for display
    const formatBirthday = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Color variant for program badge
    const getProgramBadge = (program: string) => {
        switch (program) {
            case 'BSIT':
                return <Badge className="bg-blue-600 hover:bg-blue-600 text-white">BSIT</Badge>;
            case 'BSCS':
                return <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">BSCS</Badge>;
            case 'BSIS':
                return <Badge className="bg-purple-600 hover:bg-purple-600 text-white">BSIS</Badge>;
            default:
                return <Badge variant="secondary">{program}</Badge>;
        }
    };

    // Status Badge Component
    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Inactive
                    </span>
                );
            case 'graduated':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <GraduationCap className="size-3 text-purple-500" />
                        Graduated
                    </span>
                );
            case 'active':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Active
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Students Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header with Title and Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="size-7 text-primary" />
                            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage student records, track enrollment statuses, search, and perform CRUD operations.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            createForm.reset();
                            createForm.clearErrors();
                            setIsCreateOpen(true);
                        }}
                        className="gap-2 shrink-0"
                    >
                        <Plus className="size-4" />
                        Add Student
                    </Button>
                </div>

                {/* Status Tabs Navigation */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'All Students', count: statusCounts.all },
                        { key: 'active', label: 'Active', count: statusCounts.active, color: 'text-emerald-500' },
                        { key: 'inactive', label: 'Inactive', count: statusCounts.inactive, color: 'text-amber-500' },
                        { key: 'graduated', label: 'Graduated', count: statusCounts.graduated, color: 'text-purple-500' },
                    ].map((tab) => {
                        const isActive = selectedStatus === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleStatusTabChange(tab.key)}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50 border-sidebar-border'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
                                        isActive
                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                            : 'bg-muted text-foreground'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border border-sidebar-border shadow-xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, or program..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        router.get(
                                            '/students',
                                            {
                                                program: selectedProgram === 'all' ? undefined : selectedProgram,
                                                status: selectedStatus === 'all' ? undefined : selectedStatus,
                                            },
                                            { preserveState: true, replace: true }
                                        );
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <Button type="submit" variant="secondary" size="default" className="shrink-0">
                            Search
                        </Button>
                    </form>

                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedProgram}
                            onValueChange={(val) => {
                                setSelectedProgram(val);
                                router.get(
                                    '/students',
                                    {
                                        search: searchQuery || undefined,
                                        program: val === 'all' ? undefined : val,
                                        status: selectedStatus === 'all' ? undefined : selectedStatus,
                                    },
                                    { preserveState: true, replace: true }
                                );
                            }}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Programs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Programs</SelectItem>
                                {PROGRAM_OPTIONS.map((prog) => (
                                    <SelectItem key={prog} value={prog}>
                                        {prog}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(searchQuery || selectedProgram !== 'all' || selectedStatus !== 'all') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border bg-card shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground border-b border-sidebar-border text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3.5">ID</th>
                                    <th className="px-4 py-3.5">Name</th>
                                    <th className="px-4 py-3.5">Email</th>
                                    <th className="px-4 py-3.5">Program</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5">Gender</th>
                                    <th className="px-4 py-3.5">Birthday / Age</th>
                                    <th className="px-4 py-3.5">Year Level</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/60">
                                {students.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <GraduationCap className="size-10 opacity-40" />
                                                <p className="text-base font-medium">No students found</p>
                                                <p className="text-xs max-w-sm">
                                                    {searchQuery || selectedProgram !== 'all' || selectedStatus !== 'all'
                                                        ? 'Try clearing your search query or adjusting your filters.'
                                                        : 'Get started by adding your first student.'}
                                                </p>
                                                {(searchQuery || selectedProgram !== 'all' || selectedStatus !== 'all') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleClearFilters}
                                                        className="mt-2"
                                                    >
                                                        Clear Filters
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    students.data.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="hover:bg-muted/40 transition-colors group"
                                        >
                                            <td className="px-4 py-3.5 text-muted-foreground font-mono text-xs">
                                                #{student.id}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-foreground whitespace-nowrap">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                        {student.first_name?.[0]}
                                                        {student.last_name?.[0]}
                                                    </div>
                                                    <span>
                                                        {student.first_name} {student.last_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="size-3.5 opacity-60" />
                                                    {student.email}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {getProgramBadge(student.program)}
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {getStatusBadge(student.status)}
                                            </td>
                                            <td className="px-4 py-3.5 capitalize text-muted-foreground">
                                                {student.gender}
                                            </td>
                                            <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="size-3.5 opacity-60" />
                                                    {formatBirthday(student.birthday)}
                                                    {student.age !== undefined && student.age !== null && (
                                                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                                            {student.age} yrs
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                                                    Year {student.yr_level}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => openEditDialog(student)}
                                                        title="Edit student"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() => openDeleteDialog(student)}
                                                        title="Delete student"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {students.total > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-sidebar-border bg-muted/20">
                            <div className="text-xs text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{students.from || 0}</span> to{' '}
                                <span className="font-semibold text-foreground">{students.to || 0}</span> of{' '}
                                <span className="font-semibold text-foreground">{students.total}</span> students
                            </div>

                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!students.prev_page_url}
                                    onClick={() =>
                                        students.prev_page_url &&
                                        router.get(students.prev_page_url, {}, { preserveState: true })
                                    }
                                    className="gap-1 h-8"
                                >
                                    <ChevronLeft className="size-4" />
                                    <span>Prev</span>
                                </Button>

                                <span className="text-xs px-2 text-muted-foreground">
                                    Page {students.current_page} of {students.last_page}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!students.next_page_url}
                                    onClick={() =>
                                        students.next_page_url &&
                                        router.get(students.next_page_url, {}, { preserveState: true })
                                    }
                                    className="gap-1 h-8"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE STUDENT MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreateSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <GraduationCap className="size-5 text-primary" />
                                Add New Student
                            </DialogTitle>
                            <DialogDescription>
                                Enter the student's details below to create their record.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="create_first_name">First Name</Label>
                                    <Input
                                        id="create_first_name"
                                        value={createForm.data.first_name}
                                        onChange={(e) => createForm.setData('first_name', e.target.value)}
                                        placeholder="e.g. Maria"
                                        required
                                    />
                                    {createForm.errors.first_name && (
                                        <p className="text-xs text-destructive">{createForm.errors.first_name}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="create_last_name">Last Name</Label>
                                    <Input
                                        id="create_last_name"
                                        value={createForm.data.last_name}
                                        onChange={(e) => createForm.setData('last_name', e.target.value)}
                                        placeholder="e.g. Santos"
                                        required
                                    />
                                    {createForm.errors.last_name && (
                                        <p className="text-xs text-destructive">{createForm.errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="create_email">Email Address</Label>
                                <Input
                                    id="create_email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    placeholder="maria.santos@example.com"
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="text-xs text-destructive">{createForm.errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="create_program">Program</Label>
                                    <Select
                                        value={createForm.data.program}
                                        onValueChange={(val) => createForm.setData('program', val)}
                                    >
                                        <SelectTrigger id="create_program">
                                            <SelectValue placeholder="Select Program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROGRAM_OPTIONS.map((prog) => (
                                                <SelectItem key={prog} value={prog}>
                                                    {prog}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.program && (
                                        <p className="text-xs text-destructive">{createForm.errors.program}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="create_status">Status</Label>
                                    <Select
                                        value={createForm.data.status}
                                        onValueChange={(val) => createForm.setData('status', val)}
                                    >
                                        <SelectTrigger id="create_status">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((st) => (
                                                <SelectItem key={st.value} value={st.value}>
                                                    {st.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.status && (
                                        <p className="text-xs text-destructive">{createForm.errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="create_gender">Gender</Label>
                                    <Select
                                        value={createForm.data.gender}
                                        onValueChange={(val) => createForm.setData('gender', val)}
                                    >
                                        <SelectTrigger id="create_gender">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENDER_OPTIONS.map((g) => (
                                                <SelectItem key={g.value} value={g.value}>
                                                    {g.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.gender && (
                                        <p className="text-xs text-destructive">{createForm.errors.gender}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="create_yr_level">Year Level</Label>
                                    <Select
                                        value={String(createForm.data.yr_level)}
                                        onValueChange={(val) => createForm.setData('yr_level', val)}
                                    >
                                        <SelectTrigger id="create_yr_level">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {YEAR_LEVEL_OPTIONS.map((y) => (
                                                <SelectItem key={y.value} value={y.value}>
                                                    {y.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.yr_level && (
                                        <p className="text-xs text-destructive">{createForm.errors.yr_level}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="create_birthday">Birthday</Label>
                                <Input
                                    id="create_birthday"
                                    type="date"
                                    value={createForm.data.birthday}
                                    onChange={(e) => createForm.setData('birthday', e.target.value)}
                                    required
                                />
                                {createForm.errors.birthday && (
                                    <p className="text-xs text-destructive">{createForm.errors.birthday}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing} className="gap-2">
                                {createForm.processing && <Loader2 className="size-4 animate-spin" />}
                                Save Student
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* EDIT STUDENT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Pencil className="size-5 text-primary" />
                                Edit Student
                            </DialogTitle>
                            <DialogDescription>
                                Modify the information for {activeStudent?.first_name} {activeStudent?.last_name}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_first_name">First Name</Label>
                                    <Input
                                        id="edit_first_name"
                                        value={editForm.data.first_name}
                                        onChange={(e) => editForm.setData('first_name', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.first_name && (
                                        <p className="text-xs text-destructive">{editForm.errors.first_name}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_last_name">Last Name</Label>
                                    <Input
                                        id="edit_last_name"
                                        value={editForm.data.last_name}
                                        onChange={(e) => editForm.setData('last_name', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.last_name && (
                                        <p className="text-xs text-destructive">{editForm.errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_email">Email Address</Label>
                                <Input
                                    id="edit_email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    required
                                />
                                {editForm.errors.email && (
                                    <p className="text-xs text-destructive">{editForm.errors.email}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_program">Program</Label>
                                    <Select
                                        value={editForm.data.program}
                                        onValueChange={(val) => editForm.setData('program', val)}
                                    >
                                        <SelectTrigger id="edit_program">
                                            <SelectValue placeholder="Select Program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROGRAM_OPTIONS.map((prog) => (
                                                <SelectItem key={prog} value={prog}>
                                                    {prog}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.program && (
                                        <p className="text-xs text-destructive">{editForm.errors.program}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_status">Status</Label>
                                    <Select
                                        value={editForm.data.status}
                                        onValueChange={(val) => editForm.setData('status', val)}
                                    >
                                        <SelectTrigger id="edit_status">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((st) => (
                                                <SelectItem key={st.value} value={st.value}>
                                                    {st.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.status && (
                                        <p className="text-xs text-destructive">{editForm.errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_gender">Gender</Label>
                                    <Select
                                        value={editForm.data.gender}
                                        onValueChange={(val) => editForm.setData('gender', val)}
                                    >
                                        <SelectTrigger id="edit_gender">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENDER_OPTIONS.map((g) => (
                                                <SelectItem key={g.value} value={g.value}>
                                                    {g.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.gender && (
                                        <p className="text-xs text-destructive">{editForm.errors.gender}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="edit_yr_level">Year Level</Label>
                                    <Select
                                        value={String(editForm.data.yr_level)}
                                        onValueChange={(val) => editForm.setData('yr_level', val)}
                                    >
                                        <SelectTrigger id="edit_yr_level">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {YEAR_LEVEL_OPTIONS.map((y) => (
                                                <SelectItem key={y.value} value={y.value}>
                                                    {y.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.yr_level && (
                                        <p className="text-xs text-destructive">{editForm.errors.yr_level}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit_birthday">Birthday</Label>
                                <Input
                                    id="edit_birthday"
                                    type="date"
                                    value={editForm.data.birthday}
                                    onChange={(e) => editForm.setData('birthday', e.target.value)}
                                    required
                                />
                                {editForm.errors.birthday && (
                                    <p className="text-xs text-destructive">{editForm.errors.birthday}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing} className="gap-2">
                                {editForm.processing && <Loader2 className="size-4 animate-spin" />}
                                Update Student
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <Trash2 className="size-5" />
                            Delete Student
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">
                                {activeStudent?.first_name} {activeStudent?.last_name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteSubmit}
                            disabled={deleteForm.processing}
                            className="gap-2"
                        >
                            {deleteForm.processing && <Loader2 className="size-4 animate-spin" />}
                            Delete Student
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

StudentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Students',
            href: '/students',
        },
    ],
};
