<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Product;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    //
    public function getProductsColor()
    {
        try {
            // Get all colors
            $colors = Color::all();
            $colorProductCounts = [];
    
            // Loop through each color and get the product count
            foreach ($colors as $color) {
                $colorProductCounts[] = [
                    'color' => $color->name,
                    'product_count' => $color->products()->count()
                ];
            }
    
            return response()->json([
                'status' => 'success',
                'colors' => $colorProductCounts
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving product counts for colors.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductColors($slug){
        $product = Product::where('slug', $slug)->first();
        
        
        return response()->json([
            'status' => 'success',
            'colors' => $product->colors->pluck('name')->toArray()
        ]);
    }


    
}
