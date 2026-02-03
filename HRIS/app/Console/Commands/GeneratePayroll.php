<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PayrollService;

class GeneratePayroll extends Command
{
    protected $signature = 'payroll:generate';
    protected $description = 'Generate monthly payroll automatically';

    public function handle(PayrollService $service)
    {
        $service->generate();
        $this->info('Payroll generated!');
    }
}