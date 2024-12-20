<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    //
    public function addProductToWishlist(Request $request){
        $user = $request->user();
        $user->products()->attach($request->product_id);

        return response()->json([
            "status" => "success",
            "wishlist" => $user->products
        ]);
    }

    public function removeProductFromWishlist(Request $request,$id){
        $user = $request->user();
        $user->products()->detach($id);

        return response()->json([
            "status" => "success",
            "wishlist" => $user->products
        ]);
    }

    public function getWishlist(Request $request){
        $user = $request->user();
        return response()->json([
            "status" => "success",
            "wishlist" => $user->products
        ]);
    }

}
