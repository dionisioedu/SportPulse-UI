import React from "react";

export default function PulseHeader({ subtitle }) {
  return (
    <div className="pulseTop">
      <div>
        <div className="pulseLabel">Agora pulsando</div>
        <div className="pulseStrong">{subtitle}</div>
      </div>

      <svg className="ecg" viewBox="0 0 220 28" aria-hidden="true">
        <path d="M0 14 L35 14 L48 14 L58 6 L70 24 L82 14 L105 14 L118 14 L128 10 L140 14 L220 14" />
      </svg>
    </div>
  );
}
