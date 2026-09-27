/* Docs pages are prerendered, so this is only ever seen on a slow navigation
   between them. It holds the article column's shape rather than spinning, so
   the layout does not jump when the content resolves. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-(--nextra-content-width) px-4 py-10 md:px-12">
      <span className="sr-only" role="status">
        Loading documentation
      </span>
      <div aria-hidden className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-muted" />
        <div className="mt-6 h-10 w-2/3 rounded-md bg-muted" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full rounded-full bg-muted" />
          <div className="h-4 w-11/12 rounded-full bg-muted" />
          <div className="h-4 w-4/5 rounded-full bg-muted" />
        </div>
        <div className="mt-10 h-40 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}
