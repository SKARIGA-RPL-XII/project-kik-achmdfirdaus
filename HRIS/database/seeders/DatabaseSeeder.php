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
            ['tanggal' => '2025-01-01', 'keterangan' => 'Tahun Baru', 'jenis_hari' => 'event'],
            ['tanggal' => '2025-01-04', 'keterangan' => 'Weekend', 'jenis_hari' => 'event'],
            ['tanggal' => '2025-01-05', 'keterangan' => 'Weekend', 'jenis_hari' => 'event'],
            ['tanggal' => '2025-01-09', 'keterangan' => 'Weekend', 'jenis_hari' => 'cuti'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | ABSENSI
        |--------------------------------------------------------------------------
        */
        for ($i = 1; $i <= 5; $i++) {
            DB::table('absensi')->insert([
                'karyawan_id' => $i,
                'tanggal' => Carbon::now()->subDays(rand(1, 5)),
                'jam_masuk' => '08:00:00',
                'jam_pulang' => '17:00:00',
                'foto_masuk' => 'masuk.jpg',
                'foto_pulang' => 'pulang.jpg',
                'status' => 'hadir',
                'keterangan' => null,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | LEMBUR
        |--------------------------------------------------------------------------
        */
        DB::table('lembur')->insert([
            ['karyawan_id' => 1, 'tanggal' => now(), 'status' => 'pending'],
            ['karyawan_id' => 2, 'tanggal' => now(), 'status' => 'pending'],
            ['karyawan_id' => 3, 'tanggal' => now(), 'status' => 'pending'],
            ['karyawan_id' => 4, 'tanggal' => now(), 'status' => 'ditolak'],
            ['karyawan_id' => 5, 'tanggal' => now(), 'status' => 'disetujui'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | PELANGGARAN
        |--------------------------------------------------------------------------
        */
        DB::table('pelanggaran')->insert([
            ['karyawan_id' => 1, 'tanggal' => now(), 'pelanggaran' => 'Terlambat', 'status' => 'ringan', 'potongan' => 50000],
            ['karyawan_id' => 2, 'tanggal' => now(), 'pelanggaran' => 'Alpha', 'status' => 'sedang', 'potongan' => 150000],
            ['karyawan_id' => 3, 'tanggal' => now(), 'pelanggaran' => 'Pulang Cepat', 'status' => 'sedang', 'potongan' => 75000],
            ['karyawan_id' => 4, 'tanggal' => now(), 'pelanggaran' => 'Tidak Absen', 'status' => 'berat', 'potongan' => 100000],
            ['karyawan_id' => 5, 'tanggal' => now(), 'pelanggaran' => 'Terlambat', 'status' => 'ringan', 'potongan' => 50000],
        ]);

        /*
        |--------------------------------------------------------------------------
        | CUTI
        |--------------------------------------------------------------------------
        */
        DB::table('cuti')->insert([
            ['karyawan_id' => 1, 'jenis_pengajuan' => 'izin', 'tanggal_mulai' => now(), 'tanggal_selesai' => now()->addDays(1), 'alasan' => 'Keluarga', 'status' => 'disetujui'],
            ['karyawan_id' => 2, 'jenis_pengajuan' => 'cuti', 'tanggal_mulai' => now(), 'tanggal_selesai' => now()->addDays(2), 'alasan' => 'Liburan', 'status' => 'pending'],
            ['karyawan_id' => 3, 'jenis_pengajuan' => 'cuti', 'tanggal_mulai' => now(), 'tanggal_selesai' => now(), 'alasan' => 'Demam', 'status' => 'disetujui'],
            ['karyawan_id' => 4, 'jenis_pengajuan' => 'izin', 'tanggal_mulai' => now(), 'tanggal_selesai' => now(), 'alasan' => 'Urusan pribadi', 'status' => 'ditolak'],
            ['karyawan_id' => 5, 'jenis_pengajuan' => 'cuti', 'tanggal_mulai' => now(), 'tanggal_selesai' => now()->addDays(3), 'alasan' => 'Pernikahan', 'status' => 'disetujui'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | GAJI
        |--------------------------------------------------------------------------
        */
        DB::table('gaji')->insert([
            ['karyawan_id' => 1, 'bulan' => 1, 'tahun' => 2025, 'gaji_pokok' => 3000000, 'total_lembur' => 100000, 'total_potongan' => 50000, 'total_gaji' => 3050000],
            ['karyawan_id' => 2, 'bulan' => 1, 'tahun' => 2025, 'gaji_pokok' => 3000000, 'total_lembur' => 50000, 'total_potongan' => 150000, 'total_gaji' => 2900000],
            ['karyawan_id' => 3, 'bulan' => 1, 'tahun' => 2025, 'gaji_pokok' => 4500000, 'total_lembur' => 150000, 'total_potongan' => 75000, 'total_gaji' => 4575000],
            ['karyawan_id' => 4, 'bulan' => 1, 'tahun' => 2025, 'gaji_pokok' => 4500000, 'total_lembur' => 0, 'total_potongan' => 100000, 'total_gaji' => 4400000],
            ['karyawan_id' => 5, 'bulan' => 1, 'tahun' => 2025, 'gaji_pokok' => 6500000, 'total_lembur' => 200000, 'total_potongan' => 50000, 'total_gaji' => 6650000],
        ]);
    }
}