<?php

namespace App\Services;

use App\Models\Gaji;
use App\Models\Karyawan;
use App\Models\Lembur;
use App\Models\Pelanggaran;
use Carbon\Carbon;

class PayrollService
{
    const LEMBUR_RATE = 50000;

    public function generate(): void
    {
        $date = Carbon::now()->subMonth();

        $bulan = $date->month;
        $tahun = $date->year;

        $karyawans = Karyawan::with('jabatan')->get();

        foreach ($karyawans as $karyawan) {

            $gajiPokok = $karyawan->jabatan->gaji ?? 0;

            $jumlahLembur = Lembur::where('karyawan_id', $karyawan->id)
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun)
                ->where('status', 'disetujui')
                ->count();


            $totalLembur = $jumlahLembur * self::LEMBUR_RATE;

            $totalPotongan = Pelanggaran::where('karyawan_id', $karyawan->id)
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun)
                ->sum('potongan');

            $totalGaji = $gajiPokok + $totalLembur - $totalPotongan;
            logger([
                'karyawan' => $karyawan->user->name ?? '',
                'gajiPokok' => $gajiPokok,
                'jumlahLembur' => $jumlahLembur,
                'totalLembur' => $totalLembur,
                'potongan' => $totalPotongan,
            ]);

            Gaji::updateOrCreate(
                [
                    'karyawan_id' => $karyawan->id,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                ],
                [
                    'gaji_pokok' => $gajiPokok,
                    'total_lembur' => $totalLembur,
                    'total_potongan' => $totalPotongan,
                    'total_gaji' => $totalGaji,
                ]
            );
        }
    }
}