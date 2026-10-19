// Text split into spans on the server, so the animation has something to
// grab at hydration. Screen readers get the plain text, not the letters.

export function Chars({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={`split ${className}`}>
      <span className="visually-hidden">{text}</span>
      {words.map((w, wi) => (
        <span key={`${w}-${wi}`}>
          {w.split(/(?<=-)/).map((part, pi) => (
            <span key={`${part}-${pi}`}>
              {pi > 0 ? <wbr /> : null}
              <span className="word" aria-hidden="true">
                {[...part].map((ch, i) => <span className="char" key={`${ch}-${i}`}>{ch}</span>)}
              </span>
            </span>
          ))}
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

export function Words({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span className="w" key={`${w}-${i}`}>{w}{i < words.length - 1 ? ' ' : ''}</span>
      ))}
    </>
  );
}
