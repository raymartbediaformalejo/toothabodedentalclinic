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

import defaultAvatar from "@/assets/default-avatar.jpg";
import { useGetUser } from "@/service/queries";
import { TUser } from "@/types/types";
import { createUsername } from "@/lib/utils";
import { useLogout } from "@/service/mutation";
import { Link, useNavigate } from "react-router-dom";

export function NavigationPatientAccount({ userId }: { userId: string }) {
  const logout = useLogout();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetUser(userId!);
  const user: TUser = !isLoading ? data.data : null;

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  const handleLogout = () => {
    logout.mutate();
    navigate("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1">
          <Avatar className="w-8 h-8 rounded-lg">
            <AvatarImage
              src={user?.profilePicUrl ? user?.profilePicUrl : defaultAvatar}
              alt={createUsername({
                firstname: user?.firstName || "",
                middlename: user?.middleName || "",
                lastname: user?.lastName || "",
              })}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid ml-2 flex-1 text-sm leading-tight text-left">
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
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="w-8 h-8 rounded-lg">
              <AvatarImage
                src={user?.profilePicUrl ? user?.profilePicUrl : defaultAvatar}
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
          <DropdownMenuItem asChild>
            <Link to="/my-appointment">
              <BadgeCheck />
              My Appointments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account">
              <BadgeCheck />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
