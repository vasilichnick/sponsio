/** Asset glyphs with the Base chain badge — pure inline SVG, no deps.
 *  ETH diamond / USDC disc, each carrying a small Base-blue chain dot
 *  (bottom-right), the standard multichain-wallet convention. */
export function AssetIcon({
  asset,
  size = 18,
}: {
  asset: "eth" | "usdc";
  size?: number;
}) {
  const badge = Math.max(8, Math.round(size * 0.5));
  return (
    <span
      className="relative inline-block shrink-0 align-middle"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {asset === "eth" ? (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <circle cx="12" cy="12" r="12" fill="#27272a" />
          <path d="M12 3.5v6.3l5.3 2.4z" fill="#e4e4e7" />
          <path d="M12 3.5L6.7 12.2l5.3-2.4z" fill="#fafafa" />
          <path d="M12 16.2v4.3l5.3-7.4z" fill="#e4e4e7" />
          <path d="M12 20.5v-4.3l-5.3-3.1z" fill="#fafafa" />
          <path d="M12 15.1l5.3-2.9L12 9.8z" fill="#a1a1aa" />
          <path d="M6.7 12.2l5.3 2.9V9.8z" fill="#d4d4d8" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <circle cx="12" cy="12" r="12" fill="#2775CA" />
          <text
            x="12"
            y="16.6"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#fff"
            fontFamily="ui-sans-serif, system-ui"
          >
            $
          </text>
        </svg>
      )}
      <span
        className="absolute -right-0.5 -bottom-0.5 rounded-full ring-2 ring-zinc-950"
        style={{ width: badge, height: badge, background: "#0052FF" }}
        title="Base"
      />
    </span>
  );
}
