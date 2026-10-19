import { useContent } from '../data/content';

export default function Contact() {
  const { contact, ui } = useContent();
  return (
    <section className="contact" id="contact" data-shape="at" data-shape-x="2.6" data-shape-y="0.2" data-shape-y-mobile="1.6">
      <p className="label">{ui.contact}</p>
      <h2 className="contact-title">
        {contact.title.map((line) => (
          <span className="reveal-wrap" key={line}><span className="reveal">{line}</span></span>
        ))}
      </h2>
      <p className="contact-text fade-up">{contact.text}</p>
      <a className="contact-mail magnetic" href={`mailto:${contact.email}`} data-cursor={ui.cursor.write}>
        <span className="scramble">{contact.email}</span>
      </a>
      <ul className="contact-links">
        {contact.links.map((l) => (
          <li key={l.href}>
            <a href={l.href} target="_blank" rel="noopener"><span className="scramble">{l.label}</span> ↗</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
