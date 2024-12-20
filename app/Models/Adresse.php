<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Adresse extends Model
{
    //
    protected $fillable = [
        "details",
        "phone",
        "city",
        "postal_code"
    ];

    public function orders(){
        return $this->hasMany(Order::class);
    }

}
