<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    //

    public function addReview(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();
    
        // Validation rules
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
            'title' => 'nullable|string|max:255',
            'number_of_likes' => 'nullable|integer|min:0'
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            // Create a new Review model instance directly
            $review = Review::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'rating' => $request->input('rating', 0),
                'content' => $request->input('content', ''),
                'title' => $request->input('title', ''),
                'number_of_likes' => $request->input('number_of_likes', 0)
            ]);
    
            // Reload the review to include the related user information
            $review->load('user:id,username'); // Ensure we include user details like in getProductReviews
    
            // Fetch all reviews for the product (to mimic the response structure of getProductReviews)
            $reviews = Review::where('product_id', $request->product_id)
                ->with('user:id,username') // Only select necessary user fields
                ->orderBy('created_at', 'desc')
                ->paginate(10);
    
            // Return response matching the getProductReviews structure
            return response()->json([
                'status' => 'success',
                'reviews' => $reviews->items(), // Return all reviews with the new one included
                'meta' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage()
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create review',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getProductReviews($slug)
    {
        try {
            // Validate product exists
            $product = Product::where('slug', $slug)->firstOrFail();

            // Fetch reviews with user information
            $reviews = Review::where('product_id', $product->id)
                ->with('user:id,username') // Only select necessary user fields
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'reviews' => $reviews->items(),
                'meta' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateReview(Request $request, $reviewId)
{
    // Get the authenticated user
    $user = $request->user();

    try {
        // Find the review and check if it belongs to the current user
        $review = Review::findOrFail($reviewId);

        // Ensure the user can only update their own review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this review'
            ], 403);
        }

        // Validation rules
        $validator = Validator::make($request->all(), [
            'rating' => 'nullable|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
            'title' => 'nullable|string|max:255',
            'number_of_likes' => 'nullable|integer|min:0'
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update the review with the provided fields
        $review->update([
            'rating' => $request->input('rating', $review->rating),
            'content' => $request->input('content', $review->content),
            'title' => $request->input('title', $review->title),
            'number_of_likes' => $request->input('number_of_likes', $review->number_of_likes)
        ]);

        return response()->json([
            "status" => "success",
            "review" => $review
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to update review',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function deleteReview(Request $request, $reviewId)
{
    // Get the authenticated user
    $user = $request->user();

    try {
        // Find the review and check if it belongs to the current user
        $review = Review::findOrFail($reviewId);

        // Ensure the user can only delete their own review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this review'
            ], 403);
        }

        // Delete the review
        $review->delete();

        return response()->json([
            "status" => "success",
            "message" => "Review deleted successfully"
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to delete review',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
