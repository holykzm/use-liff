
'use client'
import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import type { Liff } from '@line/liff';
import type { Profile } from "@liff/get-profile";

interface LiffContextType {
    currentUser: Profile | null;
    liffControls: Liff | null;
    liffError: string | null;
}

const LiffContext = createContext<LiffContextType>({
    currentUser: null,
    liffControls: null,
    liffError: null,
});

export const useLiff = () => {
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [liffControls, setLiffControls] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);

    useEffect(() => {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
            console.error('LIFF ID is undefined. Please set NEXT_PUBLIC_LIFF_ID in your environment.');
            return;
        }

        import('@line/liff')
            .then((liff) => liff.default)
            .then((liff) => {
                liff
                    .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
                    .then(() => {
                        setLiffControls(liff);
                        if (liff.isLoggedIn()) {
                            liff.getProfile().then((profile) => setCurrentUser(profile));
                        } else {
                            liff.login(); // You might want to handle login in your UI.
                        }
                    })
                    .catch((error: Error) => {
                        setLiffError(error.toString());
                    });
            });
    }, []);

    return { currentUser, liffControls, liffError };
};

export const LiffProvider: React.FC<{ children: ReactNode; customError?: ReactNode; customLoading?: ReactNode }> = ({ children, customError, customLoading }) => {
    const liff = useLiff();

    const errorComponent = customError || <div>Error: {liff.liffError}</div>;
    const loadingComponent = customLoading || <div>Loading...</div>;

    return (
        <LiffContext.Provider value={liff}>
            {liff.liffError ? errorComponent : liff.currentUser ? children : loadingComponent}
        </LiffContext.Provider>
    );
};

export const useLiffContext = () => useContext(LiffContext);
