import React from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogIn, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LoginDialog } from './LoginDialog';

// Mock user state (replace with real authentication later)
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<{ name: string; phone: string } | null>(null);

  const login = (phone: string) => {
    setIsLoggedIn(true);
    setUser({ name: `User ${phone.slice(-4)}`, phone });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
};

export const UserMenu = () => {
  const { t } = useTranslation();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLoginDialog(true)}
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          {t('login')}
        </Button>
        <LoginDialog
          open={showLoginDialog}
          onOpenChange={setShowLoginDialog}
          onLogin={login}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};