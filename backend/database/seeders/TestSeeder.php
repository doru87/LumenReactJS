<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       User::factory()->count(5)->has(Board::factory()->count(3),'boards')->create();
    }
}
