<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation</title>
</head>
<body>
    <h1>Order Confirmation</h1>
    <p>Thank you for your order!</p>
    <p>Order ID: {{ $order->id }}</p>
    <p>Total: ${{ number_format($order->total, 2) }}</p>
    <p>We will process your order shortly.</p>
</body>
</html> 