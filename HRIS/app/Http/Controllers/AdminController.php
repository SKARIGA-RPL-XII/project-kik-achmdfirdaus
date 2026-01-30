<?php

namespace App\Http\Controllers;

use App\Models\Cuti;
use App\Models\Divisi;
use App\Models\Jabatan;
use App\Models\Kalender;
use App\Models\Karyawan;
use App\Models\Lembur;
use App\Models\User;
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
        return Inertia::render('admin/karyawan/index', [
            'karyawan' => Karyawan::with('user', 'divisi', 'jabatan')->get(),
            'divisi' => Divisi::latest()->get(),
            'jabatan' => Jabatan::latest()->get(),
            'users' => User::latest()->get(),
        ]);
    }
    public function lembur()
    {
        return Inertia::render('admin/lembur/index', ['lembur' => Lembur::with('karyawan')->latest()->get()]);
    }
    public function lemburUpdate(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak'
        ]);
        $lembur = Lembur::findOrFail($id);
        $lembur->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status lembur diperbarui');
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
        return Inertia::render('admin/cuti/index', ['cuti' => Cuti::with('karyawan')->latest()->get()]);
    }
    public function cutiUpdate(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak'
        ]);
        $lembur = Cuti::findOrFail($id);
        $lembur->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status cuti diperbarui');
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
}
