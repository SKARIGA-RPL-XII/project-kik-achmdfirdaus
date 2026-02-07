<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Cuti;
use App\Models\Kalender;
use App\Models\Karyawan;
use App\Models\Lembur;
use App\Models\Pelanggaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MainController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $today = Carbon::today();
        $startMonth = now()->startOfMonth();

        if ($user->role === 'admin') {

            $totalKaryawan = Karyawan::count();
            $hadirBulanIni = Absensi::where('status', 'hadir')->whereBetween('tanggal', [$startMonth, now()])->count();
            $pelanggaranBulanIni = Pelanggaran::whereBetween('tanggal', [$startMonth, now()])->count();
            $pendingCuti = Cuti::where('status', 'pending')->count();
            $pendingLembur = Lembur::where('status', 'pending')->count();
            $hadirHariIni = Absensi::whereDate('tanggal', $today)->where('status', 'hadir')->count();
            $weekly = collect(range(0, 6))->map(function ($i) {
                $date = now()->subDays(6 - $i);

                return [
                    'day' => $date->translatedFormat('D'),
                    'hadir' => Absensi::whereDate('tanggal', $date)->where('status', 'hadir')->count(),
                ];
            });

            $kalender = Kalender::select('tanggal', 'jenis_hari', 'keterangan')->get();

            return Inertia::render('dashboard', [
                'role' => 'admin',
                'stats' => [
                    'hadirBulanIni' => $hadirBulanIni,
                    'pelanggaranBulanIni' => $pelanggaranBulanIni,
                    'pendingTotal' => $pendingCuti + $pendingLembur,
                ],
                'today' => [
                    'hadir' => $hadirHariIni,
                    'total' => $totalKaryawan,
                ],
                'weeklyData' => $weekly,
                'kalender' => $kalender,
            ]);
        }

        $karyawanId = Karyawan::where('user_id', $user->id)->value('id');

        if (!$karyawanId) {
            return Inertia::render('dashboard', [
                'role' => 'user',
                'userStats' => [
                    'hadir' => 0,
                    'hariKerja' => 0,
                    'pelanggaran' => 0,
                    'cuti' => 0,
                    'alpha' => 0,
                ],
                'kalender' => [],
            ]);
        }

        $totalHariKerja = now()->daysInMonth;
        $hadir = Absensi::where('karyawan_id', $karyawanId)->whereMonth('tanggal', now()->month)->where('status', 'hadir')->count();
        $pelanggaran = Pelanggaran::where('karyawan_id', $karyawanId)->whereMonth('tanggal', now()->month)->count();
        $cuti = Cuti::where('karyawan_id', $karyawanId)->where('status', 'disetujui')->whereMonth('tanggal_mulai', now()->month)->count();
        $izin = Absensi::where('karyawan_id', $karyawanId)->where('status', 'izin')->count();
        $alpha = Absensi::where('karyawan_id', $karyawanId)->where('status', 'alpha')->count();
        $kalender = Kalender::select('tanggal', 'jenis_hari', 'keterangan')->get();

        return Inertia::render('dashboard', [
            'role' => 'user',
            'userStats' => [
                'hadir' => $hadir,
                'hariKerja' => $totalHariKerja,
                'pelanggaran' => $pelanggaran,
                'cuti' => $cuti + $izin,
                'alpha' => $alpha,
            ],
            'kalender' => $kalender,
        ]);
    }
}
