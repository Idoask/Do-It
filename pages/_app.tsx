import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "../styles/globals.css";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Script src="https://accounts.google.com/gsi/client" async defer strategy="beforeInteractive" />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </SessionProvider>
  );
}

export default MyApp;
