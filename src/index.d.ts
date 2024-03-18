// index.d.ts
declare module "@holykzm/use-liff" {
  import { ReactNode } from "react";
  import { Liff } from "@line/liff";
  import { Profile } from "@liff/get-profile";

  interface LiffContextType {
    currentUser: Profile | null;
    liffControls: Liff | null;
    liffError: string | null;
  }

  export function useLiff(): {
    currentUser: Profile | null;
    liffControls: Liff | null;
    liffError: string | null;
  };

  export const LiffProvider: React.FC<{
    children: ReactNode;
    customError?: ReactNode;
    customLoading?: ReactNode;
  }>;

  export function useLiffContext(): LiffContextType;
}
