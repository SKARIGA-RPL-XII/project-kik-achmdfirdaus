<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
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
        return Inertia::render('admin/divisi/index');
    }
    public function kalender()
    {
        return Inertia::render('admin/kalender/index');
    }
    public function karyawan()
    {
        return Inertia::render('admin/karyawan/index');
    }
}