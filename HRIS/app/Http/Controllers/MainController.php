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
        $today = Carbon::today();
        $startMonth = now()->startOfMonth();

        $totalKaryawan = Karyawan::count();

        $hadirBulanIni = Absensi::where('status', 'hadir')
            ->whereBetween('tanggal', [$startMonth, now()])
            ->count();

        $pelanggaranBulanIni = Pelanggaran::whereBetween('tanggal', [$startMonth, now()])
            ->count();

        $pendingCuti = Cuti::where('status', 'pending')->count();
        $pendingLembur = Lembur::where('status', 'pending')->count();

        $hadirHariIni = Absensi::whereDate('tanggal', $today)
            ->where('status', 'hadir')
            ->count();

        $weekly = collect(range(0, 6))->map(function ($i) {
            $date = now()->subDays(6 - $i);

            return [
                'day' => $date->translatedFormat('D'),
                'hadir' => Absensi::whereDate('tanggal', $date)
                    ->where('status', 'hadir')
                    ->count(),
            ];
        });

        $kalender = Kalender::select('tanggal', 'jenis_hari', 'keterangan')->get();
        // dd([
        //     'stats' => [
        //         'hadirBulanIni' => $hadirBulanIni,
        //         'pelanggaranBulanIni' => $pelanggaranBulanIni,
        //         'pendingTotal' => $pendingCuti + $pendingLembur,
        //     ],
        //     'today' => [
        //         'hadir' => $hadirHariIni,
        //         'total' => $totalKaryawan,
        //     ],
        //     'weeklyData' => $weekly,
        //     'kalender' => $kalender,
        // ]);
        return Inertia::render('dashboard', [
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
}