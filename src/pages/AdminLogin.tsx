
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Access denied. Try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className={`transition-transform ${isShaking ? 'animate-pulse' : ''}`}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Lock className="text-white" size={24} />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Input
                    type="password"
                    placeholder="admin"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Enter
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
