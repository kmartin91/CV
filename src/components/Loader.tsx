export default function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-grain" aria-hidden="true"></div>
      <div className="loader-inner">
        <p className="loader-kick">
          <span className="lk">Portfolio</span> <span className="lk">· 2026</span>
        </p>
        <h2 className="loader-name">
          <span className="lrow"><span className="lw">I'm</span></span>
          <span className="lrow"><span className="lw">Kevin</span></span>
          <span className="lrow"><span className="lw">Martin<span className="lk-dot">.</span></span></span>
        </h2>
      </div>
      <div className="loader-count"><span className="lc-num">00</span><span className="lc-pct">%</span></div>
      <div className="loader-bar" aria-hidden="true"><span className="loader-bar-fill"></span></div>
    </div>
  );
}
