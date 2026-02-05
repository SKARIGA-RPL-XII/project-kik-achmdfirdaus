import AppBreadcrumb from '@/components/app-breadchumb'
import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/app-shell'
import RoleSidebar from '@/components/role-sidebar'
import { type BreadcrumbItem } from '@/types'
import { type PropsWithChildren } from 'react'



export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    return (
        <AppShell variant="sidebar">

            <div className="flex h-screen overflow-hidden w-full">

                <RoleSidebar />

                <AppContent
                    variant="sidebar"
                    className="flex-1 flex flex-col overflow-hidden w-full"
                >

                    <div className="h-16 bg-white border-b flex items-center px-6 shadow-sm">
                        <AppBreadcrumb items={breadcrumbs} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 w-full bg-gray-50">
                        {children}
                    </div>

                </AppContent>
            </div>
        </AppShell>
    )


}
