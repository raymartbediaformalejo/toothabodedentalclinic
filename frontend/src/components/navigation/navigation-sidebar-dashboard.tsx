import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo-with-bg.png";
import { cn } from "@/lib/utils";
import { RxDashboard as DashboardIcon } from "react-icons/rx";
import {
  LuCalendarClock as CallendarIcon,
  LuMessageSquare as MessageIcon,
} from "react-icons/lu";
import { RiServiceLine as ServiceIcon } from "react-icons/ri";
import { TbDental as DentistsIcon } from "react-icons/tb";
import { HiOutlineUserGroup as PatientsIcon } from "react-icons/hi2";
import { CgWebsite as CMSIcon } from "react-icons/cg";
import { PiUsersThree as UsersIcon } from "react-icons/pi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { NavigationUser } from "./navigation-user";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboardadmin",
    icon: DashboardIcon,
  },
  {
    title: "CMS",
    url: "#",
    icon: CMSIcon,
    items: [
      {
        title: "FAQ's",
        url: "#",
      },
      {
        title: "Special Offers",
        url: "#",
      },
      {
        title: "Testimonials",
        url: "#",
      },
      {
        title: "Contact Page",
        url: "#",
      },
      {
        title: "Articles",
        url: "#",
      },
      {
        title: "Penalty Fee",
        url: "#",
      },
    ],
  },
  {
    title: "Dentists",
    url: "/dashboardadmin/dentists",
    icon: DentistsIcon,
  },
  {
    title: "Patients",
    url: "#",
    icon: PatientsIcon,
  },
  {
    title: "Services",
    url: "/dashboardadmin/service",
    icon: ServiceIcon,
  },
  {
    title: "Callendar",
    url: "#",
    icon: CallendarIcon,
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageIcon,
  },
  {
    title: "Users",
    url: "#",
    icon: UsersIcon,
  },
];

export function NavigationSidebarDashboard() {
  const { userId } = useAuth();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="shadow-sidebar-shadow">
      <SidebarHeader>
        <div className={cn("flex ", open ? "gap-2" : "gap-0  justify-center")}>
          <img
            className={cn(` ${open ? "h-[60px]" : "w-[44px]"}`)}
            src={logo}
            alt="Tooth Abode Dental Clinic logo"
          />
          {open && (
            <div className="whitespace-nowrap flex justify-center flex-col font-bold text-primary-700 leading-[15px]">
              <span>Tooth Abode</span> <span>Dental Clinic</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  className={cn(item.items?.length && "relative")}
                >
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} size="lg">
                      <Link to={item.url}>
                        <item.icon className="w-10 h-6" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="translate-y-[50%] data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="CollapsibleContent">
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton size="lg">
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {" "}
        <NavigationUser userId={userId} />
      </SidebarFooter>
    </Sidebar>
  );
}
