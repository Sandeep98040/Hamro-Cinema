import React, { useState } from 'react';
import khaltiCheckout from "khalti-checkout-web";
import config from "../components/khalti/khaltiConfig";

const PaymentGateway = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    let checkout = new khaltiCheckout(config);
    const [showError, setShowError] = useState(false);

    const handlePayment = (option) => {
        setSelectedOption(option);
        setShowError(false);

        if (option === 'Khalti') {
            // Khalti payment logic here
            checkout.show({ amount: 1500 });
            alert('Khalti payment initiated.');
        } else if (option === 'E-Sewa') {
            // E-Sewa payment logic here
            alert('E-Sewa payment initiated.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 text-gray-900">
            <h2 className="text-3xl font-bold text-white mb-8">Choose Payment Method</h2>
            <div className="flex flex-col items-center gap-8">
                <div
                    onClick={() => handlePayment('Khalti')}
                    className="p-4 rounded-lg cursor-pointer bg-white hover:bg-blue-500"
                >
                    {/* Replace the src with your Khalti logo image path */}
                    <img src="https://web.khalti.com/static/img/logo1.png" alt="Khalti" className="w-48 h-48 object-contain" />
                </div>
                <div
                    onClick={() => handlePayment('E-Sewa')}
                    className="p-4 rounded-lg cursor-pointer bg-white hover:bg-blue-500"
                >
                    {/* Replace the src with your E-Sewa logo image path */}
                    <img src="https://cdn.esewa.com.np/ui/images/esewa_og.png?111" alt="E-Sewa" className="w-48 h-48 object-contain" />
                </div>
            </div>
            {showError && <p className="text-red-500 mt-4">Please select a payment method.</p>}
        </div>
    );
};

export default PaymentGateway;
