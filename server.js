<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text to Image Generator</title>
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body>
    <h1>Text to Image Generator</h1>
    <input type="text" id="text-input" placeholder="Enter text here" />
    <button id="generate-image">Generate Image</button>
    <img id="generated-image" src="" alt="Generated Image" style="display:none;"/>

    <h2>Checkout</h2>
    <button id="checkout-button">Checkout</button>

    <script>
        const textToImageApiUrl = 'http://localhost:3000/api/text-to-image'; // Replace with your API URL
        const stripe = Stripe('pk_test_51PEVvs01wt122lVHrQjhbfx2Kq1IdbASPse9WDzUgi4oemGQ7uAUzv7V01Cl8aAM47MTtROOTAwLlqTx3R2DdIW500ZCBYc2Cg'); // Replace with your Stripe public key

        document.getElementById('generate-image').addEventListener('click', async () => {
            const text = document.getElementById('text-input').value;
            const response = await fetch(textToImageApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const data = await response.json();
                const img = document.getElementById('generated-image');
                img.src = data.imageUrl;
                img.style.display = 'block';
            } else {
                alert('Error generating image');
            }
        });

        document.getElementById('checkout-button').addEventListener('click', async () => {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: 'Generated Image',
                                },
                                unit_amount: 2000,
                            },
                            quantity: 1,
                        },
                    ],
                }),
            });

            const session = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId: session.id });

            if (result.error) {
                alert(result.error.message);
            }
        });
    </script>
</body>
</html>