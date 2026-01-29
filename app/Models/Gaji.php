<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gaji extends Model
{
    use HasFactory;

    protected $table = 'gaji';

    protected $fillable = [
        'karyawan_id',
        'bulan',
        'tahun',
        'gaji_pokok',
        'total_lembur',
        'total_potongan',
        'total_gaji',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class);
    }
}
