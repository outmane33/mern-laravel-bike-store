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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->text('small_description');
            $table->text('long_description');
            $table->integer('quantity');
            $table->integer('sold');
            $table->integer('price');
            $table->integer('price_after_discount');
            $table->string('image_cover');
            $table->integer('ratings_average');
            $table->integer('ratings_quantity');
            $table->string('sku');
            $table->foreignId('category_id')->constrained("categories")->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
