import Link from 'next/link';
import { GithubIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with 💙 by{' '}
            <Link
              href="https://github.com/cbitosc"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              CBIT Open Source Community
            </Link>
          </p>
        </div>
        <div className="flex items-center">
          <Link
            href="https://github.com/cbitosc/qr-certificate-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <GithubIcon className="h-5 w-5" />
            <span className="text-sm">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}