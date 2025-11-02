import React from 'react';
import Link from 'next/link';
import { Music, Github, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} بودكاست iTunes. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

