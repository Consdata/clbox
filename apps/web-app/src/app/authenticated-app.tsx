import React from 'react';
import {AppRouting} from './app-routing';
import {LayoutBody} from './features/layout/layout-body';
import {LayoutHeader} from './features/layout/layout-header';
import {Navbar} from './features/navbar/navbar';
import {ScrollToTop} from './features/scroll-to-top/scroll-to-top';

export const AuthenticatedApp = () => <>
    <ScrollToTop/>
    <LayoutHeader>
        <Navbar/>
    </LayoutHeader>
    <LayoutBody>
        <AppRouting/>
    </LayoutBody>
</>;
