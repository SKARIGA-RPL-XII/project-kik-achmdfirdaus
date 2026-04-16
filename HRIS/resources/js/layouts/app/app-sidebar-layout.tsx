import AppBreadcrumb from '@/components/app-breadchumb'
import { AppContent } from '@/components/app-content'
import { AppShell } from '@/components/app-shell'
import RoleSidebar from '@/components/role-sidebar'
import { type BreadcrumbItem } from '@/types'
import { type PropsWithChildren, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <AppShell variant="sidebar">

            <div className="flex h-screen overflow-hidden w-full">

                <RoleSidebar />

                <AppContent
                    variant="sidebar"
                    className="flex-1 flex flex-col overflow-hidden w-full"
                >

                    <div className="h-16 bg-white border-b flex items-center px-4 md:px-6 shadow-sm gap-4 shrink-0">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger className="md:hidden p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors">
                                <Menu className="w-5 h-5 text-gray-700" />
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-none bg-transparent">
                                <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                                <RoleSidebar isMobile={true} />
                            </SheetContent>
                        </Sheet>

                        <AppBreadcrumb items={breadcrumbs} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full bg-gray-50">
                        {children}
                    </div>

                </AppContent>
            </div>
        </AppShell>
    )

}
