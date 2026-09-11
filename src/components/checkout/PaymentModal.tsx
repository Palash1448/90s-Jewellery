import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Smartphone, CreditCard, Building2, AlertCircle } from 'lucide-react';
import type { Order } from '../../types';

interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailure: (reason: string) => void;
}

type PaymentTab = 'upi' | 'card' | 'netbanking';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('upi');
  const [upiApp, setUpiApp] = useState<string>('gpay');
  const [upiId, setUpiId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');

  if (!isOpen) return null;

  const handleTriggerPayment = (simulateSuccess = true) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      if (simulateSuccess) {
        onPaymentSuccess(transactionId);
      } else {
        onPaymentFailure('Payment cancelled by user or bank server declined.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        {/* Header with Amount */}
        <div className="bg-[#1E1A17] text-white p-5 flex items-center justify-between border-b border-[#3B332C]">
          <div>
            <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block">
              SECURE CHECKOUT GATEWAY
            </span>
            <h3 className="font-display font-bold text-xl text-[#FAF8F5]">
              ₹{order.total.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#A89E92] block">Order Number</span>
            <span className="text-xs font-mono font-bold text-[#E8E2D8]">{order.orderNumber}</span>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="flex border-b border-[#E8E2D8] bg-[#F5EFE6] text-xs font-semibold text-[#574C3F]">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'upi' ? 'bg-[#FAF8F5] text-[#1E1A17] border-b-2 border-[#BA9541]' : 'hover:text-black'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI Apps</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'card' ? 'bg-[#FAF8F5] text-[#1E1A17] border-b-2 border-[#BA9541]' : 'hover:text-black'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'netbanking' ? 'bg-[#FAF8F5] text-[#1E1A17] border-b-2 border-[#BA9541]' : 'hover:text-black'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B5F50]">Select preferred UPI app or enter UPI ID:</p>
              
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'gpay', name: 'Google Pay', icon: '🔵' },
                  { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                  { id: 'paytm', name: 'Paytm UPI', icon: '🔷' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setUpiApp(app.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                      upiApp === app.id
                        ? 'border-[#BA9541] bg-[#FAF3E0] text-[#1E1A17] shadow-sm'
                        : 'border-[#E0D7C7] bg-white text-[#574C3F]'
                    }`}
                  >
                    <span className="text-xl">{app.icon}</span>
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#473E35] uppercase mb-1">
                  Or enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or name@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D9CFBE] rounded-xl focus:border-[#BA9541] focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#473E35] uppercase mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D9CFBE] rounded-xl font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#473E35] uppercase mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D9CFBE] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#473E35] uppercase mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D9CFBE] rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <p className="text-xs text-[#6B5F50]">Select your bank for secure netbanking:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                  <button
                    key={b}
                    className="p-2.5 text-left rounded-lg border border-[#E0D7C7] bg-white hover:bg-[#FAF3E0] font-medium text-[#2E261E]"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verification Actions */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => handleTriggerPayment(true)}
              disabled={isProcessing}
              id="payment-modal-pay-success-btn"
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm sm:text-base text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Transaction with Bank...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>PAY ₹{order.total.toLocaleString('en-IN')} (Success Simulation)</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleTriggerPayment(false)}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Simulate Payment Decline / Failure Flow</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#786D60] pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Server-side verification active. Encrypted & PCI-DSS compliant.</span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-sm p-1 rounded-md"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
