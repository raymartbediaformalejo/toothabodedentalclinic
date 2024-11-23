import { LuAlignJustify } from "react-icons/lu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";

const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <LuAlignJustify className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle title="Sidebar navigation for Tooth Abode Dental Clinic" />
        <SheetDescription title="Sidebar navigation for Tooth Abode Dental Clinic" />
        <NavigationSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
