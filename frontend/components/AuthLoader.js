'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadFromStorage } from '../store/authSlice';

export default function AuthLoader({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    return children;
}
