<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::apiResource('students', StudentController::class);

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'totalStudents' => \App\Models\Student::count(),
            'programCounts' => \App\Models\Student::selectRaw('program, count(*) as count')->groupBy('program')->pluck('count', 'program'),
            'recentStudents' => \App\Models\Student::latest('id')->take(5)->get(),
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
