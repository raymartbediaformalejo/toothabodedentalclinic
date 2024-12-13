import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import React from "react";

const NavigationTopDashboard = () => {
  const location = useLocation();

  // Parse current path into breadcrumb segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4 mr-2" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1;
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const title =
                decodeURIComponent(segment) === "dashboardadmin"
                  ? "dashboard"
                  : decodeURIComponent(segment) === "add_new_dentist"
                  ? "Add New Dentist"
                  : decodeURIComponent(segment) === "add_new_service"
                  ? "Add New Service"
                  : segment;

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbItem>
                    {!isLast ? (
                      <BreadcrumbLink href={href}>
                        <span className="uppercase">{title[0]}</span>
                        {title.slice(1)}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>
                        <span className="uppercase">{title[0]}</span>
                        {title.slice(1)}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default NavigationTopDashboard;
