import {Banknote, BookPlus, CircleDollarSign, Home, HotelIcon, LayoutDashboard, Users } from 'lucide-react'

export const linkData = [
    {
        category: "pages",
        links: [
                {
                    path: '/',
                    text: 'Dashboard',
                    icon: <LayoutDashboard className='w-4 h-4' />
                },
                {
                    path: '/members',
                    text: 'Members',
                    icon: <Users className='w-4 h-4' />
                },
                {
                    path: '/departments',
                    text: 'Department',
                    icon: <Home className='w-4 h-4' />
                },
                {
                    path: '/courses',
                    text: 'Courses',
                    icon: <BookPlus className='w-4 h-4' />
                },
                {
                    path: '/hostels',
                    text: 'Hostels',
                    icon: <HotelIcon className='w-4 h-4' />
                },
            ],
    },
    {
        category: "revenue",
        links: [
                {
                    path: '/income',
                    text: 'Income',
                    icon: <Banknote className='w-4 h-4' />
                },
                {
                    path: '/expenses',
                    text: 'Expenditure',
                    icon: <CircleDollarSign className='w-4 h-4' />
                },
            ],
    }
    
]