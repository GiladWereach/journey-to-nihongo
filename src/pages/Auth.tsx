
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import JapaneseCharacter from '@/components/ui/JapaneseCharacter';
import TraditionalBackground from '@/components/ui/TraditionalAtmosphere';
import { TraditionalCard } from '@/components/ui/TraditionalAtmosphere';
import { signupAttempted, loginAttempted, authPageViewed, useAuth, useNavigate, useLocation, preventDefault } from '@/lib/analytics-generated';
import { authPageViewed, loginAttempted, signupAttempted } from '@/lib/analytics-generated';

// Track signup_attempted
signupAttempted();
// Track login_attempted
loginAttempted();
// Track auth_page_viewed
authPageViewed();
// Track signup_attempted
signupAttempted();
// Track login_attempted
loginAttempted();
// Track auth_page_viewed
authPageViewed();
const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set active tab from location state if present
  useEffect(() => {
    const state = location.state as any;
    if (state?.tab === 'register') {
      setActiveTab('register');
    }
  }, [location]);
  
  // If user is already logged in, redirect to the appropriate page
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      // Navigation happens in the useEffect above
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      setActiveTab('login');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TraditionalBackground>
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <Link to="/" className="absolute top-8 left-8 flex items-center text-wood-light hover:text-lantern-warm transition-colors font-traditional">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Home
        </Link>
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex space-x-2 mb-4">
            {['学', '習'].map((char, index) => (
              <JapaneseCharacter 
                key={index}
                character={char}
                size="md"
                color="text-wood-light"
                animated={false}
              />
            ))}
          </div>
          <h1 className="text-3xl font-traditional font-bold text-paper-warm mb-2 tracking-wide">Welcome to Nihongo Journey</h1>
          <p className="text-wood-light/80 mb-8 text-center max-w-md font-traditional">Join our community and start your Japanese learning adventure today.</p>
        </div>
        
        <TraditionalCard className="w-full max-w-md">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-wood-grain border border-wood-light/30">
              <TabsTrigger 
                value="login" 
                className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="font-traditional data-[state=active]:bg-wood-light data-[state=active]:text-gion-night"
              >
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-wood-light font-traditional">Sign In</CardTitle>
                  <CardDescription className="text-paper-warm/70 font-traditional">Enter your email and password to access your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-wood-light font-traditional">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-wood-grain border-wood-light/40 text-wood-light placeholder:text-paper-warm/60 focus:border-wood-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-wood-light font-traditional">Password</Label>
                      <Link to="/reset-password" className="text-sm text-lantern-warm hover:text-lantern-glow font-traditional hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-wood-grain border-wood-light/40 text-wood-light placeholder:text-paper-warm/60 focus:border-wood-light"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-wood-light text-gion-night hover:bg-wood-medium font-traditional border-2 border-wood-light/40" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center font-traditional">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle className="text-wood-light font-traditional">Create an Account</CardTitle>
                  <CardDescription className="text-paper-warm/70 font-traditional">Enter your details to create your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-wood-light font-traditional">Full Name</Label>
                    <Input 
                      id="fullName" 
                      placeholder="John Doe" 
                      required 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-wood-grain border-wood-light/40 text-wood-light placeholder:text-paper-warm/60 focus:border-wood-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-wood-light font-traditional">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-wood-grain border-wood-light/40 text-wood-light placeholder:text-paper-warm/60 focus:border-wood-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-wood-light font-traditional">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-wood-grain border-wood-light/40 text-wood-light placeholder:text-paper-warm/60 focus:border-wood-light"
                    />
                    <p className="text-xs text-paper-warm/60 font-traditional">Password must be at least 6 characters long</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-wood-light text-gion-night hover:bg-wood-medium font-traditional border-2 border-wood-light/40" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center font-traditional">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </TraditionalCard>
        
        <p className="mt-8 text-sm text-paper-warm/60 font-traditional">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-lantern-warm hover:text-lantern-glow hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-lantern-warm hover:text-lantern-glow hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </TraditionalBackground>
  );
};

export default Auth;
