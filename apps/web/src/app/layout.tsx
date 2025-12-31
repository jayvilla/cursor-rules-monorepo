import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-roboto',
  preload: true,
});

export const metadata = {
  title: {
    template: '%s | AuditLog',
    default: 'AuditLog',
  },
  description: 'Audit log and activity tracking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
