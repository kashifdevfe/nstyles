'use client';

import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import client from '../lib/apolloClient';
import AuthLoader from '../components/AuthLoader';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
            </head>
            <body>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <AuthLoader>
                            {children}
                        </AuthLoader>
                    </ApolloProvider>
                </Provider>
            </body>
        </html>
    );
}
