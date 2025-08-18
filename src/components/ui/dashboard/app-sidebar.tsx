"use client";

import Link from "next/link";
import { RouteConfig } from "@/config/route";
import { ScrollArea } from "@/primitives/scrollarea";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/primitives/sidebar";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background">
        <div className="flex items-center justify-center bg-background py-3">
          <h2 className="font-black text-lg">FL</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel>Sections</SidebarGroupLabel>
            <SidebarMenu>
              {RouteConfig.map((item) => (
                <SidebarMenuItem key={item?.title}>
                  <Link href={item?.url || "#"}>
                    <SidebarMenuButton
                      tooltip={item?.title}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {item?.icon && <item.icon />}
                      <span>{item?.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
