<?php

namespace App\Http\Controllers;

use App\Models\Adresse;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Color;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TestController extends Controller
{
    //

    // products
    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'small_description' => 'required|string',
            'long_description' => 'required|string',
            'quantity' => 'required|integer|min:0',
            'sold' => 'integer|min:0',
            'price' => 'required|integer|min:0',
            'price_after_discount' => 'nullable|integer|min:0|lte:price',
            'image_cover' => 'required|string|max:255',
            'ratings_average' => 'nullable|integer|between:0,5',
            'ratings_quantity' => 'nullable|integer|min:0',
            'sku' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id'
        ]);
        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();

        if (isset($validatedData['title'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }

        $product = Product::create($validatedData);

        $product->load('category:id,name');

        return response()->json([
            'status' => 'success',
            'product' => $product
        ]);
    }

    public function getProductBySlug($slug)
    {
        $validator = Validator::make([
            'slug' => $slug
        ], [
            'slug' => 'required|string|max:255'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::where('slug', $slug)->first();

        $product->load('category:id,name');

        return response()->json([
            'status' => 'success',
            'product' => $product
        ]);
    }

    public function updateProduct(Request $request, $id)
    {
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
            'sku' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();

        if (isset($validatedData['title'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }

        $product = Product::findOrFail($id);
        $product->update($validatedData);

        $product->load('category:id,name');

        return response()->json([
            'status' => 'success',
            'product' => $product
        ]);
    }

    public function deleteProduct($id)
    {
        $validator = Validator::make([
            'id' => $id
        ], [
            'id' => 'required|integer'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ], 200);
    }

    public function getCategories()
    {
        $categories = Category::all();
        return response()->json([
            'status' => 'success',
            'categories' => $categories
        ]);
    }
    public function getColors()
    {
        $colors = Color::all();
        return response()->json([
            'status' => 'success',
            'categories' => $colors
        ]);
    }
    public function getProducts()
    {
        $products = Product::all();
        return response()->json([
            'status' => 'success',
            'categories' => $products
        ]);
    }

    // wishlist
    public function addProductToWishlist(Request $request)
    {
        $user = $request->user();
        $user->products()->attach($request->product_id);

        return response()->json([
            'status' => 'success',
            "wishlist" => $user->products
        ]);
    }
    public function removeProductFromWishlist(Request $request, $id)
    {
        $user = $request->user();
        $user->products()->detach($id);

        return response()->json([
            'status' => 'success',
            "wishlist" => $user->products
        ]);
    }
    public function getWishlist(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'status' => 'success',
            "wishlist" => $user->products
        ]);
    }
    // colors
    public function getProductColors($slug)
    {
        $product = Product::where('slug', $slug)->first();
        return response()->json([
            'status' => 'success',
            'colors' => $product->colors->pluck('name')->toArray()
        ]);
    }
    public function getColorProductsCount()
    {
        $colors = Color::all();
        $colorProductCounts = [];

        foreach ($colors as $color) {
            $colorProductCounts[] = [
                'color' => $color->name,
                'product_count' => $color->products()->count()
            ];
        }

        return response()->json([
            'status' => 'success',
            'colors' => $colorProductCounts
        ]);
    }
    // reviews

    public function createReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'content' => 'nullable|string|max:1000',
            'title' => 'nullable|string|max:255',
            'number_of_likes' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();

        $validatedData['user_id'] = $request->user()->id;

        $review = Review::create($validatedData);

        $review->load('user:id,username');

        return response()->json([
            'status' => 'success',
            'review' => $review
        ]);
    }

    public function getProductReviews(Request $request, $slug)
    {
        $product = Product::where('slug', $slug)->first();

        $reviews = Review::where('product_id', $product->id)->get();

        $reviews->load('user:id,username');
        return response()->json([
            'status' => 'success',
            'reviews' => $reviews
        ]);
    }

    public function updateReview(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $validatedData = $validator->validated();

        $review = Review::findOrFail($id);

        if ($request->user()->id !== $review->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this review'
            ], 403);
        }

        $review->update($validatedData);

        return response()->json([
            'status' => 'success',
            'review' => $review
        ]);
    }

    public function deleteReview(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        if ($request->user()->id !== $review->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this review'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Review deleted successfully'
        ]);
    }
    // users
    public function getUsers(Request $request)
    {
        $users = User::all();
        return response()->json([
            'status' => 'success',
            'users' => $users
        ]);
    }
    //cart
    public function addProductToCart(Request $request)
    {
        $user = $request->user();
        $product = Product::where('id', $request->product_id)->first();

        if ($product->quantity < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product quantity is not enough'
            ], 422);
        }

        $cart = Cart::firstOrCreate(
            [
                'user_id' => $user->id
            ],
            [
                "total_cart_price" => 0,
                "total_price_after_discount" => 0
            ]
        );
        $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $request->product_id)->first();
        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->price = $product->price * $cartItem->quantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'price' => $product->price * $request->quantity
            ]);
        }

        $cartItems = CartItem::where('cart_id', $cart->id)->get();
        $totalPrice = $cartItems->sum('price');

        $cart->update([
            "total_cart_price" => $totalPrice
        ]);

        $cart->load("user:id,username");
        $cartItems->load("product:id,title,slug,image_cover");
        return response()->json([
            'status' => 'success',
            'cart' => $cart,
            'cartItems' => $cartItems
        ]);


    }
    public function removeProductFromCart(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        $cart->products()->detach($request->product_id);
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    public function getUserCart(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    public function clearCart(Request $request)
    {
        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();
        $cart->products()->detach();
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    public function updateCartItemQuantity(Request $request)
    {
        $user = $request->user();
        $product = Product::where('id', $request->product_id)->first();
        if ($product->quantity < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product quantity is not enough'
            ], 422);
        }
        $cart = Cart::where('user_id', $user->id)->first();
        $cart->products()->updateExistingPivot($request->product_id, ['quantity' => $request->quantity, 'price' => $product->price * $request->quantity]);
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    //orders
    public function createCashOrder(Request $request)
    {

        $user = $request->user();
        $adress = null;
        if ($request->address_id == null) {
            $adress = Adresse::create([
                'details' => $request->details,
                'phone' => $request->phone,
                "city" => $request->city,
                "postal_code" => $request->postal_code
            ]);
        }
        $cart = Cart::where('user_id', $user->id)->first();
        $order = Order::create([
            'total_order_price' => $cart->total_cart_price,
            'payment_method_type' => "cash",
            'is_paid' => false,
            'user_id' => $user->id,
            'address_id' => $adress ? $adress->id : $request->address_id
        ]);
        $cartItems = CartItem::where('cart_id', $cart->id)->get();
        foreach ($cartItems as $cartItem) {
            $order->products()->attach($cartItem->product_id, ['quantity' => $cartItem->quantity, 'price' => $cartItem->price, 'order_status' => "pending"]);
        }
        $cart->products()->detach();
        return response()->json([
            'status' => 'success',
            'order' => $order,

        ]);
    }

    public function createCheckoutSession(Request $request)
    {
        $user = $request->user();

        // Step 1: Address Handling
        $address = null;
        if ($request->address_id == null) {
            $address = Adresse::create([
                'details' => $request->details,
                'phone' => $request->phone,
                'city' => $request->city,
                'postal_code' => $request->postal_code,
            ]);
        }

        // Step 2: Get Cart Details
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'No cart found for this user.',
            ], 404);
        }

        // Calculate total order price (can include tax, shipping, etc.)
        $taxPrice = 0;
        $shippingPrice = 0;
        $cartPrice = $cart->total_cart_price;
        $totalOrderPrice = $cartPrice + $taxPrice + $shippingPrice;

        // Step 3: Initialize Stripe
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            // Step 4: Create Stripe Checkout Session
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'mad', // Change to your currency
                            'unit_amount' => $totalOrderPrice * 100,
                            'product_data' => [
                                'name' => 'Order for ' . $user->username,
                            ],
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => env('FRONTEND_URL') . '/order/success/{CHECKOUT_SESSION_ID}',
                'cancel_url' => env('FRONTEND_URL') . '/order/cancel',
                'customer_email' => $user->email,
                'client_reference_id' => $cart->id,
                'metadata' => [
                    'user_id' => $user->id,
                    'address_id' => $address ? $address->id : $request->address_id,
                ],
            ]);

            return response()->json([
                'status' => 'success',
                'sessionId' => $session->id,
                'checkoutUrl' => $session->url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}
