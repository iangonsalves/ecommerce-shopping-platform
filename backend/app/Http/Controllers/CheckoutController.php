<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;

class CheckoutController extends Controller
{
    /**
     * Process the checkout request, create an order, and clear the cart.
     */
    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping' => 'required|array',
            'shipping.firstName' => 'required|string|max:255',
            'shipping.lastName' => 'required|string|max:255',
            'shipping.address1' => 'required|string|max:255',
            'shipping.address2' => 'nullable|string|max:255',
            'shipping.city' => 'required|string|max:255',
            'shipping.state' => 'required|string|max:255',
            'shipping.zip' => 'required|string|max:20',
            'shipping.country' => 'required|string|max:255',
            'shipping.phone' => 'required|string|max:20',
            // Add payment details validation here if needed in the future
            // 'payment' => 'required|array',
            // 'payment.method' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $cart = Cart::with('items.product')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['status' => 'error', 'message' => 'Your cart is empty.'], 400);
        }

        // Use a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            $shippingData = $request->input('shipping');

            // Prepare order data for debug
            $orderData = [
                'user_id' => $user->id,
                'total' => $cart->total,
                'status' => 'pending',
                'shipping_first_name' => $shippingData['firstName'],
                'shipping_last_name' => $shippingData['lastName'],
                'shipping_address1' => $shippingData['address1'],
                'shipping_address2' => $shippingData['address2'] ?? null,
                'shipping_city' => $shippingData['city'],
                'shipping_state' => $shippingData['state'],
                'shipping_zip' => $shippingData['zip'],
                'shipping_country' => $shippingData['country'],
                'shipping_phone' => $shippingData['phone'],
                'payment_status' => 'pending',
            ];
            Log::error('Order data to be inserted', $orderData);

            // Try to create the Order
            try {
                $order = Order::create($orderData);
                // Manual check: ensure order was actually created
                if (!$order || !$order->id || !Order::find($order->id)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Order creation failed: Order not found after insert. There may be a DB constraint or trigger issue.',
                        'order_data' => $orderData
                    ], 500);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Order creation failed: ' . $e->getMessage(),
                    'order_data' => $orderData
                ], 500);
            }

            // Prepare order items data for debug
            $orderItemsData = [];
            foreach ($cart->items as $cartItem) {
                $itemData = [
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                ];
                Log::error('OrderItem data to be inserted', $itemData);
                $orderItemsData[] = $itemData;
                try {
                    OrderItem::create($itemData);
                } catch (\Exception $e) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'OrderItem creation failed:',
                        'error_details' => $e->getMessage(),
                        'order_item_data' => $itemData
                    ], 500);
                }
            }

            // Clear the user's cart (delete items, then the cart itself)
            $cart->items()->delete();
            $cart->delete();

            // Commit the transaction
            DB::commit();

            // Send order confirmation email
            Mail::to($user->email)->send(new OrderConfirmation($order));

            // Return success response with order details
            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully!',
                'order' => $order->load('items') // Optionally return the created order
            ], 201);

        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            // Log the detailed error
            Log::error('Order placement failed for user ' . $user->id . ': ' . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to place order. An internal error occurred. Please try again later.',
                'error_details' => $e->getMessage(), // TEMPORARY: Remove in production!
                'order_data' => $orderData ?? null,
                'order_items_data' => $orderItemsData ?? null
            ], 500);
        }
    }
} 