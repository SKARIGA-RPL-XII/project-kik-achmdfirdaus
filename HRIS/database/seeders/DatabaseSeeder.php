<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */
        $password = 'password123';
        DB::table('users')->insert([
            [
                'name' => 'Admin HR',
                'email' => 'admin@hris.test',
                'password' => Hash::make($password),
                'role' => 'admin',
            ],
            [
                'name' => 'Budi',
                'email' => 'budi@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Andi',
                'email' => 'andi@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Siti',
                'email' => 'siti@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Rina',
                'email' => 'rina@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Doni',
                'email' => 'doni@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | JABATAN
        |--------------------------------------------------------------------------
        */
        DB::table('jabatan')->insert([
            ['nama' => 'Staff', 'gaji' => 3000000],
            ['nama' => 'Supervisor', 'gaji' => 4500000],
            ['nama' => 'Manager', 'gaji' => 6500000],
        ]);

        /*
        |--------------------------------------------------------------------------
        | DIVISI
        |--------------------------------------------------------------------------
        */
        DB::table('divisi')->insert([
            ['nama' => 'IT'],
            ['nama' => 'HRD'],
            ['nama' => 'Finance'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | KARYAWAN
        |--------------------------------------------------------------------------
        */
        DB::table('karyawan')->insert([
            [
                'user_id' => 2,
                'jabatan_id' => 1,
                'divisi_id' => 1,
                'nip' => 'EMP001',
                'jk' => 'L',
                'tanggal_lahir' => '1999-01-10',
            ],
            [
                'user_id' => 3,
                'jabatan_id' => 1,
                'divisi_id' => 1,
                'nip' => 'EMP002',
                'jk' => 'L',
                'tanggal_lahir' => '2000-02-15',
            ],
            [
                'user_id' => 4,
                'jabatan_id' => 2,
                'divisi_id' => 2,
                'nip' => 'EMP003',
                'jk' => 'P',
                'tanggal_lahir' => '1998-07-20',
            ],
            [
                'user_id' => 5,
                'jabatan_id' => 2,
                'divisi_id' => 3,
                'nip' => 'EMP004',
                'jk' => 'P',
                'tanggal_lahir' => '1997-11-11',
            ],
            [
                'user_id' => 6,
                'jabatan_id' => 3,
                'divisi_id' => 1,
                'nip' => 'EMP005',
                'jk' => 'L',
                'tanggal_lahir' => '1995-03-05',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | KALENDER
        |--------------------------------------------------------------------------
        */
        DB::table('kalender')->insert([
            [
                'tanggal' => '2026-01-09',
                'keterangan' => 'Cuti Bersama Kantor',
                'jenis_hari' => 'cuti',
            ],
            [
                'tanggal' => '2026-01-15',
                'keterangan' => 'Company Gathering',
                'jenis_hari' => 'event',
            ],
            [
                'tanggal' => '2026-01-22',
                'keterangan' => 'Training Internal',
                'jenis_hari' => 'event',
            ],
            [
                'tanggal' => '2026-01-27',
                'keterangan' => 'Cuti Bersama Divisi IT',
                'jenis_hari' => 'cuti',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | ABSENSI
        |--------------------------------------------------------------------------
        */
        $start = Carbon::create(2026, 1, 1);
        $end   = Carbon::create(2026, 2, 28);

        $statuses = ['hadir', 'hadir', 'hadir', 'cuti', 'izin', 'alpha']; // 70% hadir

        for ($date = $start; $date <= $end; $date->addDay()) {

            if ($date->isWeekend()) continue;

            for ($karyawan = 1; $karyawan <= 5; $karyawan++) {

                $status = $statuses[array_rand($statuses)];

                DB::table('absensi')->insert([
                    'karyawan_id' => $karyawan,
                    'tanggal' => $date->toDateString(),
                    'jam_masuk' => $status === 'hadir' ? '08:00:00' : null,
                    'jam_pulang' => $status === 'hadir' ? '17:00:00' : null,
                    'foto_masuk' => 'masuk.jpg',
                    'foto_pulang' => 'pulang.jpg',
                    'status' => $status,
                    'keterangan' => null,
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | LEMBUR
        |--------------------------------------------------------------------------
        */
        $lemburData = [];

        foreach ([1, 2] as $bulan) {
            for ($i = 1; $i <= 10; $i++) {
                $lemburData[] = [
                    'karyawan_id' => rand(1, 5),
                    'tanggal' => Carbon::create(2026, $bulan, rand(1, 28)),
                    'status' => collect(['disetujui', 'disetujui', 'pending', 'ditolak'])->random(),
                ];
            }
        }

        DB::table('lembur')->insert($lemburData);

        /*
        |--------------------------------------------------------------------------
        | PELANGGARAN
        |--------------------------------------------------------------------------
        */
        DB::table('pelanggaran')->insert([
            ['karyawan_id' => 1, 'tanggal' => Carbon::create(2026, 1, 6), 'pelanggaran' => 'Terlambat', 'status' => 'ringan', 'potongan' => 50000],
            ['karyawan_id' => 2, 'tanggal' => Carbon::create(2026, 1, 9), 'pelanggaran' => 'Alpha', 'status' => 'sedang', 'potongan' => 150000],
            ['karyawan_id' => 3, 'tanggal' => Carbon::create(2026, 1, 15), 'pelanggaran' => 'Pulang Cepat', 'status' => 'sedang', 'potongan' => 75000],
            ['karyawan_id' => 4, 'tanggal' => Carbon::create(2026, 1, 18), 'pelanggaran' => 'Tidak Absen', 'status' => 'berat', 'potongan' => 100000],
            ['karyawan_id' => 5, 'tanggal' => Carbon::create(2026, 1, 22), 'pelanggaran' => 'Terlambat', 'status' => 'ringan', 'potongan' => 50000],
        ]);

        /*
        |--------------------------------------------------------------------------
        | CUTI
        |--------------------------------------------------------------------------
        */
        $cutiData = [];

        foreach ([1, 2] as $bulan) {
            for ($i = 1; $i <= 6; $i++) {
                $startDate = Carbon::create(2026, $bulan, rand(1, 25));

                $cutiData[] = [
                    'karyawan_id' => rand(1, 5),
                    'jenis_pengajuan' => collect(['cuti', 'izin'])->random(),
                    'tanggal_mulai' => $startDate,
                    'tanggal_selesai' => $startDate->copy()->addDays(rand(0, 2)),
                    'alasan' => 'Keperluan pribadi',
                    'status' => collect(['pending', 'disetujui', 'ditolak'])->random(),
                ];
            }
        }

        DB::table('cuti')->insert($cutiData);
    }
}