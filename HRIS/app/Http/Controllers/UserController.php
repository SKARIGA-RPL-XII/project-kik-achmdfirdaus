<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function absensi()
    {
        return Inertia::render('user/absensi');
    }
}
