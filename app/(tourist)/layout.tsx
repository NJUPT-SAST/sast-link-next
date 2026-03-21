import { BackLayout } from "@/components/layout/back-layout";

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackLayout />
      <main className="flex min-h-screen flex-col items-center">{children}</main>
    </>
  );
}
