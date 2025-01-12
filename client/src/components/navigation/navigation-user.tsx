import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import defaultAvatar from "@/assets/default-avatar.jpg";
import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";
import { createUsername } from "@/lib/utils";
import { useLogout } from "@/service/mutation";
import { useNavigate } from "react-router-dom";

export function NavigationUser({ userId }: { userId: string }) {
  const logout = useLogout();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { data, error, isLoading } = useGetUser(userId!);
  const user: TUser = !isLoading ? data.data : null;

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  const handleLogout = () => {
    logout.mutate();
    navigate("/");
  };

  console.log("data: ", data);
  console.log("userId: ", userId);
  console.log("user: ", user);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarImage
                  src={
                    user?.profilePicUrl ? user?.profilePicUrl : defaultAvatar
                  }
                  alt={createUsername({
                    firstname: user?.firstName || "",
                    middlename: user?.middleName || "",
                    lastname: user?.lastName || "",
                  })}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">
                  {createUsername({
                    firstname: user?.firstName || "",
                    middlename: user?.middleName || "",
                    lastname: user?.lastName || "",
                  })}
                </span>
                <span className="text-xs truncate">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarImage
                    src={
                      user?.profilePicUrl ? user?.profilePicUrl : defaultAvatar
                    }
                    alt={createUsername({
                      firstname: user?.firstName || "",
                      middlename: user?.middleName || "",
                      lastname: user?.lastName || "",
                    })}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">
                    {createUsername({
                      firstname: user?.firstName || "",
                      middlename: user?.middleName || "",
                      lastname: user?.lastName || "",
                    })}
                  </span>
                  <span className="text-xs truncate">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
