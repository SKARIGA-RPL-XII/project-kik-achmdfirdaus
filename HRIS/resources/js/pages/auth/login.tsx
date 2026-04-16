import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
}

export default function Login({
    status,
}: LoginProps) {
    return (
        <>
            <Head title="Log in" />
            <div
                style={{ backgroundImage: "url('/images/red_bg.png')" }}
                className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative flex flex-col justify-center"
            >
                {/* Background overlay untuk memperhalus kontras */}
                <div className="absolute inset-0 bg-black/30 z-0"></div>

                {/* Top left text */}
                <div className="absolute top-8 left-8 md:top-12 md:left-16 lg:left-24 text-white/90 font-medium tracking-wide z-10 text-sm md:text-base">
                    Human Resource Information System © 2026 All rights reserved.
                </div>

                {/* Form container */}
                <div className="mx-6 sm:mx-10 md:mx-16 lg:mx-24 w-full max-w-[420px] z-10">
                    <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 flex flex-col w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">LOGIN</h1>
                            <p className="text-sm text-gray-400">Please enter your detail</p>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="font-semibold text-gray-800 text-sm">
                                                Username <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="off"
                                                placeholder="Masukkan Username"
                                                className="bg-gray-100 border-transparent placeholder:text-gray-400 py-6 px-4 rounded-md focus-visible:ring-red-700 focus-visible:border-transparent text-gray-900"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password" className="font-semibold text-gray-800 text-sm">
                                                Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Masukkan Password"
                                                className="bg-gray-100 border-transparent placeholder:text-gray-400 py-6 px-4 rounded-md focus-visible:ring-red-700 focus-visible:border-transparent text-gray-900"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center justify-start mt-2">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="border-gray-300 data-[state=checked]:bg-red-700 data-[state=checked]:border-red-700 rounded-sm"
                                                />
                                                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500">
                                                    Ingat Saya
                                                </Label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-4 w-full bg-red-800 hover:bg-red-900 text-white py-6 rounded-md font-bold text-[15px] transition-colors"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner className="mr-2" />}
                                            Masuk
                                        </Button>
                                    </div>

                                    {status && (
                                        <div className="text-center text-sm font-medium text-green-600">
                                            {status}
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
