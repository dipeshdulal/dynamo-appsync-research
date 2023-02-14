import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../css/globals.css"


export const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default App;