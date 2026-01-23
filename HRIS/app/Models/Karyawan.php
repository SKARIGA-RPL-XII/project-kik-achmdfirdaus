<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karyawan extends Model
{
    protected $table = 'karyawan';

    protected $fillable = [
        'user_id',
        'jabatan_id',
        'divisi_id',
        'nip',
        'nama_karyawan',
        'jenis_kelamin',
        'tanggal_masuk',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class);
    }

    public function divisi()
    {
        return $this->belongsTo(Divisi::class);
    }

    public function lembur()
    {
        return $this->hasMany(Lembur::class);
    }

    public function pelanggaran()
    {
        return $this->hasMany(Pelanggaran::class);
    }

    public function gaji()
    {
        return $this->hasMany(Gaji::class);
    }

    public function cuti()
    {
        return $this->hasMany(Cuti::class);
    }

    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }
}
