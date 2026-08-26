import {
  managedAccessTermsText,
  managedAccessTermsVersion,
} from "../managedAccessTerms";
import { CalTopoText } from "./CalTopoTeamsLink";

type RequestFormProps = {
  kind: "early-access" | "managed-pilot";
};

export default function RequestForm({ kind }: RequestFormProps) {
  const managed = kind === "managed-pilot";

  return (
    <form className="request-form" action="/api/request" method="post">
      <input type="hidden" name="requestType" value={kind} />
      {managed && (
        <input type="hidden" name="termsVersion" value={managedAccessTermsVersion} />
      )}
      <div className="form-field">
        <label htmlFor={`${kind}-name`}>Your name</label>
        <input
          id={`${kind}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor={`${kind}-email`}>Email address</label>
        <input
          id={`${kind}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
      </div>
      {managed && (
        <div className="form-field">
          <label htmlFor={`${kind}-phone`}>
            Phone number <span>Optional</span>
          </label>
          <input
            id={`${kind}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={64}
          />
        </div>
      )}
      <div className="form-field">
        <label htmlFor={`${kind}-organization`}>
          Organization name {!managed && <span>Optional</span>}
        </label>
        <input
          id={`${kind}-organization`}
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={120}
          required={managed}
        />
      </div>
      <div className="form-field">
        <label htmlFor={`${kind}-designator`}>
          Organization designator {!managed && <span>Optional</span>}
        </label>
        <input
          id={`${kind}-designator`}
          name="designator"
          type="text"
          placeholder="For example, mySAR"
          maxLength={24}
          required={managed}
        />
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input
          id={`${kind}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="form-privacy">
        This information is emailed to the RID2Caltopo project contact
        {managed
          ? ", copied to the requester, and retained in the managed-pilot administration system"
          : ""}
        {" "}only to respond to your request. Do not include passwords, API keys,
        or active-incident details.
      </p>
      {managed && (
        <label className="form-acknowledgement">
          <input type="checkbox" name="termsAcknowledged" value="yes" required />
          <span><CalTopoText text={managedAccessTermsText} /></span>
        </label>
      )}
      <button className="button button-primary" type="submit">
        {managed ? "Request the managed pilot" : "Request early app access"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
