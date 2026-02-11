<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Cuti;
use App\Models\Gaji;
use App\Models\Lembur;
use App\Models\Pelanggaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function absensi()
    {
        $user = Auth::user();

        $karyawan = $user->karyawan;

        $absensi = $karyawan->absensi()
            ->latest('tanggal')
            ->get()
            ->map(fn($i) => [
                'id' => $i->id,
                'tanggal' => $i->tanggal,
                'jam_masuk' => $i->jam_masuk,
                'jam_pulang' => $i->jam_pulang,
                'status' => $i->status,
                'keterangan' => $i->keterangan,
            ])
            ->values()
            ->toArray();

        return Inertia::render('user/absensi', [
            'absensiData' => $absensi
        ]);
    }
    public function absensiIn(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:2048'
        ]);

        $karyawan = Auth::user()->karyawan;

        $today = Carbon::today();
        $now   = Carbon::now();

        $absen = Absensi::where('karyawan_id', $karyawan->id)
            ->whereDate('tanggal', $today)
            ->first();

        if ($absen) {
            return back()->with('error', 'Anda sudah absen hari ini.');
        }

        // lewat jam 17 otomatis alpha
        if ($now->hour >= 17) {
            Absensi::create([
                'karyawan_id' => $karyawan->id,
                'tanggal' => $today,
                'status' => 'alpha'
            ]);

            return back()->with('error', 'Terlambat. Otomatis Alpha.');
        }

        // ⭐ simpan ke folder MASUK
        $file = $request->file('foto');
        $filename = 'masuk_' . $karyawan->id . '_' . $now->timestamp . '.' . $file->extension();

        $path = $file->storeAs('absensi/masuk', $filename, 'public');

        Absensi::create([
            'karyawan_id' => $karyawan->id,
            'tanggal' => $today,
            'jam_masuk' => $now->format('H:i:s'),
            'foto_masuk' => $path,
            'status' => 'hadir'
        ]);

        return back()->with('success', 'Absen masuk berhasil.');
    }


    public function absensiOut(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:2048'
        ]);

        $karyawan = Auth::user()->karyawan;
        $now = Carbon::now();
        $today = Carbon::today();

        $absen = Absensi::where('karyawan_id', $karyawan->id)
            ->whereDate('tanggal', $today)
            ->first();

        if (!$absen || !$absen->jam_masuk) {
            return back()->with('error', 'Belum absen masuk.');
        }

        if ($absen->jam_pulang) {
            return back()->with('error', 'Sudah absen pulang.');
        }

        $file = $request->file('foto');
        $filename = 'pulang_' . $karyawan->id . '_' . $now->timestamp . '.' . $file->extension();

        $path = $file->storeAs('absensi/pulang', $filename, 'public');

        $absen->update([
            'jam_pulang' => $now->format('H:i:s'),
            'foto_pulang' => $path
        ]);

        return back()->with('success', 'Absen pulang berhasil.');
    }

    public function cuti()
    {
        $karyawan = Auth::user()->karyawan;

        $cuti = Cuti::where('karyawan_id', $karyawan->id)
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'tanggal_mulai' => $c->tanggal_mulai,
                'tanggal_selesai' => $c->tanggal_selesai,
                'jenis_pengajuan' => $c->jenis_pengajuan,
                'alasan' => $c->alasan,
                'status' => $c->status,
            ])
            ->toArray();

        return Inertia::render('user/cuti', [
            'cutiData' => $cuti
        ]);
    }
    public function cutiStore(Request $request)
    {
        try {
            $data = $request->validate([
                'tanggal_mulai' => 'required',
                'tanggal_selesai' => 'required',
                'alasan' => 'required',
                'jenis_pengajuan' => 'required|in:cuti,izin'
            ]);

            $karyawan = Auth::user()->karyawan;
            if (!$karyawan) {
                return back()->with('error', 'Data karyawan tidak ditemukan.');
            }

            DB::beginTransaction();


            $cuti = Cuti::create([
                'karyawan_id' => $karyawan->id,
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_selesai' => $data['tanggal_selesai'],
                'alasan' => $data['alasan'],
                'jenis_pengajuan' => $data['jenis_pengajuan'],
                'status' => 'pending'
            ]);
            DB::commit();

            return back()->with('success', 'Pengajuan cuti berhasil dikirim.');
        } catch (\Throwable $e) {

            DB::rollBack();
            Log::error($e);

            return back()->with('error', 'Gagal mengajukan cuti. Silakan coba lagi.');
        }
    }
    public function lembur()
    {
        $karyawan = Auth::user()->karyawan;

        $lembur = Lembur::where('karyawan_id', $karyawan->id)
            ->latest()
            ->get()
            ->map(fn($l) => [
                'id' => $l->id,
                'tanggal' => $l->tanggal,
                'status' => $l->status,
            ])
            ->toArray();

        return Inertia::render('user/lembur', [
            'lemburData' => $lembur
        ]);
    }
    public function lemburStore(Request $request)
    {
        $data = $request->validate([
            'tanggal' => 'required|date'
        ]);

        $karyawan = Auth::user()->karyawan;

        Lembur::create([
            'karyawan_id' => $karyawan->id,
            'tanggal' => $data['tanggal'],
            'status' => 'pending'
        ]);

        return back()->with('success', 'Pengajuan lembur berhasil dikirim');
    }
    public function pelanggaran()
    {
        $karyawan = Auth::user()->karyawan;

        $pelanggaran = Pelanggaran::where('karyawan_id', $karyawan->id)
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'tanggal' => $p->tanggal,
                'pelanggaran' => $p->pelanggaran,
                'status' => $p->status,
                'potongan' => $p->potongan,
            ])
            ->toArray();

        return Inertia::render('user/pelanggaran', [
            'pelanggaranData' => $pelanggaran
        ]);
    }
    public function gaji()
    {
        $karyawan = Auth::user()->karyawan;

        $gaji = Gaji::where('karyawan_id', $karyawan->id)
            ->latest('tahun')
            ->latest('bulan')
            ->get()
            ->map(fn($g) => [
                'id' => $g->id,
                'bulan' => $g->bulan,
                'tahun' => $g->tahun,
                'gaji_pokok' => $g->gaji_pokok,
                'total_lembur' => $g->total_lembur,
                'total_potongan' => $g->total_potongan,
                'total_gaji' => $g->total_gaji,
            ])
            ->toArray();

        return Inertia::render('user/gaji', [
            'gajiData' => $gaji
        ]);
    }
}