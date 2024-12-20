<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    //
    protected $fillable = [
        "order_id",
        "product_id",
        "quantity",
        "price",
        "paid_at",
        "order_status" 
    ];
}
