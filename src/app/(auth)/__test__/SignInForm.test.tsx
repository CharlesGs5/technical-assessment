import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SigninForm } from '@/components/forms/signin-form';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@/lib/constants';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('SigninForm', () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('inicia sesión exitosamente', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'test-token' }),
        });

        render(<SigninForm />);

        fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
            target: { value: 'test@correo.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: '123456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            const encrypted = localStorage.getItem('auth_token');
            expect(encrypted).toBeTruthy();

            const decrypted = CryptoJS.AES.decrypt(encrypted!, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            expect(decrypted).toBe('test-token');

            expect(pushMock).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('muestra un error si la API falla', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Invalid credentials' }),
        } as Response);

        window.alert = jest.fn();

        render(<SigninForm />);

        fireEvent.change(screen.getByPlaceholderText(/username or email/i), {
            target: { value: 'bad@correo.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: 'wrongpass' },
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error: Invalid credentials');
        });
    });

    it('no envía si los campos están vacíos', async () => {
        render(<SigninForm />);

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });
});
