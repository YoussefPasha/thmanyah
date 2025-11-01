import React from 'react';
import { APP_NAME, APP_VERSION } from '@/lib/constants/app.constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-medium">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">
              Version {APP_VERSION} • © {currentYear} All rights reserved
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <a
              href="https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              iTunes API
            </a>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

