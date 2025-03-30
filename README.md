# use-liff

This is a custom hook for LINE Front-end Framework (LIFF) to simplify the usage of LIFF in your React applications.  
これは、LINE Front-end Framework (LIFF) の使用を簡素化するためのカスタムフックです。

## Installation / インストール

```bash
npm install @holykzm/use-liff
```

## Usage / 使い方

### Import the LiffProvider / LiffProvider のインポート

First, import the `LiffProvider` from `@holykzm/use-liff` into your application.  
まず、アプリケーションに `@holykzm/use-liff` から `LiffProvider` をインポートします。

```javascript
import { LiffProvider } from "@holykzm/use-liff";
```

### Set up the LIFF Provider / LIFF プロバイダーの設定

Wrap your application with the `LiffProvider` component. Make sure to set up the environment variable `NEXT_PUBLIC_LIFF_ID`.  
アプリケーションを `LiffProvider` コンポーネントでラップします。環境変数 `NEXT_PUBLIC_LIFF_ID` を設定することを忘れないでください。

```javascript
// app/liff/layout.tsx
import { LiffProvider } from "@holykzm/use-liff";

const AppLayout: React.FC = ({ children }) => {
  return <LiffProvider liffId="必須">{children}</LiffProvider>;
};

export default AppLayout;
```

### Custom Error and Loading Screens / カスタムエラーとロード画面

You can customize the error and loading screens by passing custom components to the `LiffProvider`.  
`LiffProvider` にカスタムコンポーネントを渡すことで、エラー画面やロード画面をカスタマイズすることができます。

```tsx
// app/liff/layout.tsx
"use client"; // 必須！
import { LiffProvider } from "@holykzm/use-liff";
import CustomError from "./_parts/CustomError";
import { CustomLoading } from "./_parts/CustomLoading";

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider
      liffId={String(process.env.NEXT_PUBLIC_LIFF_ID)}
      customError={CustomError}
      customLoading={<CustomLoading />}
      ifWebMoveTo="https://~WEBブラウザで開いた時にリダイレクトできます。"
    >
      {children}
    </LiffProvider>
  );
}
```

```tsx
// app/liff/components/CustomError.tsx

interface CustomErrorProps {
  error: string;
}

const CustomError: React.FC<CustomErrorProps> = ({ error }) => {
  return <div className="custom-error">Error: {error}</div>;
};

export default CustomError;
```

### Mock Mode / モックモード

You can use the mock mode for development without connecting to the LINE platform. This is useful for testing your application locally. Mock mode can be enabled in two ways: using environment variables or by passing a prop to the `LiffProvider`.  
開発時にLINEプラットフォームに接続せずにモックモードを使用できます。これはローカルでアプリケーションをテストする際に便利です。モックモードは、環境変数を使用するか、`LiffProvider`にプロパティを渡すことで有効化できます。

**Using environment variables:**  
**環境変数を使用:**

```
# .env.local
NEXT_PUBLIC_LIFF_MOCK=true
```

**Using props:**  
**プロパティを使用:**

```tsx
<LiffProvider
  liffId={String(process.env.NEXT_PUBLIC_LIFF_ID)}
  mock={true}
>
  {children}
</LiffProvider>
```

When in mock mode:  
モックモード時には:

- The LIFF SDK methods are mocked and don't make actual API calls  
  LIFF SDKのメソッドはモック化され、実際のAPI呼び出しを行いません
- User profile is set to dummy data with profile picture as `/favicon.ico`  
  ユーザープロフィールはダミーデータに設定され、プロフィール画像は `/favicon.ico` になります
- Methods like `sendMessages` and `shareTargetPicker` will display alerts instead of sending actual messages  
  `sendMessages`や`shareTargetPicker`などのメソッドは、実際のメッセージを送信せずにアラートを表示します
- An additional `isMock` property is available through `useLiffContext()` to check if the app is running in mock mode  
  アプリがモックモードで実行されているかどうかを確認するために、`useLiffContext()`を通じて追加の`isMock`プロパティが利用可能です

```tsx
const { currentUser, liffControls, isMock } = useLiffContext();
console.log("Mock mode enabled:", isMock);
```

### Accessing LIFF Functionality in Components / コンポーネントでの LIFF 機能へのアクセス

You can access the LIFF functionality in your components by using the `useLiffContext` hook.  
`useLiffContext` フックを使用して、コンポーネント内で LIFF 機能にアクセスすることができます。

```javascript
// app/components/Profile.tsx
import React from "react";
import { useLiffContext } from "@holykzm/use-liff";

const Profile: React.FC = () => {
  const { currentUser, liffControls } = useLiffContext();

  // Accessing user profile
  const profileName = currentUser?.displayName || "Unknown";

  // Accessing LIFF functionality
  const sendMessage = () => {
    if (liffControls) {
      liffControls.sendMessages([{ type: "text", text: "Hello, world!" }]);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {profileName}</p>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default Profile;
```

## License / ライセンス

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.  
このプロジェクトは MIT ライセンスのもとで公開されています。詳細については [LICENSE](./LICENSE) ファイルを参照してください。

## Contribution / 貢献

Bug reports and feature suggestions are welcome via Issues. Pull requests are also welcome. If you'd like to improve the code, fork the project, make your changes, and submit a pull request.  
バグの報告や機能の提案は Issue から歓迎します。プルリクエストも歓迎します。コードを改善したい場合は、プロジェクトをフォークして変更を加え、プルリクエストを送信してください。

## Author / 作者

[Kazuma Horiike](https://github.com/holykzm)

## Support / サポート

For questions or suggestions, please create an Issue.  
質問や提案がある場合は Issue を作成してください。
