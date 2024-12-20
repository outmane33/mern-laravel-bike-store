<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;





Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('signin', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('check.token');
    Route::get('checkauth', [AuthController::class, 'checkauth'])->middleware('check.token');
});

Route::prefix('products')->group(function () {
    Route::post('/', [ProductController::class, 'addProduct']);
    Route::get('/', [ProductController::class, 'getProducts']);
    Route::get('/categories', [ProductController::class, 'getCategories']);
    Route::post('/categories', [ProductController::class, 'addCategory']);
    Route::get('/colors', [ProductController::class, 'getColors']);
    Route::post('/colors', [ProductController::class, 'addColor']);
    Route::get('/{slug}', [ProductController::class, 'getProductBySlug']);
    Route::put('/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/{id}', [ProductController::class, 'deleteProduct']);
    
});

Route::prefix('wishlist')->group(function () {
    Route::post('/', [WishlistController::class, 'addProductToWishlist'])->middleware('check.token');
    Route::get('/', [WishlistController::class, 'getWishlist'])->middleware('check.token');
    Route::delete('/{id}', [WishlistController::class, 'removeProductFromWishlist'])->middleware('check.token');
});

Route::prefix('review')->group(function () {
    Route::post('/', [ReviewController::class, 'addReview'])->middleware('check.token');
    Route::put('/{reviewId}', [ReviewController::class, 'updateReview'])->middleware('check.token');
    Route::delete('/{reviewId}', [ReviewController::class, 'deleteReview'])->middleware('check.token');
    Route::get('/{slug}', [ReviewController::class, 'getProductReviews'])->middleware('check.token');
});

Route::prefix('cart')->group(function () {
    Route::post('/', [CartController::class, 'addToCart'])->middleware('check.token');
    Route::get('/', [CartController::class, 'getCart'])->middleware('check.token');
    Route::put('/', [CartController::class, 'removeFromCart'])->middleware('check.token');
    Route::delete('/clear', [CartController::class, 'clearCart'])->middleware('check.token');
    Route::put('/updateQuantity', [CartController::class, 'updateCartItemQuantity'])->middleware('check.token');
});


Route::prefix('colors')->group(function () {
    Route::get('/', [ColorController::class, 'getProductsColor'])->middleware('check.token');
    Route::get('/{slug}', [ColorController::class, 'getProductColors'])->middleware('check.token');
});

Route::prefix('orders')->group(function () {
    Route::post('/cashorder', [OrderController::class, 'createCashOrder'])->middleware('check.token');
    Route::post('/checkoutSesseion', [OrderController::class, 'createCheckoutSession'])->middleware('check.token'); 
    Route::get('/', [OrderController::class, 'getAllOrders'])->middleware('check.token'); 
    Route::delete('/{id}', [OrderController::class, 'deleteOrder'])->middleware('check.token'); 
    Route::get('/{id}', [OrderController::class, 'getOrderDetails'])->middleware('check.token'); 
    Route::put('/{id}', [OrderController::class, 'updateOrder'])->middleware('check.token'); 
});

Route::prefix('test')->group(function () {
    Route::post('/addProduct', [TestController::class, 'addProduct']);
    Route::get('/getProduct/{slug}', [TestController::class, 'getProductBySlug']);
    Route::put('/updateProduct/{id}', [TestController::class, 'updateProduct']);
    Route::delete('/deleteProduct/{id}', [TestController::class, 'deleteProduct']);
    Route::get('/categories', [TestController::class, 'getCategories']);
    Route::get('/colors', [TestController::class, 'getColors']);
    Route::get('/products', [TestController::class, 'getProducts']);
    Route::post('/wishlist', [TestController::class, 'addProductToWishlist'])->middleware('check.token');
    Route::delete('/wishlist/{id}', [TestController::class, 'removeProductFromWishlist'])->middleware('check.token');
    Route::get('/wishlist', [TestController::class, 'getWishlist'])->middleware('check.token');
    Route::get('/productColors/{slug}', [TestController::class, 'getProductColors'])->middleware('check.token');
    Route::get('/colorProductsCount', [TestController::class, 'getColorProductsCount'])->middleware('check.token');
    Route::post('/review', [TestController::class, 'createReview'])->middleware('check.token');
    Route::get('/review/{slug}', [TestController::class, 'getProductReviews'])->middleware('check.token');
    Route::put('/review/{id}', [TestController::class, 'updateReview'])->middleware('check.token');
    Route::delete('/review/{id}', [TestController::class, 'deleteReview'])->middleware('check.token');
    Route::delete('/users', [TestController::class, 'getUsers'])->middleware('check.token');
    Route::post('/cart', [TestController::class, 'addProductToCart'])->middleware('check.token');
    Route::delete('/cart', [TestController::class, 'removeProductFromCart'])->middleware('check.token');
    Route::get('/cart', [TestController::class, 'getUserCart'])->middleware('check.token');
    Route::delete('/cart/clear', [TestController::class, 'clearCart'])->middleware('check.token');
    Route::put('/cart/updateQuantity', [TestController::class, 'updateCartItemQuantity'])->middleware('check.token');
    Route::post('/order/cashorder', [TestController::class, 'createCashOrder'])->middleware('check.token');
    Route::post('/order/checkoutSesseion', [TestController::class, 'createCheckoutSession'])->middleware('check.token');
});