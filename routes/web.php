<?php

use Illuminate\Support\Facades\Route;

// Test notification route
Route::get('/test-notification', function () {
    broadcast(new \App\Events\NotificationEvent('Halo! Ada pembaruan sistem baru pada ' . now()->toTimeString()));
    return 'Notification sent!';
});

// Catch-all route for Vue SPA
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
