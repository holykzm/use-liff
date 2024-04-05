declare module "@holykzm/use-liff" {
  import { ReactNode, ComponentType } from "react";
  import { Liff } from "@line/liff";
  import { Profile } from "@liff/get-profile";

  interface LiffContextType {
    currentUser: Profile | null;
    liffControls: Liff | null;
    liffError: string | null;
  }

  // useLiff の型定義を修正して、liffId と ifWebMoveTo を引数として受け取る
  export function useLiff(
    liffId: string,
    ifWebMoveTo?: string
  ): {
    currentUser: Profile | null;
    liffControls: Liff | null;
    liffError: string | null;
  };

  // LiffProvider の型定義を修正して、ifWebMoveTo を含める
  export const LiffProvider: React.FC<{
    children: ReactNode;
    customError?: ComponentType<{ error: string }>; // customErrorをComponentTypeに修正して、型安全性を向上
    customLoading?: ReactNode;
    liffId: string; // liffId をプロパティとして追加
    ifWebMoveTo?: string; // ifWebMoveTo をプロパティとして追加
  }>;

  export function useLiffContext(): LiffContextType;
}
