import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController'
import { send } from '@/routes/verification'
import { type BreadcrumbItem, type SharedData } from '@/types'
import { Transition } from '@headlessui/react'
import { Form, Head, Link, usePage } from '@inertiajs/react'

import DeleteUser from '@/components/delete-user'
import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { edit } from '@/routes/profile'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
]

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean
    status?: string
}) {
    const { auth } = usePage<SharedData>().props

    const karyawan = auth.user.karyawan

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-10">
                    <div className="space-y-6">
                        <HeadingSmall
                            title="Informasi Karyawan"
                            description="Data ini dikelola oleh HR dan tidak dapat diubah"
                        />

                        <div className="grid md:grid-cols-3 gap-4">

                            <div className="grid gap-2">
                                <Label>NIP</Label>
                                <Input
                                    value={karyawan?.nip ?? '-'}
                                    readOnly
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Divisi</Label>
                                <Input
                                    value={karyawan?.divisi?.nama ?? '-'}
                                    readOnly
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Jabatan</Label>
                                <Input
                                    value={karyawan?.jabatan?.nama ?? '-'}
                                    readOnly
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>

                        </div>
                    </div>

                    <div className="space-y-6 border-t pt-8">
                        <HeadingSmall
                            title="Informasi Profil"
                            description="Perbaiki nama dan email anda di sini"
                        />

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>

                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={auth.user.name}
                                            required
                                            autoComplete="name"
                                        />

                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            defaultValue={auth.user.email}
                                            required
                                            autoComplete="username"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at === null && (
                                            <div className="text-sm text-muted-foreground">
                                                Email belum diverifikasi.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="underline text-primary"
                                                >
                                                    Kirim ulang verifikasi
                                                </Link>

                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-2 text-green-600 font-medium">
                                                        Link verifikasi telah dikirim
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>
                                            Simpan
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition-opacity"
                                            enterFrom="opacity-0"
                                            leave="transition-opacity"
                                            leaveTo="opacity-0"
                                        >
                                            <span className="text-sm text-green-600">
                                                Tersimpan
                                            </span>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>


                    <DeleteUser />

                </div>
            </SettingsLayout>
        </AppLayout>
    )
}
