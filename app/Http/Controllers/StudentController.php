<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('program', 'like', "%{$search}%");
            });
        }

        if ($request->filled('program')) {
            $query->where('program', $request->query('program'));
        }

        // Render Inertia UI if requested from browser / Inertia
        if ($request->header('X-Inertia') || (! $request->wantsJson() && ! $request->is('api/*'))) {
            return Inertia::render('students/index', [
                'students' => $query->latest('id')->paginate(10)->withQueryString(),
                'filters' => [
                    'search' => $request->query('search', ''),
                    'program' => $request->query('program', ''),
                ],
                'programs' => Student::distinct()->pluck('program')->filter()->values(),
            ]);
        }

        // Return JSON for API requests / automated tests
        if ($request->has('page')) {
            return response()->json($query->paginate(15));
        }

        return response()->json($query->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not used for API resource
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:students,email'],
            'program'    => ['required', 'string', 'max:50'],
            'gender'     => ['required', 'string', 'max:20'],
            'birthday'   => ['required', 'date'],
            'yr_level'   => ['required', 'string', 'max:10'],
        ]);

        $student = Student::create($validated);

        if ($request->header('X-Inertia') || ! $request->wantsJson()) {
            return redirect()->back()->with('success', 'Student created successfully.');
        }

        return response()->json([
            'message' => 'Student created successfully.',
            'student' => $student,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        return response()->json($student);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        // Not used for API resource
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:255'],
            'last_name'  => ['sometimes', 'required', 'string', 'max:255'],
            'email'      => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('students', 'email')->ignore($student->id)],
            'program'    => ['sometimes', 'required', 'string', 'max:50'],
            'gender'     => ['sometimes', 'required', 'string', 'max:20'],
            'birthday'   => ['sometimes', 'required', 'date'],
            'yr_level'   => ['sometimes', 'required', 'string', 'max:10'],
        ]);

        $student->update($validated);

        if ($request->header('X-Inertia') || ! $request->wantsJson()) {
            return redirect()->back()->with('success', 'Student updated successfully.');
        }

        return response()->json([
            'message' => 'Student updated successfully.',
            'student' => $student->fresh(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Student $student)
    {
        $student->delete();

        if ($request->header('X-Inertia') || ! $request->wantsJson()) {
            return redirect()->back()->with('success', 'Student deleted successfully.');
        }

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }
}

