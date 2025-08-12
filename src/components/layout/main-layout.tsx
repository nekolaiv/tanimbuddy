import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-lg">TanimBuddy</div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/" className={cn("hover:underline")}>Dashboard</Link>
          <Link href="/messages" className={cn("hover:underline")}>Messages</Link>
          <Link href="/alerts" className={cn("hover:underline")}>Alerts</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b flex items-center px-4">
          <h1 className="text-xl font-semibold">Welcome, Farmer</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}