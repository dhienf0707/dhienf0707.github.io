"use client";

import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import NavigationProgress from "@/components/NavigationProgress";
import RoutePrefetcher from "@/components/RoutePrefetcher";

export default function Providers({ children }) {
  return (
    <Auth0Provider>
      <MantineProvider defaultColorScheme="light">
        <RoutePrefetcher />
        <NavigationProgress />
        {children}
      </MantineProvider>
    </Auth0Provider>
  );
}
