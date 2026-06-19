import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Lock,
  ChevronDown,
  CreditCard,
  Smartphone,
  Library,
  Wallet,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  CheckCircle,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

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
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Advanced Enrollment State
  const [batchDate, setBatchDate] = useState("04 May 2026");
  const [classType, setClassType] = useState("live"); // live | recorded
  const [enrollmentType, setEnrollmentType] = useState("full"); // full | slot

  // Calculate base totals from items
  const subtotalBase = items.reduce((sum, item) => {
    const priceValue = typeof item.price === "string"
      ? parseInt(item.price.replace(/[^0-9]/g, ""))
      : item.price;
    return sum + (priceValue || 0);
  }, 0);

  // Define total to pay based on enrollment type
let totalToPay = 0;
let summaryTitle = "";

const livePrice = subtotalBase > 0 ? subtotalBase : 4999;
const recordedPrice = Math.round(livePrice * 0.4); // 40% of live price

// FULL PAYMENT
if (enrollmentType === "full") {
  totalToPay = classType === "live" ? livePrice : recordedPrice;
  summaryTitle = "Full Payment";
}

// SLOT BOOKING
if (enrollmentType === "slot" && !isBalancePayment) {
  totalToPay = 500;
  summaryTitle = "Slot Booking";
}

// BALANCE PAYMENT (keep same)
if (isBalancePayment) {
  totalToPay = totalOriginal - amountPreviouslyPaid;
  summaryTitle = "Remaining Balance";
}

// NEW PRICE BASED ON CLASS TYPE
const actualPrice = classType === "live" ? livePrice : recordedPrice;

// BASE ASSESSMENT (fake original price)
const originalPriceBase = actualPrice * 4;

