import { Inter } from 'next/font/google'
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';


const inter = Inter({
  variable: '--font-inter',
  // weight: '400',
    // style: 'italic',
    subsets: ['latin']
})

export const metadata = {
  title: "X-Ray Image Managment",
  description: "Image managment system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-gray-200`}
      >
        <AntdRegistry>
        {children}
        </AntdRegistry>
        
      </body>
    </html>
  );
}
