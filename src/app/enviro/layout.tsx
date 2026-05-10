import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AP Environmental Science Visual Exam Atlas",
  description:
    "Master every APES topic visually. Interactive diagrams, cycles, graphs, cause-effect maps, FRQ training, and night-before cram tools — aligned to the official AP Environmental Science CED.",
  keywords: [
    "AP Environmental Science",
    "APES review",
    "APES study guide",
    "AP exam review",
    "environmental science diagrams",
    "APES cycles",
    "APES FRQ",
    "AP Environmental Science CED",
  ],
  openGraph: {
    title: "APES Visual Exam Atlas",
    description:
      "Visual-first AP Environmental Science review. Every unit, every cycle, every graph — all in one atlas.",
    type: "website",
  },
};

export default function EnviroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-site-header], [data-site-footer],
            [data-site-header] *, [data-site-footer] *,
            [data-site-header] > *, [data-site-footer] > * { display: none !important; }
            #main-content { padding: 0 !important; }
            .flex.min-h-svh.flex-col > main { flex: 1; display: flex; flex-direction: column; }
            .enviro-atlas-root { position: relative; z-index: 1; }
          `,
        }}
      />
      <div className="enviro-atlas-root min-h-screen bg-background text-foreground">
        {children}
      </div>
    </>
  );
}
