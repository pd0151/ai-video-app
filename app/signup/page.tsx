"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const businessTypes = [
  "Mobile Tyre Fitting",
  "Vehicle Recovery",
  "Garage",
  "Mechanic",
  "Cleaning Service",
  "Electrician",
  "Plumber",
  "Builder",
  "Barber",
  "Gym",
  "Restaurant",
  "Other",
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SignupPage() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function makeUniqueSlug(name: string) {
    const baseSlug = createSlug(name);

    const { data } = await supabase
      .from("businesses")
      .select("slug")
      .eq("slug", baseSlug)
      .maybeSingle();

    if (!data) {
      return baseSlug;
    }

    return `${baseSlug}-${Date.now().toString().slice(-5)}`;
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const cleanBusinessName = businessName.trim();
    const cleanLocation = location.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    const selectedBusinessType =
      businessType === "Other"
        ? customBusinessType.trim()
        : businessType.trim();

    if (!cleanBusinessName) {
      setMessage("Enter your business name.");
      return;
    }

    if (!selectedBusinessType) {
      setMessage("Choose your business type.");
      return;
    }

    if (!cleanLocation) {
      setMessage("Enter your town or service area.");
      return;
    }

    if (!cleanPhone) {
      setMessage("Enter your business phone number.");
      return;
    }

    if (!cleanEmail) {
      setMessage("Enter your email address.");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Your password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const slug = await makeUniqueSlug(cleanBusinessName);

      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

      if (signupError) {
        setMessage(signupError.message);
        setLoading(false);
        return;
      }

      const { error: businessError } = await supabase
        .from("businesses")
        .insert({
          name: cleanBusinessName,
          slug,
          business_type: selectedBusinessType,
          location: cleanLocation,
          service_area: cleanLocation,
          phone: cleanPhone,
          notification_phone: cleanPhone,
          whatsapp: whatsapp.trim(),
          website: website.trim(),
          opening_hours: openingHours.trim(),
          email: cleanEmail,
          is_paid: false,
        });

      if (businessError) {
        console.error("Business creation error:", businessError);
        setMessage(
          `Your account was created, but the listing could not be saved: ${businessError.message}`
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("user", cleanEmail);
      localStorage.setItem("business_slug", slug);

      if (!signupData.session) {
        setMessage(
          "Account created. Check your email to confirm your account, then log in."
        );

        setTimeout(() => {
          router.push("/login");
        }, 2500);

        return;
      }

      router.push(`/business/${slug}`);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="signupPage">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brandMark">AF</span>

          <span className="brandWords">
            <strong>
              Ad<span>Forge</span>
            </strong>

            <small>LOCAL SERVICE PLATFORM</small>
          </span>
        </Link>

        <Link href="/login" className="loginButton">
          Login
        </Link>
      </header>

      <section className="signupSection">
        <div className="intro">
          <div className="eyebrow">
            <span />
            FREE BUSINESS LISTING
          </div>

          <h1>
            List your business
            <span>free on AdForge.</span>
          </h1>

          <p>
            Create your business account and publish a free local listing.
            Customers will be able to find your business, view your details and
            contact you directly.
          </p>

          <div className="benefits">
            <article>
              <b>01</b>

              <div>
                <strong>Create your listing</strong>
                <p>Add your business name, category, location and contact details.</p>
              </div>
            </article>

            <article>
              <b>02</b>

              <div>
                <strong>Get a public business page</strong>
                <p>Your listing receives its own AdForge business URL.</p>
              </div>
            </article>

            <article>
              <b>03</b>

              <div>
                <strong>Upgrade later</strong>
                <p>Add advertising tools or the AI receptionist when required.</p>
              </div>
            </article>
          </div>
        </div>

        <form className="formCard" onSubmit={handleSignup}>
          <div className="formHeading">
            <span>CREATE FREE LISTING</span>

            <h2>Business details</h2>

            <p>
              Complete the details below to create your AdForge account and
              public business listing.
            </p>
          </div>

          <div className="field">
            <label htmlFor="businessName">Business name *</label>

            <input
              id="businessName"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Example: Total Tyres 247"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="businessType">Business type *</label>

            <select
              id="businessType"
              value={businessType}
              onChange={(event) => setBusinessType(event.target.value)}
              disabled={loading}
            >
              <option value="">Choose business type</option>

              {businessTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {businessType === "Other" && (
            <div className="field">
              <label htmlFor="customBusinessType">
                Enter your business type *
              </label>

              <input
                id="customBusinessType"
                value={customBusinessType}
                onChange={(event) =>
                  setCustomBusinessType(event.target.value)
                }
                placeholder="Example: Mobile valeting"
                disabled={loading}
              />
            </div>
          )}

          <div className="twoColumns">
            <div className="field">
              <label htmlFor="location">Town or location *</label>

              <input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Liverpool"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Business phone *</label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="07385 182 500"
                disabled={loading}
              />
            </div>
          </div>

          <div className="twoColumns">
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp</label>

              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="Optional"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="website">Website</label>

              <input
                id="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="www.yourbusiness.co.uk"
                disabled={loading}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="openingHours">Opening hours</label>

            <input
              id="openingHours"
              value={openingHours}
              onChange={(event) => setOpeningHours(event.target.value)}
              placeholder="Example: Open 24 hours"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email address *</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.co.uk"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Create password *</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {message && (
            <div className="message" role="alert">
              {message}
            </div>
          )}

          <button className="submitButton" type="submit" disabled={loading}>
            <span>
              {loading
                ? "Creating your listing..."
                : "Create Free Business Listing"}
            </span>

            <b>{loading ? "•••" : "→"}</b>
          </button>

          <p className="loginText">
            Already have an AdForge account?{" "}
            <Link href="/login">Login here</Link>
          </p>
        </form>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #000000;
        }

        :global(body) {
          margin: 0;
          background: #000000;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(button),
        :global(input),
        :global(select) {
          font: inherit;
        }

        .signupPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 8% 20%,
              rgba(50, 255, 115, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 92% 78%,
              rgba(50, 255, 115, 0.05),
              transparent 27%
            ),
            #000000;
        }

        .topbar {
          width: min(calc(100% - 48px), 1280px);
          height: 88px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brandMark {
          font-size: 30px;
          font-weight: 1000;
          font-style: italic;
          letter-spacing: -5px;
        }

        .brandWords {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
        }

        .brandWords strong {
          font-size: 28px;
          font-weight: 950;
          letter-spacing: -2px;
        }

        .brandWords strong span {
          color: #32ff73;
        }

        .brandWords small {
          margin-top: 8px;
          color: #80858c;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .loginButton {
          min-width: 105px;
          min-height: 44px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(8, 10, 13, 0.78);
          font-size: 12px;
          font-weight: 850;
        }

        .signupSection {
          width: min(calc(100% - 48px), 1180px);
          min-height: calc(100vh - 88px);
          margin: 0 auto;
          padding: 68px 0 90px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 520px;
          align-items: center;
          gap: 75px;
        }

        .intro {
          max-width: 610px;
        }

        .eyebrow {
          width: max-content;
          max-width: 100%;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(50, 255, 115, 0.36);
          border-radius: 999px;
          background: rgba(8, 10, 13, 0.75);
          color: #32ff73;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .eyebrow span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #32ff73;
          box-shadow: 0 0 14px rgba(50, 255, 115, 0.85);
        }

        h1 {
          margin: 25px 0 0;
          font-size: clamp(57px, 6vw, 88px);
          font-weight: 1000;
          line-height: 0.9;
          letter-spacing: -5px;
        }

        h1 span {
          display: block;
          color: #32ff73;
        }

        .intro > p {
          margin: 26px 0 0;
          color: #aeb3ba;
          font-size: 15px;
          line-height: 1.75;
        }

        .benefits {
          margin-top: 35px;
          display: grid;
          gap: 11px;
        }

        .benefits article {
          min-height: 82px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 15px;
          background: rgba(8, 10, 13, 0.76);
        }

        .benefits article > b {
          width: 45px;
          height: 45px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50, 255, 115, 0.34);
          border-radius: 12px;
          color: #32ff73;
          font-size: 11px;
        }

        .benefits strong {
          font-size: 14px;
        }

        .benefits p {
          margin: 5px 0 0;
          color: #90959c;
          font-size: 10px;
          line-height: 1.5;
        }

        .formCard {
          position: relative;
          overflow: hidden;
          padding: 34px;
          border: 1px solid rgba(50, 255, 115, 0.3);
          border-radius: 23px;
          background:
            radial-gradient(
              circle at top right,
              rgba(50, 255, 115, 0.08),
              transparent 34%
            ),
            #080a0d;
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.55);
        }

        .formCard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            #32ff73,
            transparent
          );
        }

        .formHeading > span {
          color: #32ff73;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .formHeading h2 {
          margin: 12px 0 0;
          font-size: 37px;
          line-height: 1;
          letter-spacing: -2.3px;
        }

        .formHeading p {
          margin: 13px 0 0;
          color: #979ca3;
          font-size: 11px;
          line-height: 1.65;
        }

        .field {
          margin-top: 18px;
        }

        .field label {
          display: block;
          margin: 0 0 8px 2px;
          color: #e9eaec;
          font-size: 10px;
          font-weight: 850;
        }

        .field input,
        .field select {
          width: 100%;
          height: 56px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 12px;
          outline: 0;
          background: #030406;
          color: #ffffff;
          font-size: 13px;
          font-weight: 650;
        }

        .field input:focus,
        .field select:focus {
          border-color: rgba(50, 255, 115, 0.65);
          box-shadow: 0 0 0 4px rgba(50, 255, 115, 0.07);
        }

        .field input::placeholder {
          color: #666b72;
          font-weight: 500;
        }

        .field select {
          appearance: none;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .message {
          margin-top: 18px;
          padding: 13px 15px;
          border: 1px solid rgba(50, 255, 115, 0.28);
          border-radius: 11px;
          background: rgba(50, 255, 115, 0.07);
          color: #baffce;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.5;
        }

        .submitButton {
          width: 100%;
          min-height: 62px;
          margin-top: 22px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #32ff73;
          border-radius: 13px;
          background: linear-gradient(135deg, #32ff73, #20e961);
          color: #031006;
          cursor: pointer;
          font-size: 13px;
          font-weight: 950;
          box-shadow: 0 14px 35px rgba(50, 255, 115, 0.16);
        }

        .submitButton:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .submitButton b {
          font-size: 19px;
        }

        .loginText {
          margin: 20px 0 0;
          color: #777c83;
          font-size: 10px;
          text-align: center;
        }

        .loginText a {
          color: #32ff73;
          font-weight: 850;
        }

        @media (max-width: 980px) {
          .signupSection {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .formCard {
            width: min(100%, 620px);
          }
        }

        @media (max-width: 680px) {
          .topbar {
            width: 100%;
            height: 78px;
            padding: 0 19px;
          }

          .brandMark {
            font-size: 23px;
          }

          .brandWords strong {
            font-size: 21px;
          }

          .brandWords small {
            font-size: 5px;
          }

          .loginButton {
            min-width: 80px;
            min-height: 41px;
          }

          .signupSection {
            width: 100%;
            min-height: auto;
            padding: 44px 17px 70px;
          }

          h1 {
            font-size: clamp(47px, 14vw, 63px);
            letter-spacing: -3.8px;
          }

          .intro > p {
            font-size: 13px;
          }

          .benefits article {
            padding: 14px;
          }

          .formCard {
            padding: 28px 19px;
            border-radius: 20px;
          }

          .formHeading h2 {
            font-size: 32px;
          }

          .twoColumns {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .field input,
          .field select {
            height: 58px;
            font-size: 14px;
          }

          .submitButton {
            min-height: 63px;
          }
        }
      `}</style>
    </main>
  );
}