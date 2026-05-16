import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, PlusCircle, Wallet, LogOut, User as UserIcon, LayoutDashboard, BookOpen, ShoppingBag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface NavigationProps {
  user: User;
}

export const Navigation = ({ user }: NavigationProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="TokMarket" className="w-8 h-8" />
            <span className="text-xl font-bold text-gradient">TokMarket</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Home" onClick={() => navigate("/")}>
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Shop" onClick={() => navigate("/shop")}>
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Courses" onClick={() => navigate("/courses")}>
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Create product" onClick={() => navigate("/create")}>
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Wallet" onClick={() => navigate("/wallet")}>
              <Wallet className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account menu" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.user_metadata?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.user_metadata?.display_name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">@{user?.user_metadata?.username || user?.email?.split('@')[0]}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/manage-courses")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wallet")}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
