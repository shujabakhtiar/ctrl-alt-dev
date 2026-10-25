export default function FormatComparison() {
  const formats = [
    {
      format: 'WebP (OptiPress)',
      compression: 'Lossy & Lossless',
      avgSize: '~45 KB',
      transparency: 'Full Alpha',
      animation: 'Supported',
      support: '97.5% All Browsers',
      verdict: 'Recommended Default',
      badgeClass: 'badge-best'
    },
    {
      format: 'PNG',
      compression: 'Lossless Only',
      avgSize: '~380 KB (8x larger)',
      transparency: 'Full Alpha',
      animation: 'APNG (limited)',
      support: '100%',
      verdict: 'Legacy / Bulky',
      badgeClass: 'badge-warn'
    },
    {
      format: 'JPEG / JPG',
      compression: 'Lossy Only',
      avgSize: '~190 KB (4x larger)',
      transparency: 'No Support',
      animation: 'No Support',
      support: '100%',
      verdict: 'Decent for Photos',
      badgeClass: 'badge-neutral'
    },
    {
      format: 'AVIF',
      compression: 'Modern AV1',
      avgSize: '~38 KB',
      transparency: 'Full Alpha',
      animation: 'Supported',
      support: '93% (Slower encode)',
      verdict: 'Emerging',
      badgeClass: 'badge-neutral'
    }
  ];

  return (
    <section className="benchmarks-section" id="benchmarks">
      <div className="section-header">
        <div className="widget-chip">
          <span className="chip-icon">📊</span>
          <span>Web Performance Analysis</span>
        </div>
        <h2 className="widget-title">
          Why Modern Developers <span className="gradient-text">Choose WebP</span>
        </h2>
        <p className="widget-subtitle">
          Comparing real-world asset footprints. Reducing asset weight improves Largest Contentful Paint (LCP) and user retention.
        </p>
      </div>

      <div className="benchmarks-table-wrap">
        <table className="benchmarks-table">
          <thead>
            <tr>
              <th>Format</th>
              <th>Compression Type</th>
              <th>Typical Size (1080p Asset)</th>
              <th>Alpha Transparency</th>
              <th>Browser Coverage</th>
              <th>Production Status</th>
            </tr>
          </thead>
          <tbody>
            {formats.map((row) => (
              <tr key={row.format} className={row.badgeClass === 'badge-best' ? 'highlight-row' : ''}>
                <td className="format-name-cell">
                  <span className="format-dot"></span>
                  <strong>{row.format}</strong>
                </td>
                <td>{row.compression}</td>
                <td className="size-metric">
                  <code>{row.avgSize}</code>
                </td>
                <td>{row.transparency}</td>
                <td>{row.support}</td>
                <td>
                  <span className={`table-badge ${row.badgeClass}`}>
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="performance-callout">
        <div className="callout-icon">🚀</div>
        <div className="callout-body">
          <h4>Google Lighthouse & Core Web Vitals Impact</h4>
          <p>
            Google search ranking directly penalizes slow hero images. Serving WebP assets eliminates Lighthouse
            <em> "Serve images in next-gen formats"</em> warnings, saving up to 500ms of LCP render delay on mobile networks.
          </p>
        </div>
      </div>
    </section>
  );
}
