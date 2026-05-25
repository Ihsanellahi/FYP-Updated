import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(formData.email, formData.password);

        if (success) {
            navigate('/staff/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-600 to-indigo-700">
            <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 overflow-hidden shadow-sm">
                        <img src="/grand-hotel-logo.png" alt="Grand Hotel Logo" className="h-12 w-12 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Grand Hotel</h1>
                    <p className="text-blue-100">Staff Management Portal</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Staff Login</CardTitle>
                        <p className="text-gray-600 text-sm">Enter your credentials to access the dashboard</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs font-semibold text-blue-900 mb-1">Demo Credentials:</p>
                                <p className="text-xs text-blue-800">Admin: admin@grandhotel.com / admin123</p>
                                <p className="text-xs text-blue-800">Staff: alice@grandhotel.com / staff123</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <a href="/" className="text-white hover:text-blue-100 text-sm">
                        ← Back to Customer Portal
                    </a>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
}
