import React from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';

export default function CustomerRouteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CustomerLayout>{children}</CustomerLayout>;
}
