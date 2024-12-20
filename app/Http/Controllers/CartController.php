<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CartController extends Controller
{
    //
    public function addToCart(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
    
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
    
        try {
            // Get the authenticated user
            $user = $request->user();
    
            // Find the product
            $product = Product::findOrFail($request->product_id);
    
            // Check if product is in stock
            if ($product->quantity < $request->quantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient product quantity'
                ], 400);
            }
    
            // Find or create user's cart
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'total_cart_price' => 0,
                    'total_price_after_discount' => 0
                ]
            );
    
            // Check if product already exists in cart
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->first();
    
            if ($cartItem) {
                // Update existing cart item
                $cartItem->quantity += $request->quantity;
                $cartItem->price = $product->price * $cartItem->quantity;
                $cartItem->save();
            } else {
                // Create new cart item
                $cartItem = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'price' => $product->price * $request->quantity
                ]);
            }
    
            // Recalculate cart totals
            $cartItems = CartItem::where('cart_id', $cart->id)->get();
            $totalCartPrice = $cartItems->sum('price');
    
            // Update cart totals
            $cart->update([
                'total_cart_price' => $totalCartPrice,
            ]);
    
            // Reload the cart with its products
            $cart = Cart::where('user_id', $user->id)
                ->with(['products' => function ($query) {
                    $query->select('products.id', 'title', 'slug', 'products.price as product_price', 'price_after_discount', 'image_cover');
                }])
                ->first();
    
            // Format the cart items with product details
            $cartItems = $cart->products->map(function ($product) {
                return [
                    'product_id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'price' => $product->product_price,
                    'price_after_discount' => $product->price_after_discount,
                    'image_cover' => $product->image_cover,
                    'quantity' => $product->pivot->quantity,
                    'item_total_price' => $product->pivot->price
                ];
            });
    
            return response()->json([
                'status' => 'success',
                'message' => 'Product added to cart successfully',
                'cart' => [
                    'total_cart_price' => $cart->total_cart_price,
                    'total_price_after_discount' => $cart->total_price_after_discount,
                    'items' => $cartItems
                ]
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add product to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }
public function removeFromCart(Request $request)
{
    // Validate the incoming request
    $validator = Validator::make($request->all(), [
        'product_id' => 'required|exists:products,id'
    ]);

    // Check if validation fails
    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Get the authenticated user
        $user = $request->user();

        // Find the user's cart
        $cart = Cart::where('user_id', $user->id)
            ->with(['products' => function ($query) {
                $query->select('products.id', 'title', 'slug', 'products.price as product_price', 'price_after_discount', 'image_cover');
            }])
            ->first();

        // If cart doesn't exist, return error
        if (!$cart) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cart is empty',
                'cart' => [
                    'total_cart_price' => 0,
                    'total_price_after_discount' => 0,
                    'items' => []
                ]
            ], 200);
        }

        // Find the cart item to remove
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        // If cart item doesn't exist, return error
        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in cart'
            ], 404);
        }

        // Remove the cart item
        $cartItem->delete();

        // Recalculate cart totals
        $remainingCartItems = CartItem::where('cart_id', $cart->id)->get();
        
        // Update cart totals
        if ($remainingCartItems->isEmpty()) {
            // If no items left, reset cart totals
            $cart->update([
                'total_cart_price' => 0,
                'total_price_after_discount' => 0
            ]);
        } else {
            // Recalculate totals for remaining items
            $totalCartPrice = $remainingCartItems->sum('price');
            $cart->update([
                'total_cart_price' => $totalCartPrice,
            ]);
        }

        // Reload the cart with its products
        $cart = Cart::where('user_id', $user->id)
            ->with(['products' => function ($query) {
                $query->select('products.id', 'title', 'slug', 'products.price as product_price', 'price_after_discount', 'image_cover');
            }])
            ->first();

        // Format the cart items with product details
        $cartItems = $cart->products->map(function ($product) {
            return [
                'product_id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'price' => $product->product_price,
                'price_after_discount' => $product->price_after_discount,
                'image_cover' => $product->image_cover,
                'quantity' => $product->pivot->quantity,
                'item_total_price' => $product->pivot->price
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Product removed from cart successfully',
            'cart' => [
                'total_cart_price' => $cart->total_cart_price,
                'total_price_after_discount' => $cart->total_price_after_discount,
                'items' => $cartItems
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to remove product from cart',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function getCart(Request $request)
{
    try {
        // Get the authenticated user
        $user = $request->user();

        // Find the user's cart
        $cart = Cart::where('user_id', $user->id)
            ->with(['products' => function ($query) {
                $query->select('products.id', 'title', 'slug', 'products.price as product_price', 'price_after_discount', 'image_cover');
            }])
            ->first();

        // If cart doesn't exist, return an empty response
        if (!$cart) {
            return response()->json([
                'status' => 'success',
                'message' => 'Cart is empty',
                'cart' => [
                    'total_cart_price' => 0,
                    'total_price_after_discount' => 0,
                    'items' => []
                ]
            ], 200);
        }

        // Format the cart items with product details
        $cartItems = $cart->products->map(function ($product) {
            return [
                'product_id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'price' => $product->product_price, // Renamed to avoid conflict
                'price_after_discount' => $product->price_after_discount,
                'image_cover' => $product->image_cover,
                'quantity' => $product->pivot->quantity,
                'item_total_price' => $product->pivot->price
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Cart retrieved successfully',
            'cart' => [
                'total_cart_price' => $cart->total_cart_price,
                'total_price_after_discount' => $cart->total_price_after_discount,
                'items' => $cartItems
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to retrieve cart',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function clearCart(Request $request)
{
    try {
        // Get the authenticated user
        $user = $request->user();

        // Find the user's cart
        $cart = Cart::where('user_id', $user->id)->first();

        // If cart doesn't exist, return error
        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart not found'
            ], 404);
        }

        // Remove all cart items
        CartItem::where('cart_id', $cart->id)->delete();

        // Reset cart totals
        $cart->update([
            'total_cart_price' => 0,
            'total_price_after_discount' => 0
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Cart cleared successfully',
            'cart' => $cart
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to clear cart',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function updateCartItemQuantity(Request $request)
{
    // Validate the incoming request
    $validator = Validator::make($request->all(), [
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Get the authenticated user
        $user = $request->user();

        // Find the user's cart
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart not found'
            ], 404);
        }

        // Find the product
        $product = Product::findOrFail($request->product_id);

        // Check if product is in stock
        if ($product->quantity < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Insufficient product quantity'
            ], 400);
        }

        // Find the cart item to update
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in cart'
            ], 404);
        }

        // Update the cart item
        $cartItem->update([
            'quantity' => $request->quantity,
            'price' => $product->price * $request->quantity
        ]);

        // Recalculate cart totals
        $cartItems = CartItem::where('cart_id', $cart->id)->get();
        $totalCartPrice = $cartItems->sum('price');


        // Update cart totals
        $cart->update([
            'total_cart_price' => $totalCartPrice,
        ]);

        // Retrieve the updated cart with product details
        $cart = Cart::where('user_id', $user->id)
            ->with(['products' => function ($query) {
                $query->select('products.id', 'title', 'slug', 'products.price as product_price', 'price_after_discount', 'image_cover');
            }])
            ->first();

        // Format cart items
        $cartItems = $cart->products->map(function ($product) {
            return [
                'product_id' => $product->id,
                'title' => $product->title,
                'slug' => $product->slug,
                'price' => $product->product_price,
                'price_after_discount' => $product->price_after_discount,
                'image_cover' => $product->image_cover,
                'quantity' => $product->pivot->quantity,
                'item_total_price' => $product->pivot->price
            ];
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Cart item quantity updated successfully',
            'cart' => [
                'total_cart_price' => $cart->total_cart_price,
                'total_price_after_discount' => $cart->total_price_after_discount,
                'items' => $cartItems
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to update cart item quantity',
            'error' => $e->getMessage()
        ], 500);
    }
}



}
