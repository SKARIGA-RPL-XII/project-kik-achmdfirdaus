import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import AdminDashboard from '@/components/dashboard/admin'
import UserDashboard from '@/components/dashboard/user'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'App', href: '/app' },
]

export default function Dashboard(props: any) {

    const { auth }: any = usePage().props
    const role = auth?.user?.role ?? 'user'

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {
                role === 'admin'
                    ? <AdminDashboard {...props} />
                    : <UserDashboard {...props} />
            }

        </AppLayout>
    )
}
