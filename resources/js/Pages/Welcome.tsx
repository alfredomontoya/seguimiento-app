import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
export default function Welcome({ auth }: PageProps) {
    return (
        <>
            {' '}
            <Head title="Inicio" />{' '}
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-800 via-green-700 to-green-600">
                {' '}
                {/* Header */}{' '}
                <header className="flex items-center justify-between px-6 py-4 lg:px-12">
                    {' '}
                    <div className="flex items-center gap-3">
                        {' '}
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            {' '}
                            <span className="text-lg font-bold text-white">S</span>{' '}
                        </div>{' '}
                        <span className="text-xl font-bold text-white">Seguimiento</span>{' '}
                    </div>{' '}
                    <div className="flex items-center gap-3">
                        {' '}
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-800 shadow-sm transition hover:bg-green-50"
                            >
                                {' '}
                                Dashboard{' '}
                            </Link>
                        ) : (
                            <>
                                {' '}
                                <Link
                                    href={route('login')}
                                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-800 shadow-sm transition hover:bg-green-50"
                                >
                                    {' '}
                                    Iniciar sesión{' '}
                                </Link>{' '}
                                <Link
                                    href={route('register')}
                                    className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    {' '}
                                    Registrarse{' '}
                                </Link>{' '}
                            </>
                        )}{' '}
                    </div>{' '}
                </header>{' '}
                {/* Hero */}{' '}
                <main className="flex flex-1 items-center justify-center px-6">
                    {' '}
                    <div className="max-w-2xl text-center">
                        {' '}
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            {' '}
                            Sistema de Seguimiento{' '}
                        </h1>{' '}
                        <p className="mt-4 text-lg text-green-100 sm:text-xl">
                            {' '}
                            Digitaliza y automatiza el control de solicitudes y trámites de tu institución{' '}
                        </p>{' '}
                        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            {' '}
                            <div className="flex items-center gap-2 text-green-100">
                                {' '}
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {' '}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />{' '}
                                </svg>{' '}
                                <span>Recepción de trámites</span>{' '}
                            </div>{' '}
                            <div className="flex items-center gap-2 text-green-100">
                                {' '}
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {' '}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                    />{' '}
                                </svg>{' '}
                                <span>Asignación a profesionales</span>{' '}
                            </div>{' '}
                            <div className="flex items-center gap-2 text-green-100">
                                {' '}
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {' '}
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />{' '}
                                </svg>{' '}
                                <span>Derivación entre áreas</span>{' '}
                            </div>{' '}
                        </div>{' '}
                    </div>{' '}
                </main>{' '}
                {/* Footer */}{' '}
                <footer className="px-6 py-4 text-center text-sm text-green-200">
                    {' '}
                    &copy; {new Date().getFullYear()} Sistema de Seguimiento. Todos los derechos reservados.{' '}
                </footer>{' '}
            </div>{' '}
        </>
    );
}
