import PropTypes from "prop-types";
import BankLogo from "./BankLogo";

/**
 * ServerLoader
 * Full-screen branded loading overlay shown while the app is initialising.
 * Fades out once `visible` becomes false.
 */
const ServerLoader = ({ visible }) => {
  return (
    <div
      aria-live="polite"
      aria-label="Loading Channel Horizon Bank"
      className={[
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center",
        "bg-gradient-to-br from-[#100257] via-[#1a0370] to-[#0f0009]",
        "transition-opacity duration-700 ease-in-out",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {/* Logo */}
      <div className="mb-8 animate-pulse">
        <BankLogo size={88} />
      </div>

      {/* Bank name */}
      <h1 className="text-white text-xl font-bold tracking-widest mb-1 select-none">
        CHANNEL HORIZON BANK
      </h1>
      <p className="text-purple-300 text-xs tracking-[0.2em] mb-10 select-none uppercase">
        Personal · Business · Corporate
      </p>

      {/* Animated progress bar */}
      <div className="w-48 h-1 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#BA0D76] to-white animate-[shimmer_1.4s_ease-in-out_infinite]" />
      </div>

      <p className="mt-5 text-purple-300/70 text-[11px] tracking-widest select-none">
        Loading…
      </p>
    </div>
  );
};

ServerLoader.propTypes = {
  /** When true the overlay is fully visible; false fades it out. */
  visible: PropTypes.bool.isRequired,
};

export default ServerLoader;
