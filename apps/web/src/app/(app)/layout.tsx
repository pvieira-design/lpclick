import Header from "@/components/header";
import Providers from "@/components/providers";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="grid grid-rows-[auto_1fr] h-svh">
        <Header />
        {children}
      </div>
    </Providers>
  );
}
