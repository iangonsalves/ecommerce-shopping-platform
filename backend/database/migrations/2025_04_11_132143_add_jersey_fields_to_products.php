<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('size_variations')->nullable();
            $table->string('season')->nullable();
            $table->enum('team_type', ['home', 'away', 'third'])->nullable();
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['size_variations', 'season', 'team_type']);
        });
    }
};