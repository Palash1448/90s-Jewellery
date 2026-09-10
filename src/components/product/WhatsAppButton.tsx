import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Product } from '../../types';
import { getProductWhatsAppLink } from '../../services/whatsappService';

interface WhatsAppButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  product,
  className = '',
  size = 'md',
}) => {
  const [waLink, setWaLink] = useState<string>('#');

  useEffect(() => {
    getProductWhatsAppLink(product).then(setWaLink);
  }, [product]);

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs gap-1.5',
    md: 'py-3 px-5 text-sm gap-2',
    lg: 'py-3.5 px-6 text-base gap-2.5',
  }[size];

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-semibold rounded-xl text-white bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] transition-all shadow-md hover:shadow-lg ${sizeClasses} ${className}`}
    >
      <MessageCircle className="w-5 h-5 fill-current shrink-0" />
      <span>ORDER ON WHATSAPP</span>
    </a>
  );
};
