import { Link } from '@inertiajs/react'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
    title: string
    href?: string
}

type Props = {
    items: BreadcrumbItem[]
}

export default function AppBreadcrumb({ items }: Props) {
    return (
        <div className="flex items-center text-sm text-gray-500 gap-2">

            {items.map((item, i) => {
                const last = i === items.length - 1

                return (
                    <div key={i} className="flex items-center gap-2">

                        {item.href && !last ? (
                            <Link
                                href={item.href}
                                className="hover:text-[#B50B08] font-medium transition"
                            >
                                {item.title}
                            </Link>
                        ) : (
                            <span className="text-gray-800 font-semibold">
                                {item.title}
                            </span>
                        )}

                        {!last && <ChevronRight size={14} />}
                    </div>
                )
            })}
        </div>
    )
}
