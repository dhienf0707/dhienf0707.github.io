import GlobalStyles from "@/styles/GlobalStyles";
import StyledComponentsRegistry from "@/styles/StyledComponentsRegistry";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Jerry's Portfolio",
  description: "Jerry's Portfolio Website",
  manifest: "/manifest.json",
  icons: {
    icon: "/cat-lover.png",
    apple: "/cat-lover-114.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StyledComponentsRegistry>
            <GlobalStyles />
            <Header />
            {children}
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
