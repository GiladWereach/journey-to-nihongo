
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Book, GraduationCap, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressHeaderProps {
  user: any;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ user }) => {
  const { toast } = useToast();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-montserrat font-bold text-indigo tracking-tight">
              Nihongo Journey
            </span>
          </Link>
          
          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 bg-indigo/10 text-indigo font-medium"
              asChild
            >
              <Link to="/kana-learning">
                <Book size={16} />
                Kana
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Kanji learning module is under development",
                });
              }}
            >
              <GraduationCap size={16} />
              Kanji
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Grammar module is under development",
                });
              }}
            >
              <Bookmark size={16} />
              Grammar
            </Button>
          </div>

          {user ? (
            <Link to="/dashboard">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
