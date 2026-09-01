import Link from "next/link";

/**
 * Un numero solo, con il suo contesto. Per una manciata di valori di testa
 * questa e' la forma giusta: un grafico a barre con quattro colonne direbbe
 * meno e occuperebbe di piu'.
 */
export function StatTile({
  etichetta,
  valore,
  nota,
  delta,
  tono = "neutro",
  href,
}: {
  etichetta: string;
  valore: number | string;
  nota?: string;
  delta?: number | null;
  tono?: "neutro" | "buono" | "allarme";
  href?: string;
}) {
  const corpo = (
    <>
      <div className="tile-etichetta">{etichetta}</div>
      <div className="tile-valore">{valore}</div>
      <div className="tile-piede">
        {typeof delta === "number" && delta !== 0 && (
          <span className={`tile-delta ${delta > 0 ? "su" : "giu"}`}>
            {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
        {nota && <span className="tile-nota">{nota}</span>}
      </div>
    </>
  );

  const cls = `tile tono-${tono}${href ? " cliccabile" : ""}`;
  return href ? (
    <Link href={href} className={cls}>{corpo}</Link>
  ) : (
    <div className={cls}>{corpo}</div>
  );
}
