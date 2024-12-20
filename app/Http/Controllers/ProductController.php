<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //
    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'small_description' => 'required|string',
            'long_description' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'sold' => 'integer|min:0',
            'price' => 'required|numeric|min:0', // Changed to numeric for decimal prices
            'price_after_discount' => 'nullable|numeric|min:0|lte:price',
            'image_cover' => 'required|string', // Removed max:255 for base64
            'ratings_average' => 'nullable|numeric|between:0,5', // Changed to numeric
            'ratings_quantity' => 'nullable|integer|min:0',
            'sku' => 'required|string|max:255|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'colors' => 'array|min:1',
            'images' => 'array|max:3', // Limit to 3 images
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            // Get validated data
            $validatedData = $validator->validated();
    
            // Handle image upload before creating product
            try {
                $uploadResponse = Cloudinary::upload($request->image_cover);
                $validatedData['image_cover'] = $uploadResponse->getSecurePath();
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to upload image',
                    'error' => $e->getMessage(),
                ], 500);
            }
    
            // Set default values for nullable fields
            $validatedData['sold'] = $validatedData['sold'] ?? 0;
            $validatedData['price_after_discount'] = $validatedData['price_after_discount'] ?? 0;
            $validatedData['ratings_average'] = $validatedData['ratings_average'] ?? 0;
            $validatedData['ratings_quantity'] = $validatedData['ratings_quantity'] ?? 0;
    
            // Generate unique slug
            $baseSlug = Str::slug($validatedData['title']);
            $slug = $baseSlug;
            $counter = 1;
    
            while (Product::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
    
            $validatedData['slug'] = $slug;
    
            // Create the product
            $product = Product::create($validatedData);
    
            // Add colors to the product
            $product->colors()->attach($validatedData['colors']);

            // upload images to cloudinary and add them to the product
            if (isset($validatedData['images']) && !empty($validatedData['images'])) {
                $productImages = [];
                
                foreach ($validatedData['images'] as $image) {
                    try {
                        // Upload image to Cloudinary
                        $uploadResponse = Cloudinary::upload($image);
                        
                        // Create record in product_images table
                        $productImages[] = [
                            'product_id' => $product->id,
                            'image_url' => $uploadResponse->getSecurePath(),
                        ];
                        
                    } catch (\Exception $e) {
                        // Log the error but continue with other images
                        \Illuminate\Support\Facades\Log::error('Failed to upload product image: ' . $e->getMessage());
                        continue;
                    }
                }
                
                // Bulk insert all successful image uploads
                if (!empty($productImages)) {
                    \Illuminate\Support\Facades\DB::table('product_images')->insert($productImages);

                }
            }

            return response()->json([
                'status' => 'success',
                'product' => $product,
                'colors'=> $validatedData['colors']
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getProductBySlug($slug)
    {
        $product =  Product::where('slug', $slug)->first();

        $product -> load('category:id,name');
        $product -> load('colors:id,name');
        $images = ProductImage::where('product_id', $product->id)->get();
        return response()->json([
            'status' => 'success',
            "product" => $product,
            "images" => $images
        ]);
    }

    public function updateProduct(Request $request, $id)
    {
        // Validation rules (similar to addProduct, but without uniqueness constraints)
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'small_description' => 'sometimes|string',
            'long_description' => 'sometimes|string',
            'quantity' => 'sometimes|integer|min:0',
            'sold' => 'sometimes|integer|min:0',
            'price' => 'sometimes|integer|min:0',
            'price_after_discount' => 'sometimes|nullable|integer|min:0|lte:price',
            'image_cover' => 'sometimes|string|max:255',
            'ratings_average' => 'sometimes|nullable|integer|between:0,5',
            'ratings_quantity' => 'sometimes|nullable|integer|min:0',
            'sku' => 'sometimes|string|max:255|unique:products,sku,' . $id,
            'category_id' => 'sometimes|exists:categories,id'
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Find the product
            $product = Product::findOrFail($id);

            // Validate the data
            $validatedData = $validator->validated();

            // If title is being updated, regenerate slug
            if (isset($validatedData['title'])) {
                $baseSlug = Str::slug($validatedData['title']);
                $slug = $baseSlug;
                $counter = 1;

                // Ensure unique slug
                while (Product::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $validatedData['slug'] = $slug;
            }

            // Update the product
            $product->update($validatedData);

            // Refresh the model to get the updated version
            $product->refresh();

            return response()->json([
                'status' => 'success',
                'product' => $product
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle product not found
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteProduct($id)
    {
        try {
            // Find and delete the product
            $product = Product::findOrFail($id);
            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product deleted successfully'
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle product not found
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCategories(Request $request)
    {
        try {
            // Start with base query
            $query = Category::query();

            // search
            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Validate sort column to prevent potential SQL injection
            $allowedSortColumns = ['id', 'name', 'created_at', 'updated_at'];
            $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'created_at';
            $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'desc';

            $query->orderBy($sortBy, $sortDirection);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $perPage = max(1, min($perPage, 100)); // Ensure between 1 and 100

            $categories = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'categories' => $categories->items(),
                'meta' => [
                    'current_page' => $categories->currentPage(),
                    'total_pages' => $categories->lastPage(),
                    'total_items' => $categories->total(),
                    'per_page' => $categories->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function addCategory(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        $category = Category::create($validatedData);

        return response()->json([
            "status"=>"success",
            "category" => $category
        ]);



    }
    public function getColors(Request $request)
    {
        try {
            // Start with base query
            $query = Color::query();

            // search
            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Validate sort column to prevent potential SQL injection
            $allowedSortColumns = ['id', 'name', 'created_at', 'updated_at'];
            $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'created_at';
            $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'desc';

            $query->orderBy($sortBy, $sortDirection);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $perPage = max(1, min($perPage, 100)); // Ensure between 1 and 100

            $colors = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'colors' => $colors->items(),
                'meta' => [
                    'current_page' => $colors->currentPage(),
                    'total_pages' => $colors->lastPage(),
                    'total_items' => $colors->total(),
                    'per_page' => $colors->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function addColor(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50|unique:categories,name',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();
        $color = Color::create($validatedData);

        return response()->json([
            "status"=>"success",
            "color" => $color
        ]);



    }

    public function getProducts(Request $request)
    {
        try {
            // Start with base query
            $query = Product::query();
    
            // Search by title
            if ($request->has('title')) {
                $query->where('title', 'like', '%' . $request->input('title') . '%');
            }
    
            // Search by category
            if ($request->has('category')) {
                $query->whereHas('category', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('name', 'like', '%' . $request->input('category') . '%');
                });
            }
    
            // Search by colors
            if ($request->has('colors')) {
                $colors = is_array($request->input('colors')) ? $request->input('colors') : [$request->input('colors')];
                $query->whereHas('colors', function ($colorQuery) use ($colors) {
                    $colorQuery->whereIn('name', $colors);
                });
            }
    
            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Validate sort column to prevent potential SQL injection
            $allowedSortColumns = ['id', 'title', 'small_description', 'long_description', 'quantity', 'sold', 'price', 'price_after_discount', 'ratings_average', 'ratings_quantity', 'sku', 'created_at', 'updated_at'];
            $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'created_at';
            $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? $sortDirection : 'desc';
    
            $query->orderBy($sortBy, $sortDirection);
    
            // Pagination
            $perPage = $request->input('per_page', 10);
            $perPage = max(1, min($perPage, 100)); // Ensure between 1 and 100
    
            $products = $query->paginate($perPage);
    
            return response()->json([
                'status' => 'success',
                'products' => $products->items(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'total_pages' => $products->lastPage(),
                    'total_items' => $products->total(),
                    'per_page' => $products->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
