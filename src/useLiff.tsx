"use client";
import {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
  ComponentType,
} from "react";
import type { Liff } from "@line/liff";
import type { Profile } from "@liff/get-profile";

interface LiffContextType {
  currentUser: Profile | null;
  liffControls: Liff | null;
  liffError: string | null;
  // ifWebMoveToをコンテキストに含める必要はないため、削除
}

const LiffContext = createContext<LiffContextType>({
  currentUser: null,
  liffControls: null,
  liffError: null,
});

export const useLiff = (liffId: string, ifWebMoveTo: string | null = null) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [liffControls, setLiffControls] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    if (!liffId) {
      console.error(
        "LIFF ID is undefined. Please set it in your LiffProvider."
      );
      return;
    }

    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        if (liff.getLineVersion() === null && ifWebMoveTo) {
          window.location.href = ifWebMoveTo;
          return;
        }

        liff
          .init({ liffId })
          .then(() => {
            setLiffControls(liff);
            if (liff.isLoggedIn()) {
              liff.getProfile().then((profile) => setCurrentUser(profile));
            } else {
              liff.login();
            }
          })
          .catch((error: Error) => {
            setLiffError(error.toString());
          });
      });
  }, [liffId, ifWebMoveTo]);

  return { currentUser, liffControls, liffError };
};

interface LiffProviderProps {
  children: ReactNode;
  customError?: ComponentType<{ error: string }>; // customErrorをComponentTypeに修正して、型安全性を向上
  customLoading?: ReactNode;
  liffId: string;
  ifWebMoveTo?: string; // ifWebMoveTo をpropsとして追加
}

export const LiffProvider: React.FC<LiffProviderProps> = ({
  children,
  customError: CustomError,
  customLoading,
  liffId,
  ifWebMoveTo,
}) => {
  const { currentUser, liffControls, liffError } = useLiff(liffId, ifWebMoveTo); // ifWebMoveTo を useLiff に渡す

  const errorComponent =
    liffError && CustomError ? <CustomError error={liffError} /> : null;
  const loadingComponent = customLoading || <div>Loading...</div>;

  return (
    <LiffContext.Provider value={{ currentUser, liffControls, liffError }}>
      {errorComponent
        ? errorComponent
        : currentUser
        ? children
        : loadingComponent}
    </LiffContext.Provider>
  );
};

export const useLiffContext = () => useContext(LiffContext);
