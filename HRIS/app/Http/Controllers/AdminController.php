<?php

namespace App\Http\Controllers;

use App\Models\Cuti;
use App\Models\Divisi;
use App\Models\Gaji;
use App\Models\Jabatan;
use App\Models\Kalender;
use App\Models\Karyawan;
use App\Models\Lembur;
use App\Models\Pelanggaran;
use App\Models\User;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function jabatan()
    {
        return Inertia::render('admin/jabatan/index', ['jabatan' => Jabatan::latest()->get()]);
    }
    public function jabatanStore(Request $request)
    {

        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:50',
                'gaji' => 'required|numeric'
            ]);

            Jabatan::create($validated);

            return redirect()->route('app.jabatan')->with('success', 'Data berhasil ditambahkan.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.jabatan')->with('error', $e->getMessage());
        }
    }
    public function jabatanUpdate(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:50',
                'gaji' => 'required|numeric'
            ]);

            Jabatan::findOrFail($id)->update($validated);

            return redirect()->route('app.jabatan')->with('success', 'Data berhasil diubah.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.jabatan')->with('error', $e->getMessage());
        }
    }
    public function jabatanDestroy($id)
    {
        try {

            Jabatan::findOrFail($id)->delete();

            return redirect()->route('app.jabatan')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('app.jabatan')->with('error', $e->getMessage());
        }
    }
    public function divisi()
    {
        return Inertia::render('admin/divisi/index', ['divisi' => Divisi::latest()->get()]);
    }
    public function divisiStore(Request $request)
    {

        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:50',
            ]);

            Divisi::create($validated);

            return redirect()->route('app.divisi')->with('success', 'Data berhasil ditambahkan.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.divisi')->with('error', $e->getMessage());
        }
    }
    public function divisiUpdate(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:50',
            ]);

            Divisi::findOrFail($id)->update($validated);

            return redirect()->route('app.divisi')->with('success', 'Data berhasil diubah.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.divisi')->with('error', $e->getMessage());
        }
    }
    public function divisiDestroy($id)
    {
        try {

            Divisi::findOrFail($id)->delete();

            return redirect()->route('app.divisi')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('app.divisi')->with('error', $e->getMessage());
        }
    }
    public function kalender()
    {
        return Inertia::render('admin/kalender/index', [
            'kalender' => Kalender::get()->all(),
        ]);
    }
    public function kalenderStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'tanggal' => 'required|date',
                'keterangan' => 'required|string|max:255',
                'jenis_hari' => 'required|in:event,cuti',
            ]);
            Kalender::create($validated);
            return redirect()->route('app.kalender')->with('success', 'Event berhasil ditambahkan');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.kalender')->with('error', $e->getMessage());
        }
    }
    public function kalenderUpdate(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'tanggal' => 'required|date',
                'keterangan' => 'required|string|max:255',
                'jenis_hari' => 'required|in:event,cuti',
            ]);

            Kalender::findOrFail($id)->update($validated);
            return redirect()->route('app.kalender')->with('success', 'Event berhasil diubah');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->validator)->withInput();
        } catch (\Exception $e) {
            return redirect()->route('app.kalender')->with('error', $e->getMessage());
        }
    }
    public function kalenderDestroy($id)
    {
        try {
            Kalender::findOrFail($id)->delete();
            return redirect()->route('app.kalender')->with('success', 'Event berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->route('app.kalender')->with('error', $e->getMessage());
        }
    }
    public function karyawan()
    {
        $karyawanData = Karyawan::with([
            'user',
            'divisi',
            'jabatan'
        ])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,

                    'nama' => $item->user->name ?? '-',
                    'nip' => $item->nip ?? '-',
                    'jk' => $item->jk ?? '-',
                    'tanggal_lahir' => $item->tanggal_lahir,

                    'divisi' => $item->divisi->nama ?? '-',
                    'jabatan' => $item->jabatan->nama ?? '-',

                    'divisi_id' => $item->divisi_id,
                    'jabatan_id' => $item->jabatan_id,
                ];
            });

        return Inertia::render('admin/karyawan/index', [
            'karyawan' => $karyawanData,
            'divisi' => Divisi::select('id', 'nama')->latest()->get(),
            'jabatan' => Jabatan::select('id', 'nama')->latest()->get(),
        ]);
    }
    public function lembur()
    {
        $lemburData = Lembur::with([
            'karyawan.user',
            'karyawan.jabatan',
            'karyawan.divisi'
        ])
            ->orderBy('tanggal', 'DESC')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->karyawan->user->name ?? '-',
                    'nip' => $item->karyawan->nip ?? '-',
                    'jabatan' => $item->karyawan->jabatan->nama ?? '-',
                    'departemen' => $item->karyawan->divisi->nama ?? '-',
                    'tanggal' => $item->tanggal,
                    'jam_mulai' => $item->jam_mulai,
                    'jam_selesai' => $item->jam_selesai,
                    'keterangan' => $item->keterangan ?? '-',
                    'status' => $item->status,
                ];
            });

        return Inertia::render('admin/lembur/index', [
            'lemburData' => $lemburData,
        ]);
    }
    public function lemburUpdate(Request $request, $id)
    {
        $lembur = Lembur::findOrFail($id);

        $request->validate([
            'action' => 'required|in:approve,reject'
        ]);

        $status = match ($request->action) {
            'approve' => 'disetujui',
            'reject' => 'ditolak',
        };

        $lembur->update([
            'status' => $status
        ]);

        return back()->with('success', 'Status lembur berhasil diperbarui');
    }
    public function lemburDestroy($id)
    {
        try {

            Lembur::findOrFail($id)->delete();

            return redirect()->route('app.lembur')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('app.lembur')->with('error', $e->getMessage());
        }
    }
    public function cuti()
    {
        $cutiData = Cuti::with([
            'karyawan.jabatan',
            'karyawan.divisi'
        ])
            ->orderBy('tanggal_mulai', 'DESC')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'karyawan_nama' => $item->karyawan->user->name ?? '-',
                    'karyawan_nip' => $item->karyawan->nip,
                    'karyawan_jabatan' => $item->karyawan->jabatan->nama ?? '-',
                    'karyawan_departemen' => $item->karyawan->divisi->nama ?? '-',
                    'tanggal_mulai' => $item->tanggal_mulai,
                    'tanggal_selesai' => $item->tanggal_selesai,
                    'jumlah_hari' => $item->tanggal_mulai->diffInDays($item->tanggal_selesai) + 1,
                    'jenis_cuti' => $item->jenis_pengajuan,
                    'alasan' => $item->alasan,
                    'status' => $item->status,
                ];
            });

        return Inertia::render('admin/cuti/index', [
            'cutiData' => $cutiData,
        ]);
    }
    public function cutiUpdate(Request $request, Cuti $cuti)
    {
        $validated = $request->validate([
            'action' => ['required', 'in:approve,reject'],
        ]);

        $statusMap = [
            'approve' => 'disetujui',
            'reject' => 'ditolak',
        ];

        $cuti->update([
            'status' => $statusMap[$validated['action']],
        ]);

        return back()->with('success', 'Status cuti berhasil diperbarui');
    }
    public function cutiDestroy($id)
    {
        try {

            Cuti::findOrFail($id)->delete();

            return redirect()->route('app.cuti')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('app.cuti')->with('error', $e->getMessage());
        }
    }
    public function pelanggaran()
    {
        $pelanggaranData = Pelanggaran::with([
            'karyawan.user'
        ])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->karyawan->user->name ?? '-',
                    'nip' => $item->karyawan->nip ?? '-',
                    'tanggal' => $item->tanggal,
                    'pelanggaran' => $item->pelanggaran,
                    'status' => $item->status,
                    'potongan' => $item->potongan,
                ];
            });

        return Inertia::render('admin/pelanggaran/index', [
            'pelanggaranData' => $pelanggaranData,
        ]);
    }
    public function gaji()
    {
        $gajiData = Gaji::with([
            'karyawan.user'
        ])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,

                    'nama' => $item->karyawan->user->name ?? '-',
                    'nip' => $item->karyawan->nip ?? '-',

                    'bulan' => $item->bulan,
                    'tahun' => $item->tahun,

                    'gaji_pokok' => $item->gaji_pokok,
                    'total_lembur' => $item->total_lembur,
                    'total_potongan' => $item->total_potongan,
                    'total_gaji' => $item->total_gaji,

                    'karyawan_id' => $item->karyawan_id,
                ];
            });

        return Inertia::render('admin/gaji/index', [
            'gajiData' => $gajiData,
            'karyawanList' => Karyawan::with('user')->get()
                ->map(fn($k) => [
                    'id' => $k->id,
                    'nama' => $k->user->name
                ])
        ]);
    }
    public function generate(PayrollService $service)
    {
        $service->generate();

        return back()->with('success', 'Payroll berhasil digenerate');
    }
    public function gajiDestroy($id)
    {
        try {

            Gaji::findOrFail($id)->delete();

            return redirect()->route('app.gaji')->with('success', 'Data berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->route('app.gaji')->with('error', $e->getMessage());
        }
    }
}