"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Enter a username to continue.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Your username must contain at least 3 characters.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const storedUsers = localStorage.getItem("users");
      const users: string[] = storedUsers
        ? JSON.parse(storedUsers)
        : [];

      const alreadyExists = users.some(
        (user) => user.toLowerCase() === cleanUsername.toLowerCase()
      );

      if (alreadyExists) {
        setError("That username is already registered.");
        setCreating(false);
        return;
      }

      users.push(cleanUsername);

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", cleanUsername);

      router.push("/business-settings");
    } catch (signupError) {
      console.error("Signup error:", signupError);
      setError("Something went wrong. Please try again.");
      setCreating(false);
    }
  }

  return (
    <main className="signupPage">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="AdForge homepage">
          <span className="brandMark">AF</span>

          <span className="brandText">
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
        <div className="backgroundGlow glowOne" />
        <div className="backgroundGlow glowTwo" />

        <div className="signupLayout">
          <div className="introPanel">
            <div className="eyebrow">
              <span className="liveDot" />
              FREE ADFORGE ACCOUNT
            </div>

            <h1>
              Join your local
              <span>business platform.</span>
            </h1>

            <p className="introText">
              Create your AdForge account to browse local services, publish
              business content and access your personalised feed.
            </p>

            <div className="benefits">
              <article>
                <div className="benefitNumber">01</div>

                <div>
                  <strong>Create your profile</strong>
                  <p>Set up your AdForge identity and access the platform.</p>
                </div>
              </article>

              <article>
                <div className="benefitNumber">02</div>

                <div>
                  <strong>Discover local services</strong>
                  <p>
                    Find mobile tyre fitting, vehicle recovery and local
                    businesses.
                  </p>
                </div>
              </article>

              <article>
                <div className="benefitNumber">03</div>

                <div>
                  <strong>Grow your presence</strong>
                  <p>
                    Publish content and connect with customers across your
                    local area.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="formCard">
            <div className="formHeading">
              <span>CREATE ACCOUNT</span>

              <h2>Sign up to AdForge</h2>

              <p>
                Choose a username to create your free account and enter the
                platform.
              </p>
            </div>

            <form onSubmit={handleSignup}>
              <label htmlFor="username">Username</label>

              <div className="inputWrap">
                <span className="inputIcon">AF</span>

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Choose your username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={40}
                  disabled={creating}
                />
              </div>

              <div className="inputNote">
                Use at least 3 characters.
              </div>

              {error && (
                <div className="errorMessage" role="alert">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="signupButton"
                disabled={creating}
              >
                <span>
                  {creating ? "Creating account..." : "Create Free Account"}
                </span>

                <b>{creating ? "•••" : "→"}</b>
              </button>
            </form>

            <div className="divider">
              <span />
              <p>ALREADY REGISTERED?</p>
              <span />
            </div>

            <Link href="/login" className="secondaryButton">
              Login to your account
              <span>→</span>
            </Link>

            <p className="terms">
              By creating an account, you agree to use AdForge responsibly and
              follow the platform’s terms.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} AdForge</span>

        <div>
          <Link href="/">Homepage</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="/services/mobile-tyre-fitting">
            Mobile Tyres
          </Link>
          <Link href="/services/vehicle-recovery">
            Vehicle Recovery
          </Link>
        </div>
      </footer>

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
        :global(input) {
          font: inherit;
        }

        .signupPage {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 15% 18%,
              rgba(50, 255, 115, 0.08),
              transparent 31%
            ),
            #000000;
        }

        .topbar {
          position: relative;
          z-index: 10;
          width: min(calc(100% - 48px), 1280px);
          height: 92px;
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
          color: #ffffff;
          font-size: 31px;
          font-weight: 1000;
          font-style: italic;
          letter-spacing: -5px;
        }

        .brandText {
          display: flex;
          flex-direction: column;
          line-height: 0.9;
        }

        .brandText strong {
          font-size: 29px;
          font-weight: 950;
          letter-spacing: -2.3px;
        }

        .brandText strong span {
          color: #32ff73;
        }

        .brandText small {
          margin-top: 8px;
          color: #81868e;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2.2px;
        }

        .loginButton {
          min-width: 112px;
          min-height: 46px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(10, 12, 16, 0.72);
          color: #ffffff;
          font-size: 13px;
          font-weight: 850;
          transition:
            border-color 180ms ease,
            background 180ms ease;
        }

        .loginButton:hover {
          border-color: rgba(50, 255, 115, 0.5);
          background: rgba(50, 255, 115, 0.06);
        }

        .signupSection {
          position: relative;
          min-height: calc(100vh - 180px);
          padding: 74px 24px 92px;
          display: flex;
          align-items: center;
        }

        .backgroundGlow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(90px);
        }

        .glowOne {
          top: 90px;
          left: -160px;
          width: 420px;
          height: 420px;
          background: rgba(50, 255, 115, 0.08);
        }

        .glowTwo {
          right: -180px;
          bottom: 20px;
          width: 480px;
          height: 480px;
          background: rgba(50, 255, 115, 0.05);
        }

        .signupLayout {
          position: relative;
          z-index: 2;
          width: min(100%, 1180px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 460px;
          gap: 76px;
          align-items: center;
        }

        .introPanel {
          max-width: 650px;
        }

        .eyebrow {
          width: max-content;
          max-width: 100%;
          padding: 11px 17px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(50, 255, 115, 0.33);
          border-radius: 999px;
          background: rgba(7, 10, 12, 0.75);
          color: #32ff73;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2.1px;
        }

        .liveDot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #32ff73;
          box-shadow: 0 0 15px rgba(50, 255, 115, 0.9);
        }

        h1 {
          margin: 26px 0 0;
          max-width: 680px;
          font-size: clamp(58px, 6vw, 92px);
          font-weight: 1000;
          line-height: 0.9;
          letter-spacing: -5.8px;
        }

        h1 span {
          display: block;
          color: #32ff73;
        }

        .introText {
          max-width: 620px;
          margin: 27px 0 0;
          color: #aeb3bb;
          font-size: 16px;
          line-height: 1.75;
        }

        .benefits {
          margin-top: 39px;
          display: grid;
          gap: 12px;
        }

        .benefits article {
          min-height: 86px;
          padding: 17px 18px;
          display: flex;
          align-items: center;
          gap: 17px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 15px;
          background: rgba(8, 10, 13, 0.75);
        }

        .benefitNumber {
          width: 46px;
          height: 46px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50, 255, 115, 0.35);
          border-radius: 13px;
          color: #32ff73;
          font-size: 11px;
          font-weight: 950;
        }

        .benefits strong {
          display: block;
          font-size: 15px;
        }

        .benefits p {
          margin: 5px 0 0;
          color: #92979f;
          font-size: 11px;
          line-height: 1.55;
        }

        .formCard {
          position: relative;
          overflow: hidden;
          padding: 38px;
          border: 1px solid rgba(50, 255, 115, 0.27);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at top right,
              rgba(50, 255, 115, 0.09),
              transparent 37%
            ),
            #080a0d;
          box-shadow:
            0 35px 100px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .formCard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 42px;
          right: 42px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(50, 255, 115, 0.9),
            transparent
          );
        }

        .formHeading > span {
          color: #32ff73;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 2.2px;
        }

        .formHeading h2 {
          margin: 13px 0 0;
          font-size: 38px;
          line-height: 1;
          letter-spacing: -2.5px;
        }

        .formHeading p {
          margin: 14px 0 0;
          color: #979ca4;
          font-size: 12px;
          line-height: 1.65;
        }

        form {
          margin-top: 30px;
        }

        label {
          display: block;
          margin-bottom: 10px;
          color: #e9eaec;
          font-size: 11px;
          font-weight: 850;
        }

        .inputWrap {
          min-height: 62px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 13px;
          background: #030406;
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .inputWrap:focus-within {
          border-color: rgba(50, 255, 115, 0.68);
          box-shadow: 0 0 0 4px rgba(50, 255, 115, 0.07);
        }

        .inputIcon {
          width: 35px;
          height: 35px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50, 255, 115, 0.28);
          border-radius: 10px;
          color: #32ff73;
          font-size: 9px;
          font-style: italic;
          font-weight: 950;
        }

        input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
        }

        input::placeholder {
          color: #696e76;
          font-weight: 500;
        }

        input:disabled {
          opacity: 0.65;
        }

        .inputNote {
          margin: 9px 2px 0;
          color: #71767e;
          font-size: 10px;
        }

        .errorMessage {
          margin-top: 15px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255, 91, 91, 0.28);
          border-radius: 11px;
          background: rgba(255, 91, 91, 0.07);
          color: #ffadad;
          font-size: 11px;
          font-weight: 750;
        }

        .errorMessage span {
          width: 23px;
          height: 23px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 91, 91, 0.45);
          border-radius: 50%;
          font-size: 11px;
          font-weight: 950;
        }

        .signupButton {
          width: 100%;
          min-height: 63px;
          margin-top: 22px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #32ff73;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #32ff73 0%,
            #24e962 100%
          );
          color: #031006;
          cursor: pointer;
          font-size: 14px;
          font-weight: 950;
          box-shadow: 0 14px 38px rgba(50, 255, 115, 0.17);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .signupButton:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 18px 45px rgba(50, 255, 115, 0.25);
        }

        .signupButton:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .signupButton b {
          font-size: 20px;
        }

        .divider {
          margin: 27px 0 19px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 13px;
        }

        .divider span {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .divider p {
          margin: 0;
          color: #686d74;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 1.7px;
        }

        .secondaryButton {
          min-height: 57px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 13px;
          background: #030406;
          color: #ffffff;
          font-size: 12px;
          font-weight: 850;
        }

        .secondaryButton span {
          color: #32ff73;
          font-size: 18px;
        }

        .terms {
          margin: 21px 4px 0;
          color: #696e76;
          font-size: 9px;
          line-height: 1.6;
          text-align: center;
        }

        .footer {
          width: min(calc(100% - 48px), 1280px);
          min-height: 88px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #70757c;
          font-size: 9px;
        }

        .footer div {
          display: flex;
          flex-wrap: wrap;
          gap: 19px;
        }

        .footer a:hover {
          color: #32ff73;
        }

        @media (max-width: 980px) {
          .signupLayout {
            grid-template-columns: 1fr;
            gap: 52px;
          }

          .introPanel {
            max-width: 760px;
          }

          .formCard {
            width: min(100%, 600px);
          }
        }

        @media (max-width: 680px) {
          .topbar {
            width: 100%;
            height: 82px;
            padding: 0 20px;
          }

          .brandMark {
            font-size: 24px;
          }

          .brandText strong {
            font-size: 22px;
            letter-spacing: -1.5px;
          }

          .brandText small {
            margin-top: 7px;
            font-size: 5px;
            letter-spacing: 1.5px;
          }

          .loginButton {
            min-width: 82px;
            min-height: 42px;
            padding: 0 15px;
            font-size: 11px;
          }

          .signupSection {
            min-height: auto;
            padding: 48px 18px 70px;
          }

          .signupLayout {
            gap: 42px;
          }

          .eyebrow {
            padding: 10px 14px;
            font-size: 7px;
            letter-spacing: 1.5px;
          }

          h1 {
            margin-top: 22px;
            font-size: clamp(48px, 14vw, 65px);
            line-height: 0.91;
            letter-spacing: -4px;
          }

          .introText {
            margin-top: 22px;
            font-size: 14px;
            line-height: 1.7;
          }

          .benefits {
            margin-top: 30px;
          }

          .benefits article {
            min-height: 82px;
            padding: 15px;
          }

          .benefits strong {
            font-size: 13px;
          }

          .benefits p {
            font-size: 10px;
          }

          .formCard {
            padding: 29px 20px;
            border-radius: 20px;
          }

          .formHeading h2 {
            font-size: 33px;
          }

          .inputWrap {
            min-height: 60px;
          }

          .signupButton {
            min-height: 62px;
          }

          .footer {
            width: calc(100% - 36px);
            padding: 26px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .footer div {
            display: grid;
            gap: 11px;
          }
        }
      `}</style>
    </main>
  );
}