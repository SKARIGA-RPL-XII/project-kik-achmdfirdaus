import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout'
import { type BreadcrumbItem } from '@/types'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

interface AppLayoutProps {
    children: ReactNode
    breadcrumbs?: BreadcrumbItem[]
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { url } = usePage()

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div
                key={url}
                className="animate-in fade-in zoom-in-95 duration-300"
            >
                {children}
            </div>
        </AppLayoutTemplate>
    )
}
