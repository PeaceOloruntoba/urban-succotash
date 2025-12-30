export default function Spinner({ size = 20 }: { size?: number }) {
  const s = size;
  const stroke = Math.max(2, Math.floor(size / 10));
  return (
    <svg
      role="status"
      aria-live="polite"
      width={s}
      height={s}
      viewBox="0 0 50 50"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
      />
      <path
        d="M25 5 a20 20 0 0 1 0 40"
        fill="none"
        stroke="#2563eb"
        strokeWidth={stroke}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