// DISCOUNT
const discount = originalPriceBase - actualPrice;



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

  // const handleProceed = () => {
  //    alert(`Confirming ${summaryTitle} of ₹${totalToPay}. Redirecting to payment...`);
  // };

  const handleProceed = async () => {
    try {
      const email = user?.email;

      // ✅ Validate email before API call
      // if (!email) {
      //   alert("User not logged in. Please login first ❌");
      //   navigate("/login");
      //   return;
      // }

      console.log("📧 Sending email:", email);

      const response = await fetch("http://127.0.0.1:8000/api/enroll/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,                 // ✅ sending email
          items: items,
          amount: totalToPay,
          total_fee: subtotalBase,
          enrollment_type: enrollmentType,
          batch_date: batchDate,
          payment_method: paymentMethod,
          billing_country: billingCountry,
          billing_state: billingState,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Payment Success:", data);
        alert("Enrollment & Payment initiated successfully ✅");

        // ✅ delete all cart items from DB
        await fetch(`http://127.0.0.1:8000/api/clearcart/?email=${user.email}`, {
          method: "DELETE",
        });

        // ✅ clear frontend cart
        clearCart();

        // ✅ redirect
        navigate("/student");
      } else {
        console.error("❌ Payment Failed:", data);
        alert(data.error || "Payment failed ❌");
      }
    } catch (error) {
      console.error("⚠️ Error:", error);
      alert("Something went wrong ⚠️");
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">

          {/* LEFT COLUMN - FORM */}
          <div className="w-full lg:col-span-7 space-y-8 lg:space-y-10">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Checkout</h1>
            </header>

            {/* Step 1: Course Options (Batch & Payment Plan) */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  1. Enrollment options
                </h2>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Step 1 of {isBalancePayment ? "2" : "3"}
                </span>
              </div>

              {/* Batch Date Selection */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" /> Select Batch Start Date
                </label>
                <div className="relative max-w-sm">
                  <select
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl appearance-none focus:border-blue-500 outline-none transition-colors font-bold text-slate-700 bg-slate-50/50"
                  >
                    <option>04 May 2026</option>
                    <option>20 May 2026</option>
                    <option>05 June 2026</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>





<div className="mt-6 p-6 rounded-2xl border bg-white shadow-sm space-y-5">

  {/* TOP TOGGLE */}
  <div className="flex bg-slate-100 rounded-full p-1">

    <button
      onClick={() => setClassType("live")}
      className={`flex-1 py-2 rounded-full text-sm font-bold ${
        classType === "live"
          ? "bg-blue-600 text-white"
          : "text-slate-500"
      }`}
    >
      Live Classes
    </button>

    <button
      onClick={() => setClassType("recorded")}
      className={`flex-1 py-2 rounded-full text-sm font-bold ${
        classType === "recorded"
          ? "bg-blue-600 text-white"
          : "text-slate-500"
      }`}
    >
      Recorded Classes
    </button>

  </div>

  {/* PAYMENT OPTIONS */}
  <div className="grid md:grid-cols-2 gap-4">

    {/* FULL PAYMENT */}
    <div
      onClick={() => setEnrollmentType("full")}
      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
  enrollmentType === "full"
    ? "border-blue-600 bg-blue-50 shadow-md"
    : "border-slate-200 hover:bg-slate-50"
}`}
    >
      <p className="font-bold">Full Payment</p>
      <p className="text-sm text-slate-500">Get full access</p>

      <p className="text-blue-600 font-bold mt-2">
        ₹{classType === "live" ? livePrice : recordedPrice}
      </p>
    </div>

    {/* SLOT BOOKING */}
    <div
      onClick={() => setEnrollmentType("slot")}
      className={`p-4 rounded-xl border cursor-pointer ${
        enrollmentType === "slot"
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200"
      }`}
    >
      <p className="font-bold">Book a Slot</p>
      <p className="text-sm text-slate-500">Pay later</p>

      <p className="text-blue-600 font-bold mt-2">
        ₹500
      </p>
    </div>

  </div>

</div>

              {enrollmentType === 'slot' && !isBalancePayment && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-yellow-800 font-medium leading-relaxed">
                    You are reserving a seat for the <span className="font-bold">{batchDate}</span> batch. The remaining course fee must be cleared before the batch starts.
                  </p>
                </div>
              )}

              {isBalancePayment && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-top-1 duration-300">
                  <CheckCircle2 className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    You are paying the <span className="font-bold text-blue-700">Remaining Balance</span> for your enrollment. The slot booking fee previously paid is deducted from the total.
                  </p>
                </div>
              )}
            </section>

            {/* Billing Address */}
            {/* {!isBalancePayment && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    2. Billing address
                  </h2>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100 text-center">Step 2 of 3</span>
                </div> */}

                {/* <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label> */}
                    {/* <div className="relative">
                      <select
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="w-full h-12 px-4 border-2 border-slate-200 rounded-lg appearance-none focus:border-blue-500 outline-none transition-colors font-medium"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div> */}

                  {/* <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State / Union Territory</label>
                    <div className="relative">
                      <select
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        className="w-full h-12 px-4 border-2 border-slate-200 rounded-lg appearance-none focus:border-blue-500 outline-none transition-colors font-medium"
                      >
                        <option value="">Please select...</option>
                        <option>Andhra Pradesh</option>
                        <option>Telangana</option>
                        <option>Karnataka</option>
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium italic">
                  EduWeb is required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
                </p>
              </section>
            )} */}

            {/* Payment Method */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isBalancePayment ? "2. Payment method" : "2. Payment method"}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <Lock size={10} /> Secure 128-bit
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Step {isBalancePayment ? "2 of 2" : "3 of 3"}
                  </span>
                </div>
              </div>

              <div className="border-2 border-slate-200 rounded-[2rem] overflow-hidden divide-y-2 divide-slate-100 shadow-2xl shadow-slate-200/50">
                {/* UPI Option */}
                <label className={`flex items-center gap-4 p-6 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-extrabold flex items-center gap-3 text-slate-800 uppercase tracking-wider text-sm">
                      <Smartphone size={20} className="text-blue-600" /> UPI
                    </span>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div className="p-8 bg-blue-50/20 border-t-2 border-slate-200 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-blue-50 shrink-0">
                        <Zap className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-snug">Generate dynamic QR for instant payment</p>
                        <p className="text-[12px] text-slate-500 mt-1 font-medium leading-relaxed italic">After clicking "Proceed", a unique QR code will be generated for your UPI transaction.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cards Option */}
                <label className={`flex items-center gap-4 p-6 cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-extrabold flex items-center gap-3 text-slate-800 uppercase tracking-wider text-sm">
                      <CreditCard size={20} className="text-blue-600" /> Debit / Credit Cards
                    </span>
                    <div className="flex gap-2 grayscale-0 group">
                      <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest italic group-hover:text-blue-500 transition-colors">VISA</div>
                      <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest italic group-hover:text-blue-500 transition-colors">MASTERCARD</div>
                    </div>
                  </div>
                </label>

                {/* Net Banking */}
                <label className={`flex items-center gap-4 p-6 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span className="font-extrabold flex items-center gap-3 text-slate-800 uppercase tracking-wider text-sm">
                    <Library size={20} className="text-blue-600" /> Net Banking
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="w-full lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-slate-50 shadow-[0_32px_64px_-16px_rgba(30,41,59,0.1)] rounded-2xl lg:rounded-[3rem] p-5 lg:p-10 lg:sticky lg:top-32">
              <h2 className="text-2xl font-black italic text-slate-800 mb-10 tracking-tight flex items-center justify-between">
                Order summary
                <span className="p-2 bg-slate-50 rounded-full shrink-0">
                  <CheckCircle className="text-green-500" size={24} />
                </span>
              </h2>

              {/* ENROLLMENT DETAILS (Consolidated from left) */}
              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Enrollment Details</p>
                {items.map((item, i) => (
                  <div key={i} className="group flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-blue-200 transition-all duration-300">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-blue-100/50 text-blue-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                        <BookOpen size={24} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm leading-tight truncate group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] text-blue-600 font-black uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">
                          {batchDate}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          {item.mode || "Online"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-green-600 uppercase">
  {classType === "live" ? "Live Classes" : "Recorded Classes"}
</p>
                      <p className="font-black text-blue-600 italic text-sm">₹{classType === "live" ? livePrice : recordedPrice}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-slate-500 font-bold hover:text-slate-800 transition-colors">
                  <span className="text-xs uppercase tracking-widest">Base Assessment:</span>
                  <span className="text-lg font-black italic">₹{originalPriceBase}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold hover:text-slate-800 transition-colors">
                  <span className="text-xs uppercase tracking-widest">Scholarship applied:</span>
                  <span className="text-green-500 text-lg font-black italic">-₹{discount}</span>
                </div>

                {isBalancePayment && (
                  <>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-3">
                      <div className="flex justify-between items-center text-slate-500 font-bold">
                        <span className="text-[10px] uppercase tracking-widest">Total Course Fee:</span>
                        <span className="text-base font-black italic">₹{totalOriginal}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 font-bold">
                        <span className="text-[10px] uppercase tracking-widest">Amount Paid (Slot):</span>
                        <span className="text-rose-500 text-base font-black italic">-₹{amountPreviouslyPaid}</span>
                      </div>
                      <div className="h-px bg-blue-100/50"></div>
                      <div className="flex justify-between items-center text-blue-600 font-bold">
                        <span className="text-[10px] uppercase tracking-widest">Remaining Balance:</span>
                        <span className="text-lg font-black italic">₹{totalOriginal - amountPreviouslyPaid}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="h-px bg-slate-100 my-8"></div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em]">Payment Breakdown ({summaryTitle})</p>

                  <div className="bg-slate-50/80 p-5 rounded-2xl space-y-2 border border-slate-100">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-800">Total payable now:</span>
                      <span className="text-4xl font-black text-blue-600 italic leading-none">₹{totalToPay}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Includes all taxes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-[11px] text-slate-400 text-center font-medium leading-relaxed">
                  By completing your enrollment for the <span className="font-bold text-slate-600">{batchDate} batch</span>, you agree to our <span className="text-blue-500 underline cursor-pointer font-bold">Academic Terms</span>.
                </p>

                <button
                  onClick={handleProceed}
                  className="w-full py-5 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-3xl font-black text-2xl shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                >
                  <ShieldCheck size={26} className="group-hover:animate-pulse transition-all" />
                  Confirm & Pay
                </button>

                <div className="space-y-6 pt-6">
                  {/* 30-Day Guarantee */}
                  <div className="text-center group cursor-default">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-100 mb-2">
                      <Zap size={16} className="text-yellow-500 fill-yellow-500 group-hover:scale-125 transition-all duration-300" />
                      <span className="text-xs font-black text-yellow-700 uppercase tracking-widest italic">Instant Refund Guarantee</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mt-1 group-hover:text-slate-600 transition-colors uppercase tracking-[0.1em] leading-relaxed">
                      100% Satisfaction or full refund within 30 days. No questions asked.
                    </p>
                  </div>

                  {/* Social Proof */}
                  <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-[2rem] flex items-start gap-4 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 active:scale-[0.98]">
                    <div className="p-3 bg-blue-600 rounded-2xl shrink-0 shadow-lg shadow-blue-200">
                      <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Elite Status</p>
                      <p className="text-sm font-black text-slate-800 leading-snug">
                        Unlock your career potential now
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold mt-2 leading-relaxed tracking-wide">
                        Join <span className="text-blue-600 font-black">2+ top-tier learners</span> in your region who started this week.
                      </p>
                    </div>
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