/** Ruhiger Aurora-Grund. Rein dekorativ, keine Interaktion. */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="aurora-layer drift-slow absolute inset-0 opacity-70" />
      <div className="aurora-layer drift-slower absolute inset-0 opacity-50" />
      <div className="absolute inset-0 bg-background/30" />
    </div>
  );
}
