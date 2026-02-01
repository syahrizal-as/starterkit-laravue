<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('icon')->nullable();
            $table->string('to')->nullable(); // Internal route path
            $table->string('href')->nullable(); // External URL
            $table->string('target')->nullable()->default('_self'); // _self, _blank
            $table->unsignedBigInteger('parent_id')->nullable(); // For nested menus
            $table->integer('order')->default(0); // Sort order
            $table->boolean('is_section_title')->default(false); // Section title (divider)
            $table->boolean('is_active')->default(true);
            $table->string('permission')->nullable(); // Required permission to view
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('menus')->onDelete('cascade');
        });

        // Pivot table for menu-role relationship
        Schema::create('menu_role', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('menu_id');
            $table->unsignedBigInteger('role_id');
            $table->timestamps();

            $table->foreign('menu_id')->references('id')->on('menus')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->unique(['menu_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_role');
        Schema::dropIfExists('menus');
    }
};
