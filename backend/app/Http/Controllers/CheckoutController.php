<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CheckoutController extends Controller
{
    public function validateCheckout(Request $request)
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // For Week 3, we just validate the data
        // In Week 4, we'll add order creation and payment processing
        return response()->json([
            'status' => 'success',
            'message' => 'Checkout data validated successfully'
        ]);
    }
} 