<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {});
Route::post('/login', [AuthController::class, 'store'])->name('login.store');
Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

Route::get('/app', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::get('/app/jabatan', [AdminController::class, 'jabatan'])->name('app.jabatan');
Route::post('/app/jabatan', [AdminController::class, 'jabatanStore'])->name('app.jabatan.store');
Route::put('/app/jabatan/{id}', [AdminController::class, 'jabatanUpdate'])->name('app.jabatan.update');
Route::delete('/app/jabatan/{id}', [AdminController::class, 'jabatanDestroy'])->name('app.jabatan.destroy');

Route::get('/app/divisi', [AdminController::class, 'divisi'])->name('app.divisi');
Route::get('/app/kalender', [AdminController::class, 'kalender'])->name('app.kalender');
Route::get('/app/karyawan', [AdminController::class, 'karyawan'])->name('app.karyawan');

require __DIR__ . '/settings.php';