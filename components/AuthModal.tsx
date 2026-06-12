"use client";

import { useState } from "react";
import { X, Hammer, Mail, Lock, CheckCircle, User } from "lucide-react";
import { useAuth } from "./AuthContext";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const { login } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, isLogin ? undefined : name);
        onClose();
        // Reset
        setEmail("");
        setName("");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-charcoal p-8 pb-16 text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6 ring-1 ring-gold/30">
                            <Hammer className="w-8 h-8 text-gold" />
                        </div>
                        <h2 className="text-3xl font-light text-white mb-2">
                            {isLogin ? "Welcome Back" : "Partner With Us"}
                        </h2>
                        <p className="text-white/60">
                            {isLogin ? "Access your project dashboard" : "Start your construction journey"}
                        </p>
                    </div>

                    <div className="absolute inset-0 bg-gold/5 blur-3xl"></div>
                </div>

                <div className="p-8 -mt-8 relative z-20 bg-white rounded-t-3xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                                <span>I agree to the Terms of Service</span>
                            </div>
                        )}

                        <button type="submit" className="w-full bg-gold text-charcoal font-bold py-4 rounded-lg hover:bg-[#c5a028] transition-colors uppercase tracking-widest text-sm shadow-lg shadow-gold/20">
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        {isLogin ? "New to Atlas Build?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-gold hover:text-[#b39023] font-bold transition-colors"
                        >
                            {isLogin ? "Register Now" : "Login Here"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
