"use client"

import Link from "next/link";

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CryptoJS from 'crypto-js';
import { useRouter } from "next/navigation";
import { ENCRYPTION_KEY } from "@/lib/constants";


export function SigninForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="w-full max-w-md">
            <form onSubmit={
                async (e) => {
                    e.preventDefault();

                    const res = await fetch('https://reqres.in/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-key': 'reqres-free-v1'},
                        body: JSON.stringify({ email, password })
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        alert('Error: ' + data.error);
                        return;
                    }

                    const encryptedToken = CryptoJS.AES.encrypt(
                        data.token,
                        ENCRYPTION_KEY
                    ).toString();

                    localStorage.setItem('auth_token', encryptedToken);
                    router.push('/dashboard');
                }}>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                        <CardDescription>
                            Enter your details to sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="identifier"
                                name="identifier"
                                type="text"
                                placeholder="username or email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button className="w-full">Sign In</Button>
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Don&#39;t have an account?
                    <Link className="underline ml-2" href="signup">
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
}
