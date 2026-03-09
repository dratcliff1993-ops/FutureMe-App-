'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IncomeTax() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with a small delay to allow page load
    setTimeout(() => {
      window.location.href = '/#how-im-taxed';
    }, 100);
  }, []);

  return null;
}
