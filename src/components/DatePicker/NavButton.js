
import { jsx } from "@emotion/react";

export default function NavButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={{
        border: "1px solid #929598",
        background: "transparent",
        padding: "8px",
        fontSize: "12px"
      }}
    >
      {children}
    </button>
  );
}
