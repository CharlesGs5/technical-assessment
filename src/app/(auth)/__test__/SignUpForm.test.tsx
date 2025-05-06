import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignupForm } from '@/components/forms/signup-form';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@/lib/constants';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('SignupForm', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        localStorage.clear();
    });

    it('renders the form inputs', () => {
        render(<SignupForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('submits the form and stores encrypted token', async () => {
        const mockToken = 'test-token';
        const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ token: mockToken }),
        } as Response);

        render(<SignupForm />);
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByText(/sign up/i));

        await waitFor(() => {
            const encrypted = localStorage.getItem('auth_token');
            expect(encrypted).toBeTruthy();
            const decrypted = CryptoJS.AES.decrypt(encrypted!, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            expect(decrypted).toBe(mockToken);
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
            expect(mockFetch).toHaveBeenCalledWith(
                'https://reqres.in/api/register',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        'x-api-key': 'reqres-free-v1',
                    }),
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: '123456',
                    }),
                })
            );
        });
    });

});
