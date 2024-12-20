<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        "title",
        "slug",
        "small_description",
        "long_description",
        "quantity",
        "sold",
        "price",
        "price_after_discount",
        "image_cover",
        "ratings_average",
        "ratings_quantity",
        "sku",
        "category_id",
    ];

    public function colors(){
        return $this->belongsToMany(Color::class,"product_colors");
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function product_images(){
        return $this->hasMany(ProductImage::class);
    }

    public function users(){
        return $this->belongsToMany(User::class,"wishlists");
    }

    public function orders(){
        return $this->belongsToMany(Order::class,"order_products");
    }

    public function carts(){
        return $this->belongsToMany(Cart::class,"cart_items");
    }
    public function usersreview(){
        return $this->belongsToMany(User::class,"reviews");
    } 
}
