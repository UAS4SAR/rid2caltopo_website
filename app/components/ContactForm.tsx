type ContactFormProps = {
  defaultMessage?: string;
  defaultSubject?: string;
};

export default function ContactForm({
  defaultMessage = "",
  defaultSubject = "",
}: ContactFormProps) {
  return (
    <form className="request-form" action="/api/contact" method="post">
      <div className="form-field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          defaultValue={defaultSubject}
          maxLength={140}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          defaultValue={defaultMessage}
          maxLength={4000}
          rows={9}
          required
        />
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="form-privacy">
        Your message is emailed to the RID2Caltopo project contact only so we
        can respond. Do not include passwords, API keys, or active-incident
        details.
      </p>
      <button className="button button-primary" type="submit">
        Send message <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
