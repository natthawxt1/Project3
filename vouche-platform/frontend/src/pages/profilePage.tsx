import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, Edit2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully!');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Manage your account information
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Card - Profile */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <Card className="border-0 shadow-xl bg-white">
                            <CardContent className="p-8 text-center">
                                {/* Avatar */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="mb-6"
                                >
                                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </motion.div>

                                {/* Name */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{user.name}</h2>

                                {/* Role Badge */}
                                <Badge
                                    className={`${user.role === 'admin'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                        } text-white border-0 px-4 py-1.5 mb-6 rounded-full`}
                                >
                                    <Shield className="h-3 w-3 mr-1.5 inline" />
                                    {user.role === 'admin' ? 'Administrator' : 'Customer'}
                                </Badge>

                                {/* Logout Button */}
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full rounded-full border-2 hover:bg-red-50 hover:border-red-500 hover:text-red-600 h-12 font-semibold"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Card - Account Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-xl bg-white">
                            <CardContent className="p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900">Account Information</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold"
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </div>

                                {/* Info Grid */}
                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50"
                                    >
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md flex-shrink-0">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-0.5 font-medium">Full Name</p>
                                            <p className="text-lg font-bold text-gray-900">{user.name}</p>
                                        </div>
                                    </motion.div>

                                    {/* Email */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50"
                                    >
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md flex-shrink-0">
                                            <Mail className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-0.5 font-medium">Email Address</p>
                                            <p className="text-lg font-bold text-gray-900">{user.email}</p>
                                        </div>
                                    </motion.div>

                                    {/* User ID */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50"
                                    >
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-md flex-shrink-0">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-0.5 font-medium">User ID</p>
                                            <p className="text-lg font-bold text-gray-900 font-mono">
                                                {String(user.user_id).padStart(6, '0')}
                                            </p>
                                        </div>
                                    </motion.div>



                                    {/* Account Type */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50"
                                    >
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-md flex-shrink-0">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 mb-0.5 font-medium">Account Type</p>
                                            <p className="text-lg font-bold text-gray-900 capitalize">
                                                {user.role === 'admin' ? 'Admin' : user.role}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-8 pt-6 border-t">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button
                                            onClick={() => navigate('/orders')}
                                            className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 font-semibold text-white"
                                        >
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            My Orders
                                        </Button>
                                        {user.role === 'admin' && (
                                            <Button
                                                onClick={() => navigate('/admin')}
                                                className="h-12 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-semibold text-white"
                                            >
                                                <Shield className="mr-2 h-4 w-4" />
                                                Admin Dashboard
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
