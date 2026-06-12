import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-green-800 via-green-700 to-green-600 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                        <span className="text-xl font-bold text-white">S</span>
                    </div>
                    <span className="text-2xl font-bold text-white">Seguimiento</span>
                </Link>
            </div>

            <div className="w-full bg-white px-6 py-6 shadow-xl sm:max-w-md sm:rounded-xl">
                {children}
            </div>
        </div>
    );
}
