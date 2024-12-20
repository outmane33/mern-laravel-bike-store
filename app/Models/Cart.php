<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //
    protected $fillable = [
        'total_cart_price',
        'total_price_after_discount',
        'user_id',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function products(){
        return $this->belongsToMany(Product::class,"cart_items")->withPivot('quantity', 'price');;
    } 
}
