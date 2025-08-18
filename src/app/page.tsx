import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main
      className={"relative flex h-screen flex-col items-center justify-center"}
    >
      <h1 className={"font-medium text-7xl tracking-tighter"}>FleetLink</h1>
      <p className={"my-6 text-center text-base"}>
        Logistics vehicle booking system
      </p>
      <ThemeToggle />
    </main>
  );
}
