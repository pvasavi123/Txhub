import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("Verifying your payment...");
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (!orderId) {
      setStatus("failed");
      setMessage("No order ID found. Please contact support.");
      return;
    }

    verifyAndEnroll(orderId);
  }, []);

  const verifyAndEnroll = async (orderId) => {
    try {
      // Step 1: Verify payment with backend (which calls Cashfree)
      const verifyResp = await fetch(
        `http://127.0.0.1:8000/api/cashfree/verify/?order_id=${orderId}`
      );
      const verifyData = await verifyResp.json();
      console.log("Verify response:", verifyData);
      setOrderData(verifyData);

      if (verifyData.status !== "PAID") {
        setStatus("failed");
        setMessage(
          `Payment status: ${verifyData.status || "Unknown"}. If you completed the payment, please wait a moment and refresh.`
        );
        return;
      }

      // Step 2: Payment is PAID — now create enrollment
      // Prefer checkout_data from server if available (more reliable than localStorage)
      const localCheckout = JSON.parse(
        localStorage.getItem("pending_checkout") || "{}"
      );
      const savedCheckout = verifyData.checkout_data || localCheckout;

      if (!savedCheckout.email && !user?.email && !verifyData.customer_email) {
        setStatus("failed");
        setMessage(
          "Payment successful but session expired. Please contact support to link your course."
        );
        return;
      }

      const email = savedCheckout.email || user?.email || verifyData.customer_email;

      const enrollResponse = await fetch("http://127.0.0.1:8000/api/enroll/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          items: savedCheckout.items || [],
          amount: savedCheckout.amount || verifyData.amount,
          total_fee: savedCheckout.total_fee || verifyData.amount,
          enrollment_type: savedCheckout.enrollment_type || "full",
          batch_date: savedCheckout.batch_date || "Not Specified",
          payment_method: savedCheckout.payment_method || "upi",
          payment_session_id: verifyData.payment_session_id,
          billing_country: savedCheckout.billing_country || "India",
          billing_state: savedCheckout.billing_state || "",
        }),
      });

      const enrollData = await enrollResponse.json();
      console.log("Enrollment response:", enrollData);

      if (!enrollResponse.ok) {
        setStatus("failed");
        setMessage(
          `Payment successful but enrollment failed: ${enrollData.error || "Unknown error"}. Please contact support.`
        );
        return;
      }

      // Step 3: Success! Clean up
      localStorage.removeItem("pending_checkout");

      // Clear cart
      try {
        await fetch(
          `http://127.0.0.1:8000/api/clearcart/?email=${email}`,
          { method: "DELETE" }
        );
        clearCart();
      } catch (e) {
        console.warn("Cart clear failed:", e);
      }

      setStatus("success");
      setMessage("Payment verified and enrollment completed successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("failed");
      setMessage("Something went wrong. Please contact support.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Status Icon */}
        <div className="flex justify-center">
          {status === "verifying" && (
            <div className="p-6 bg-blue-50 rounded-full">
              <Loader2
                size={64}
                className="text-blue-600 animate-spin"
              />
            </div>
          )}
          {status === "success" && (
            <div className="p-6 bg-green-50 rounded-full animate-in zoom-in duration-500">
              <CheckCircle2 size={64} className="text-green-600" />
            </div>
          )}
          {status === "failed" && (
            <div className="p-6 bg-red-50 rounded-full animate-in zoom-in duration-500">
              <XCircle size={64} className="text-red-500" />
            </div>
          )}
        </div>

        {/* Status Title */}
        <h1
          className={`text-3xl font-black tracking-tight ${
            status === "verifying"
              ? "text-blue-600"
              : status === "success"
                ? "text-green-600"
                : "text-red-500"
          }`}
        >
          {status === "verifying" && "Verifying Payment..."}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Issue"}
        </h1>

        {/* Message */}
        <p className="text-slate-600 font-medium leading-relaxed">
          {message}
        </p>

        {/* Order Info */}
        {orderData && (
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Order ID</span>
              <span className="text-slate-800 font-mono font-bold">
                {orderData.order_id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Amount</span>
              <span className="text-slate-800 font-bold">
                ₹{orderData.amount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Status</span>
              <span
                className={`font-black uppercase text-xs px-3 py-1 rounded-full ${
                  orderData.status === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {orderData.status}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-4">
          {status === "success" && (
            <button
              onClick={() => navigate("/student")}
              className="w-full py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              Go to My Courses <ArrowRight size={20} />
            </button>
          )}

          {status === "failed" && (
            <>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base shadow-lg hover:bg-blue-700 transition-all"
              >
                Retry Verification
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-200 transition-all"
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
