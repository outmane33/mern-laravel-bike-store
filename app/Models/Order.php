<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    //
    protected $fillable = [
        "total_order_price",
        "payment_method_type",
        "is_paid",
        "user_id",
        "address_id",
    ];

    public function adresse(){
        return $this->belongsTo(Adresse::class);
    }

    public function products(){
        return $this->belongsToMany(Product::class,"order_products");
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

}
