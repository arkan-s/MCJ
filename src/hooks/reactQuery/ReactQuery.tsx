
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

const ReactQueryProvider: React.FC<{ children: React.ReactNode, dehydratedState: any }> = ({ children, dehydratedState }) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                {children}
            </HydrationBoundary>
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
