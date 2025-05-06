"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from "@/lib/constants";
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
import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    max-width: 28rem;
`;

const SignInText = styled.div`
    margin-top: 1rem;
    text-align: center;
    font-size: 0.875rem;

    a {
        text-decoration: underline;
        margin-left: 0.5rem;
    }
`;

export function SignupForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Wrapper>
            <form onSubmit={
                async (e) => {
                    e.preventDefault();

                    await new Promise(res => setTimeout(res, Math.random() * 1000 + 500));

                    try {
                        const res = await fetch('https://reqres.in/api/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-api-key': 'reqres-free-v1' },
                            body: JSON.stringify({ email, password }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                            alert(`Error: ${data.error}`);
                            return;
                        }

                        const encryptedToken = CryptoJS.AES.encrypt(
                            data.token,
                            ENCRYPTION_KEY
                        ).toString();

                        localStorage.setItem('auth_token', encryptedToken);
                        router.push('/dashboard');
                    } catch (error) {
                        alert('Error de red o servidor');
                        console.error(error);
                    }
                }
            }>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your details to create a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
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
                        </div>
                    </CardContent>
                    <CardFooter style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button style={{ width: '100%' }}>Sign Up</Button>
                    </CardFooter>
                </Card>
                <SignInText>
                    Have an account?
                    <Link href="signin">Sign In</Link>
                </SignInText>
            </form>
        </Wrapper>
    );
}
