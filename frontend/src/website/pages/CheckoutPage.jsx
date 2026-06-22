import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  ChevronDown,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  Play,
  BarChart3,
  HelpCircle,
  Check
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

// Dynamically load Cashfree SDK from CDN to avoid build/npm resolution issues
const loadCashfreeSDK = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      resolve(window.Cashfree);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { 
    items = [], 
    isBalancePayment = false, 
    totalOriginal = 0, 
    amountPreviouslyPaid = 0 
  } = location.state || {};
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [billingCountry, setBillingCountry] = useState("India");
  const [billingState, setBillingState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cashfree");

  // Advanced Enrollment State
  const [batchDate, setBatchDate] = useState("01 June 2026");
  const [classType, setClassType] = useState("live"); // live | recorded
  const [enrollmentType, setEnrollmentType] = useState("full"); // full | slot

  // Calculate base totals from items
  const subtotalBase = items.reduce((sum, item) => {
    const priceValue = typeof item.price === "string"
      ? parseInt(item.price.replace(/[^0-9]/g, ""))
      : item.price;
    return sum + (priceValue || 0);
  }, 0);

  const livePrice = 4999;
  const recordedPrice = 500;

  // Define total to pay based on enrollment type
  let totalToPay = classType === "live" ? livePrice : recordedPrice;
  let summaryTitle = classType === "live" ? "Live Classes" : "Recorded Classes";

  if (isBalancePayment) {
    totalToPay = totalOriginal - amountPreviouslyPaid;
    summaryTitle = "Remaining Balance";
  }

  // Prices based on class type
  const originalPriceBase = classType === "live" ? 9999 : 5999;
  const discount = classType === "live" ? 5000 : 5499;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Your checkout is empty</h2>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  const handleProceed = async () => {
    try {
      const email = user?.email;

      // 1. Save checkout data to localStorage BEFORE redirect
      // For balance payments: use totalOriginal as total_fee so the enrollment
      // correctly reflects the full course price after unlocking.
      const checkoutData = {
        email: email,
        items: items,
        amount: totalToPay,
        total_fee: isBalancePayment ? totalOriginal : subtotalBase,
        enrollment_type: isBalancePayment ? "full" : (classType === "live" ? "full" : "slot"),
        batch_date: batchDate,
        payment_method: paymentMethod,
        billing_country: billingCountry,
        billing_state: billingState,
      };
      localStorage.setItem("pending_checkout", JSON.stringify(checkoutData));

      // 2. Initialize Cashfree payment (with return_url and checkout details)
      const paymentResp = await fetch("http://127.0.0.1:8000/api/payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(totalToPay),
          customer_name: user?.full_name || "Student",
          customer_email: user?.email || "student@example.com",
          customer_phone: user?.phone || "9999999999",
          return_url: window.location.origin,
          items: items,
          total_fee: isBalancePayment ? totalOriginal : subtotalBase,
          enrollment_type: isBalancePayment ? "full" : (classType === "live" ? "full" : "slot"),
          batch_date: batchDate,
          payment_method: paymentMethod,
          billing_country: billingCountry,
          billing_state: billingState,
        }),
      });
      const paymentData = await paymentResp.json();

      if (!paymentResp.ok || !paymentData.payment_session_id) {
        console.error("Payment init failed:", paymentData);
        alert(paymentData.error || "Payment initialization failed ❌");
        localStorage.removeItem("pending_checkout");
        return;
      }

      // 3. Load Cashfree SDK from CDN and open checkout
      const CashfreeSDK = await loadCashfreeSDK();
      if (!CashfreeSDK) {
        alert("Failed to load payment SDK. Check your internet connection ❌");
        localStorage.removeItem("pending_checkout");
        return;
      }

      const cashfree = CashfreeSDK({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: paymentData.payment_session_id,
        redirectTarget: "_self",
      });

    } catch (error) {
      console.error("⚠️ Error:", error);
      localStorage.removeItem("pending_checkout");
      alert("Something went wrong ⚠️");
    }
  };

  const currentCourse = items[0] || {};
  const courseTitle = currentCourse.title || "Front End Web Development";
  const courseImg = currentCourse.img || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&h=200&fit=crop";

  return (
    <div className="min-h-screen bg-slate-50/50 font-['Inter',sans-serif] text-slate-900">
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 pt-32 pb-24">
        
        {/* Back to Cart link */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Cart
        </button>

        {/* Title Header */}
        <div className="mb-10">
          <h1 className="text-[36px] font-extrabold text-slate-900 tracking-tight leading-none">Checkout</h1>
          <p className="text-slate-500 text-[15px] mt-2">Complete your enrollment and start learning.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT SECTION: Enrollment Options */}
          <div className="w-full lg:flex-1 space-y-8">
            <div className="bg-white rounded-[24px] border border-slate-100 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-8">
              
              {/* Enrollment Header */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-900">Enrollment options</h2>
              </div>

              {/* Select Batch Date */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block">
                  Select Batch Start Date
                </label>
               <div className="relative max-w-[340px]">
  <Calendar
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
  />

  <input
    type="date"
    value={batchDate}
    onChange={(e) => setBatchDate(e.target.value)}
    className="w-full h-14 pl-12 pr-4 border border-slate-200 rounded-[16px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-semibold text-slate-700 bg-white text-sm"
    required
  />
</div>
              </div>

              {/* Select Class Type */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block">
                  Select Class Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Live Classes Card */}
                  <div
                    onClick={() => setClassType("live")}
                    className={`relative p-4 rounded-[16px] border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[110px] ${
                      classType === "live"
                        ? "border-blue-600 bg-blue-50/10 shadow-[0_4px_16px_rgba(37,99,235,0.06)]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                    }`}
                  >
                    {/* Select Radio Status */}
                    <div className="absolute top-4 right-4">
                      {classType === "live" ? (
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    {/* Top Content */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Play size={14} className="fill-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-slate-900 leading-tight">Live Classes</h3>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Interactive classes with live instructors</p>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-blue-600 font-extrabold text-[15px] mt-2">₹4,999</p>
                  </div>

                  {/* Recorded Classes Card */}
                  <div
                    onClick={() => setClassType("recorded")}
                    className={`relative p-4 rounded-[16px] border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[110px] ${
                      classType === "recorded"
                        ? "border-blue-600 bg-blue-50/10 shadow-[0_4px_16px_rgba(37,99,235,0.06)]"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                    }`}
                  >
                    {/* Select Radio Status */}
                    <div className="absolute top-4 right-4">
                      {classType === "recorded" ? (
                        <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>

                    {/* Top Content */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <BookOpen size={14} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-slate-900 leading-tight">Recorded Classes</h3>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Learn at your own pace anytime, anywhere</p>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-blue-600 font-extrabold text-[15px] mt-2">₹500</p>
                  </div>

                </div>
              </div>

              {/* Limited Spots Banner */}
              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                <p className="text-xs text-blue-900 font-medium leading-normal">
                  Secure your spot! Seats are limited for live batches.
                </p>
              </div>

              {/* Feature/Value Badges Row moved below banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Secure Payment</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Your payment is 100% secure with us.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">24/7 Support</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">We're here to help you anytime.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Flexible Learning</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Learn at your own pace with lifetime access.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100/30">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Industry Recognized</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Certificates trusted by top companies.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SECTION: Order Summary */}
          <div className="w-full lg:w-[420px] space-y-6 shrink-0">
            <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Order summary</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <ShieldCheck size={14} className="text-green-500" />
                  Secure Checkout
                </div>
              </div>

              {/* Dynamic Enrolling In Course Card */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">You're enrolling in</p>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <img
                    src={courseImg}
                    alt={courseTitle}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-[13px] leading-tight truncate">{courseTitle}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{classType === "live" ? "Live Classes" : "Recorded Classes"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block text-[9px] font-black text-green-700 bg-green-50 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                      {classType === "live" ? "LIVE BATCH" : "SELF PACED"}
                    </span>
                    <p className="font-bold text-slate-900 text-sm">₹{totalToPay.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Base Assessment</span>
                  <span className="text-slate-900">₹{originalPriceBase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span>Scholarship applied</span>
                  <span className="text-green-600">- ₹{discount.toLocaleString()}</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Total payable now</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Inclusive of all taxes</span>
                  </div>
                  <span className="text-[32px] font-black text-blue-600 italic leading-none">
                    ₹{totalToPay.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Disclaimer and Pay Button */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-normal">
                  <Lock size={14} className="shrink-0 mt-0.5 text-slate-400" />
                  <p>
                    By proceeding, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and <a href="#" className="text-blue-600 hover:underline">Refund Policy</a>.
                  </p>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-[16px] font-bold text-[16px] shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> Confirm & Pay
                </button>
              </div>

              {/* Trust badges */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                
                {/* Instant Refund Guarantee */}
                <div className="p-4 rounded-[16px] bg-amber-50/50 border border-amber-100/50 text-center">
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-black text-[11px] uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-amber-600" />
                    Instant Refund Guarantee
                  </span>
                  <p className="text-[11px] text-amber-600/80 font-semibold mt-1">
                    100% refund if you're not satisfied within the first 10 days.
                  </p>
                </div>

                {/* Learning Impact */}
                <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Learning Impact</span>
                    <h4 className="font-bold text-slate-800 text-xs mt-0.5">Unlock your career potential</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">
                      Join 10,000+ learners who've upgraded their skills with TXhub.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default CheckoutPage;