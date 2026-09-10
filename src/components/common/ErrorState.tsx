import React from 'react';
import { AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue loading this information. Please try again or reach out to our WhatsApp support.',
  onRetry,
  showHomeLink = true,
}) => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-[#FAF8F5] p-8 rounded-2xl border border-rose-200/80 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#1E1A17] mb-2">{title}</h2>
        <p className="text-sm text-[#73685C] mb-6 leading-relaxed">{message}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E1A17] hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}

          {showHomeLink && (
            <Link
              to="/"
              className="w-full sm:w-auto bg-gold-gradient text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-95"
            >
              Explore Collection
            </Link>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[#E8E2D8]">
          <a
            href="https://wa.me/919876543210?text=Hi,%20I%20need%20help%20with%20an%20issue%20on%20the%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Need Help? Chat with Us on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
