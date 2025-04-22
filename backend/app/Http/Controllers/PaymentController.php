<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Create a Stripe PaymentIntent based on the user's cart total.
     */
    public function createPaymentIntent(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty() || $cart->total <= 0) {
            return response()->json(['error' => 'Invalid cart or amount for payment.'], 400);
        }

        // Verify cart ownership
        if ($cart->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to cart.'], 403);
        }

        // Ensure the Stripe secret key is set
        $stripeSecretKey = config('services.stripe.secret'); // Get key from config
        if (!$stripeSecretKey) {
            return response()->json(['error' => 'Stripe secret key is not configured.'], 500);
        }

        try {
            // Initialize Stripe
            Stripe::setApiKey($stripeSecretKey);
            Stripe::setApiVersion('2024-04-10'); // Optional: Set a specific API version

            // Create a PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($cart->total * 100), // Amount in cents
                'currency' => 'usd', // Change currency if needed
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                // Add metadata if needed (e.g., user_id, cart_id)
                'metadata' => [
                    'user_id' => $user->id,
                    'cart_id' => $cart->id,
                    'cart_total' => $cart->total,
                ]
            ]);

            // Return the client secret to the frontend
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);

        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Handle Stripe API errors
            Log::error('Stripe API Error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Payment service error: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Handle other errors
            Log::error('Payment Intent Creation Error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to create payment intent.'], 500);
        }
    }
}
