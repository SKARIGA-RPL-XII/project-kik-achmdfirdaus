<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggaran extends Model
{
    use HasFactory;

    protected $table = 'pelanggaran';

    protected $fillable = [
        'karyawan_id',
        'tanggal',
        'pelanggaran',
        'status',
        'potongan',
    ];

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class);
    }
}
