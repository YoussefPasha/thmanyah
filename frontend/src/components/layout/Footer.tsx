import React from 'react';
import Link from 'next/link';
import { Music, Github, ExternalLink } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '@/lib/constants/app.constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <Link href="/" className="mb-3 flex items-center space-x-2">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>
            <p className="mb-2 text-sm text-muted-foreground">
              Discover and explore thousands of podcasts from the iTunes library.
            </p>
            <p className="text-xs text-muted-foreground">
              Version {APP_VERSION}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground transition-colors hover:text-primary">
                  Search Podcasts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  iTunes Search API
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Github className="h-3 w-3" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-muted-foreground">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

