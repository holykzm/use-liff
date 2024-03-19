'use client'
import { useState, useEffect, ReactNode, createContext, useContext, ComponentType } from 'react';
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

// useLiff フックを修正して liffId を引数として受け取る
export const useLiff = (liffId: string) => {
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [liffControls, setLiffControls] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);

    useEffect(() => {
        if (!liffId) {
            console.error('LIFF ID is undefined. Please set it in your LiffProvider.');
            return;
        }

        import('@line/liff')
            .then((liff) => liff.default)
            .then((liff) => {
                liff
                    .init({ liffId })
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
    }, [liffId]);

    return { currentUser, liffControls, liffError };
};

interface LiffProviderProps {
    children: ReactNode;
    customError?: ComponentType<{ error: string }>;
    customLoading?: ReactNode;
    liffId: string; // liffId をpropsとして追加
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children, customError: CustomError, customLoading, liffId }) => {
    const { currentUser, liffControls, liffError } = useLiff(liffId); // liffId を useLiff に渡す

    const errorComponent = liffError && CustomError ? <CustomError error={liffError} /> : null;
    const loadingComponent = customLoading || <div>Loading...</div>;

    return (
        <LiffContext.Provider value={{ currentUser, liffControls, liffError }}>
            {errorComponent ? errorComponent : currentUser ? children : loadingComponent}
        </LiffContext.Provider>
    );
};

export const useLiffContext = () => useContext(LiffContext);
