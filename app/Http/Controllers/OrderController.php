<?php

namespace App\Http\Controllers;

use App\Models\Adresse;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    //
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

    public function getAllOrders(Request $request)
    {
        try {
            // Start with base query
            $query = Order::query();

            // Add user relationship
            $query->with('user:id,username,email');

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

            // Filter by user
            if ($request->has('user_id')) {
                $query->where('user_id', $request->input('user_id'));
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
            $perPage = $request->input('per_page', 12);
            $perPage = max(1, min($perPage, 100)); // Ensure between 1 and 100

            $orders = $query->paginate($perPage);

            // Transform the data to include user information
            $transformedOrders = collect($orders->items())->map(function ($order) {
                $orderArray = $order->toArray();
                $orderArray['user'] = [
                    'id' => $order->user->id,
                    'username' => $order->user->username,
                    'email' => $order->user->email,
                ];
                return $orderArray;
            });

            return response()->json([
                'status' => 'success',
                'orders' => $transformedOrders,
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'total_pages' => $orders->lastPage(),
                    'total_items' => $orders->total(),
                    'per_page' => $orders->perPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while retrieving orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function deleteOrder($id)
    {
        $order = Order::find($id);
        if ($order) {
            $order->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Order deleted successfully'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }
    }
    public function getOrderDetails($id)
    {
        $order = Order::find($id);
        $order->load('user:id,username');
        $order->load('adresse:id,details');
        $details = OrderProduct::where('order_id', $id)->get();
        $details->load('product:id,title,slug,image_cover');
        if ($order) {
            return response()->json([
                'status' => 'success',
                'order' => $order,
                'details' => $details
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }
    }
    public function updateOrder(Request $request, $id)
    {
        $order = Order::find($id);
        $order->load('user:id,username');
        if ($order) {
            $order->update($request->all());
            return response()->json([
                'status' => 'success',
                'order' => $order,
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }
    }
}
