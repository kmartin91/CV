import { contact } from '../data/content';
import SecHead from './SecHead';

export default function Contact() {
  return (
    <section className="contact wrap" id="contact">
      <SecHead label="Contact" num="05" />
      <a className="cta magnetic" href={`mailto:${contact.email}`}>Let's talk<span className="at">.</span></a>
      <div className="row">
        <div className="links">
          {contact.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="magnetic">{l.label}</a>
          ))}
        </div>
        <span className="avail"><span className="dot"></span>{contact.availability}</span>
      </div>
    </section>
  );
}
