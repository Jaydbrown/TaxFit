import React from 'react';
import Header from './Header';
import Footer from './Footer';
// 🎯 FIX 1: Import standard HTML attributes for type safety
import type { HTMLAttributes } from 'react'; 

// 🎯 FIX 2: Extend HTMLAttributes<HTMLDivElement> to automatically include className, style, etc.
interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  // NOTE: className is now implicitly included via the extension
}

// 🎯 FIX 3: Destructure className from props and apply it to the root div.
export default function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = '', // Add a default value for className
  ...rest // Capture any other extra HTML attributes
}: LayoutProps) {
  
  // Combine the fixed styles with the dynamically passed className
  const rootClasses = `min-h-screen flex flex-col ${className}`; 
  
  return (
    // 🎯 FIX 4: Apply the combined classes and pass through remaining HTML props
    <div className={rootClasses} {...rest}>
      {showHeader && <Header />}
      {/* If the user passed h-full or other height attributes in className, they will affect the root div. */}
      {/* We apply flex-1 to main to allow it to fill the remaining space. */}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}