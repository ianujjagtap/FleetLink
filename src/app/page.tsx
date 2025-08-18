"use client";
import { AppSidebar } from "@/components/ui/dashboard/app-sidebar";
import { Separator } from "@/primitives/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/primitives/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-[50] flex h-16 items-center gap-2 border-b-[0.2px] backdrop-blur-3xl ">
          <div className="flex w-full items-center justify-between px-8">
            <div className="relative flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <h1 className="font-extralight font-sans text-secondary-foreground/60">
              FleetLink - Logistics Vehicle Booking System
            </h1>
            <div className="flex items-center justify-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
