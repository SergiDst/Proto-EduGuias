"use client";


export interface ResourceCardProps {
  id: number;
  icon: React.ReactElement;
  iconBg: string;
  meta: string;
  title: string;
  description: string;
  action: "download" | "link";
  actionLabel: string;
  href?: string;
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OpenExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  return (
    <div className="bg-white rounded-2xl border border-edu-light p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top row: icon + meta */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-11 h-11 ${resource.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          {resource.icon}
        </div>
        <span className="font-lexend font-normal text-xs text-edu-muted mt-1">{resource.meta}</span>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-lexend font-bold text-base text-edu-dark">
          {resource.title}
        </h3>
        <p className="font-lexend font-normal text-sm text-edu-muted leading-snug">
          {resource.description}
        </p>
      </div>

      {/* Action button */}
      {resource.href ? (
        <a
          href={resource.href}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-edu-light bg-edu-bg font-lexend font-semibold text-sm text-edu-muted hover:border-brand/30 hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {resource.action === "download" ? <DownloadIcon /> : <OpenExternalIcon />}
          {resource.actionLabel}
        </a>
      ) : (
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-edu-light bg-edu-bg font-lexend font-semibold text-sm text-edu-muted hover:border-brand/30 hover:text-brand transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          {resource.action === "download" ? <DownloadIcon /> : <OpenExternalIcon />}
          {resource.actionLabel}
        </button>
      )}
    </div>
  );
}
