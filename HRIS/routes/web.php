<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::post('/login', [AuthController::class, 'store'])->name('login.store');
Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/app', [MainController::class, 'index'])->name('app.dashboard');
    Route::middleware(['role:admin'])->group(function () {

        Route::get('/app/jabatan', [AdminController::class, 'jabatan'])->name('app.jabatan');
        Route::post('/app/jabatan', [AdminController::class, 'jabatanStore'])->name('app.jabatan.store');
        Route::put('/app/jabatan/{id}', [AdminController::class, 'jabatanUpdate'])->name('app.jabatan.update');
        Route::delete('/app/jabatan/{id}', [AdminController::class, 'jabatanDestroy'])->name('app.jabatan.destroy');

        Route::get('/app/divisi', [AdminController::class, 'divisi'])->name('app.divisi');
        Route::post('/app/divisi', [AdminController::class, 'divisiStore'])->name('app.divisi.store');
        Route::put('/app/divisi/{id}', [AdminController::class, 'divisiUpdate'])->name('app.divisi.update');
        Route::delete('/app/divisi/{id}', [AdminController::class, 'divisiDestroy'])->name('app.divisi.destroy');

        Route::get('/app/kalender', [AdminController::class, 'kalender'])->name('app.kalender');
        Route::post('/app/kalender', [AdminController::class, 'kalenderStore'])->name('app.kalender.store');
        Route::put('/app/kalender/{id}', [AdminController::class, 'kalenderUpdate'])->name('app.kalender.update');
        Route::delete('/app/kalender/{id}', [AdminController::class, 'kalenderDestroy'])->name('app.kalender.destroy');

        Route::get('/app/absensi', [AdminController::class, 'absensi'])->name('app.absensi');

        Route::get('/app/karyawan', [AdminController::class, 'karyawan'])->name('app.karyawan');
        Route::post('/app/karyawan', [AdminController::class, 'karyawanStore'])->name('app.karyawan.store');
        Route::put('/app/karyawan/{id}', [AdminController::class, 'karyawanUpdate'])->name('app.karyawan.update');
        Route::delete('/app/karyawan/{id}', [AdminController::class, 'karyawanDestroy'])->name('app.karyawan.delete');
        Route::post('/app/karyawan/{id}/reset-password', [AdminController::class, 'resetPassword']);
        Route::post('/app/karyawan/{id}/pelanggaran', [AdminController::class, 'pelanggaranStore']);

        Route::get('/app/lembur', [AdminController::class, 'lembur'])->name('app.lembur');
        Route::put('/app/lembur/{id}/status', [AdminController::class, 'lemburUpdate'])->name('app.lembur.status');
        Route::delete('/app/lembur/{id}', [AdminController::class, 'lemburDestroy'])->name('app.lembur.destroy');

        Route::get('/app/cuti', [AdminController::class, 'cuti'])->name('app.cuti');
        Route::put('/app/cuti/{id}/status', [AdminController::class, 'cutiUpdate'])->name('app.cuti.status');
        Route::delete('/app/cuti/{id}', [AdminController::class, 'cutiDestroy'])->name('app.cuti.destroy');

        Route::get('/app/pelanggaran', [AdminController::class, 'pelanggaran']);
        Route::put('/app/pelanggaran/{id}', [AdminController::class, 'pelanggaranUpdate']);
        Route::delete('/app/pelanggaran/{id}', [AdminController::class, 'pelanggaranDestroy']);

        Route::get('/app/gaji', [AdminController::class, 'gaji'])->name('app.gaji');
        Route::post('/app/gaji', [AdminController::class, 'gajiStore']);
        Route::put('/app/gaji/{id}', [AdminController::class, 'gajiUpdate']);
        Route::delete('/app/gaji/{id}', [AdminController::class, 'gajiDestroy']);
        Route::post('/app/gaji/generate', [AdminController::class, 'generate']);
    });
    Route::middleware(['role:user'])->group(function () {
        Route::get('/app/my-absensi', [UserController::class, 'absensi'])->name('absensi.riwayat');
        Route::post('/app/my-absensi', [UserController::class, 'absensi'])->name('absensi.riwayat');
        Route::get('/app/my-cuti', [UserController::class, 'cuti'])->name('cuti');
        Route::post('/app/my-cuti', [UserController::class, 'cutiStore'])->name('cuti.store');
        Route::get('/app/my-lembur', [UserController::class, 'lembur']);
        Route::post('/app/my-lembur', [UserController::class, 'lemburStore']);
        Route::get('/app/my-pelanggaran', [UserController::class, 'pelanggaran']);
        Route::get('/app/my-gaji', [UserController::class, 'gaji']);
    });
});



require __DIR__ . '/settings.php';