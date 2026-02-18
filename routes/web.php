<?php

use Illuminate\Support\Facades\Route;

// Test notification route
Route::get('/test-notification', function () {
    \App\Events\NotificationEvent::dispatch('Halo! Ada pembaruan sistem baru pada ' . now()->toTimeString());
    return 'Notification sent!';
});

// Catch-all route for Vue SPA
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
