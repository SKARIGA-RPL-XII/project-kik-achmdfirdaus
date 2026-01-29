import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { resolveUrl } from '@/lib/utils'
import { type NavItem } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage()

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item, index) => (
                    <NavItemAnimated
                        key={`${item.title}-${index}`}
                        item={item}
                        currentUrl={page.url}
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function NavItemAnimated({
    item,
    currentUrl,
}: {
    item: NavItem
    currentUrl: string
}) {
    const [open, setOpen] = useState(false)
    const Icon = item.icon

    useEffect(() => {
        if (
            item.children?.some((c) =>
                currentUrl.startsWith(resolveUrl(c.href!))
            )
        ) {
            setOpen(true)
        }
    }, [currentUrl, item.children])

    if (item.children && item.children.length > 0) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setOpen(!open)}>
                    {Icon && <Icon />}
                    <span className="flex-1">{item.title}</span>

                    <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''
                            }`}
                    />
                </SidebarMenuButton>

                <div
                    className={`
                        ml-6 overflow-hidden transition-all duration-300 ease-in-out
                        ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                >
                    <div className="mt-1 space-y-1">
                        {item.children.map((child, idx) => {
                            const ChildIcon = child.icon

                            return (
                                <SidebarMenuButton
                                    key={`${child.title}-${idx}`}
                                    asChild
                                    isActive={currentUrl.startsWith(
                                        resolveUrl(child.href!)
                                    )}
                                >
                                    <Link href={child.href!} prefetch>
                                        {ChildIcon && <ChildIcon className="mr-2 h-4 w-4" />}
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )
                        })}
                    </div>

                </div>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={
                    item.href
                        ? currentUrl.startsWith(resolveUrl(item.href))
                        : false
                }
            >
                <Link href={item.href!} prefetch>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
