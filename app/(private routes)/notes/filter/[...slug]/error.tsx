
"use client"
export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Try again</button>
    </div>
  );
}