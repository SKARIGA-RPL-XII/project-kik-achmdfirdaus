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
                'name' => 'Achmad Firdaus Ramadhani',
                'email' => 'achmad@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Raysha AlFatikhah Wijaya',
                'email' => 'raysha@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Farrel Rayo Setyabudi',
                'email' => 'farrel@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Mohammad Farfan Maulana',
                'email' => 'farfan@hris.test',
                'password' => Hash::make($password),
                'role' => 'user',
            ],
            [
                'name' => 'Alfaluis Bintang Arsa',
                'email' => 'bintang@hris.test',
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
        | KARYAWAN + AUTO NIP
        |--------------------------------------------------------------------------
        | Format : YYYYDDMM + 3 digit
        |--------------------------------------------------------------------------
        */

        $list = [
            [2, '2007-09-14', 'L', 1, 1],
            [3, '2008-05-27', 'P', 1, 1],
            [4, '2007-12-18', 'L', 2, 2],
            [5, '2008-02-25', 'L', 2, 3],
            [6, '2007-07-31', 'L', 3, 1],
        ];

        $urut = 1;

        foreach ($list as $k) {
            [$userId, $tgl, $jk, $jabatan, $divisi] = $k;

            $nip = Carbon::parse($tgl)->format('Ydm') .
                str_pad($urut, 3, '0', STR_PAD_LEFT);

            DB::table('karyawan')->insert([
                'user_id' => $userId,
                'nip' => $nip,
                'jk' => $jk,
                'tanggal_lahir' => $tgl,
                'jabatan_id' => $jabatan,
                'divisi_id' => $divisi,
            ]);

            $urut++;
        }

        /*
        |--------------------------------------------------------------------------
        | ABSENSI (1 BULAN KEBELAKANG)
        |--------------------------------------------------------------------------
        */

        $start = now()->subMonth()->startOfDay();
        $end   = now();

        $statuses = ['hadir', 'hadir', 'hadir', 'hadir', 'cuti', 'izin', 'alpha'];

        for ($date = $start->copy(); $date <= $end; $date->addDay()) {

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
        | CUTI
        |--------------------------------------------------------------------------
        */

        for ($i = 0; $i < 8; $i++) {

            $start = now()->subDays(rand(1, 25));

            DB::table('cuti')->insert([
                'karyawan_id' => rand(1, 5),
                'jenis_pengajuan' => collect(['cuti', 'izin'])->random(),
                'tanggal_mulai' => $start,
                'tanggal_selesai' => $start->copy()->addDays(rand(0, 2)),
                'alasan' => 'Keperluan pribadi',
                'status' => collect(['pending', 'disetujui', 'ditolak'])->random(),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | LEMBUR
        |--------------------------------------------------------------------------
        */

        for ($i = 0; $i < 10; $i++) {

            DB::table('lembur')->insert([
                'karyawan_id' => rand(1, 5),
                'tanggal' => now()->subDays(rand(1, 30)),
                'status' => collect(['pending', 'disetujui', 'ditolak'])->random(),
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | PELANGGARAN
        |--------------------------------------------------------------------------
        */

        DB::table('pelanggaran')->insert([
            [
                'karyawan_id' => 1,
                'tanggal' => now()->subDays(5),
                'pelanggaran' => 'Terlambat',
                'status' => 'ringan',
                'potongan' => 50000,
            ],
            [
                'karyawan_id' => 3,
                'tanggal' => now()->subDays(10),
                'pelanggaran' => 'Alpha',
                'status' => 'berat',
                'potongan' => 150000,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | KALENDER
        |--------------------------------------------------------------------------
        */

        DB::table('kalender')->insert([
            [
                'tanggal' => now()->addDays(5),
                'keterangan' => 'Cuti Bersama',
                'jenis_hari' => 'cuti',
            ],
            [
                'tanggal' => now()->addDays(10),
                'keterangan' => 'Event Kantor',
                'jenis_hari' => 'event',
            ],
        ]);
    }
}