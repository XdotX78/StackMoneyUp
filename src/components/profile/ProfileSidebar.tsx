'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LayoutDashboard, Settings } from 'lucide-react';

interface Props {
    lang: string;
}

const menu = [
    { label: 'Profile', path: 'profile', icon: User },
    { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
    { label: 'Settings', path: 'settings', icon: Settings },
];

export default function ProfileSidebar({ lang }: Props) {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#111] border-r border-gray-800 p-6">
            <div className="text-gray-300 font-semibold text-lg mb-6">My Account</div>
            {menu.map(item => {
                const isActive = pathname === `/${lang}/dashboard/${item.path}`;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.path}
                        href={`/${lang}/dashboard/${item.path}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md
              ${isActive ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                );
            })}
        </aside>
    );
}
