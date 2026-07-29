import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { HOME_SEO } from "../lib/seo-locks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  alternates: {
    canonical: HOME_SEO.canonical,
  },
  openGraph: {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    url: HOME_SEO.canonical,
    siteName: "AdForge",
    type: "website",
    images: [
      {
        url: "https://adforge.uk/images/hero-recovery.png",
        width: 1200,
        height: 630,
        alt: "24 Hour Mobile Tyre Fitting and Vehicle Recovery by AdForge",
      },
    ],
  },
};

const PHONE = "+447576579923";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type LandingPage = {
  slug: string;
  headline: string | null;
  meta_description: string | null;
};

function cleanTitle(page: LandingPage) {
  if (page.headline?.trim()) return page.headline.trim();
  return page.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isTyrePage(slug: string) {
  const value = slug.toLowerCase();
  return (
    value.includes("tyre") ||
    value.includes("puncture") ||
    value.includes("flat-tyre") ||
    value.includes("locking-wheel") ||
    value.includes("wheel-nut")
  );
}

function isRecoveryPage(slug: string) {
  const value = slug.toLowerCase();
  return (
    value.includes("recovery") ||
    value.includes("towing") ||
    value.includes("breakdown") ||
    value.includes("roadside-assistance")
  );
}

const faqs = [
  {
    q: "Do mobile tyre fitters operate 24 hours a day?",
    a: "Many AdForge mobile tyre pages cover 24-hour emergency mobile tyre fitting, roadside tyre replacement and puncture repair. Availability depends on the local provider and location.",
  },
  {
    q: "Can a tyre be fitted at my home or workplace?",
    a: "Yes. Mobile tyre fitting can usually be arranged at a home, workplace or roadside location, subject to safe access and local availability.",
  },
  {
    q: "Can I get new and part-worn tyres?",
    a: "AdForge helps customers find providers offering new tyres, part-worn tyres, emergency tyre replacement and mobile tyre fitting.",
  },
  {
    q: "What recovery services can I find through AdForge?",
    a: "AdForge pages cover vehicle recovery, breakdown recovery, accident recovery, roadside assistance, towing and vehicle transport.",
  },
  {
    q: "Do recovery providers cover Liverpool, Wirral and Merseyside?",
    a: "Yes. AdForge includes recovery pages for Liverpool, Wirral, Merseyside and surrounding towns, depending on provider availability.",
  },
  {
    q: "What happens when I call AdForge?",
    a: "The call goes through the AdForge number so the job details can be collected and directed to the right local provider.",
  },
];

const DISPLAY_PHONE = "+44 7576 579923";

const serviceCards = [
  {
    number: "01",
    title: "Mobile Tyre Fitting",
    text: "24-hour mobile tyre fitting, puncture repairs, emergency tyre replacement, new and part-worn tyres.",
    href: "/services/mobile-tyre-fitting",
  },
  {
    number: "02",
    title: "Vehicle Recovery",
    text: "Breakdown recovery, towing, accident recovery, roadside assistance and vehicle transport.",
    href: "/services/vehicle-recovery",
  },
  {
    number: "03",
    title: "Local Businesses",
    text: "Browse trusted businesses across Liverpool, Wirral and Merseyside.",
    href: "/businesses",
  },
];

const tyreServices = [
  "24-hour mobile tyre fitting",
  "Emergency tyre repair",
  "Puncture repairs",
  "New and part-worn tyres",
  "Roadside tyre replacement",
  "Wheel balancing",
  "Locking-wheel-nut removal",
];

const recoveryServices = [
  "24-hour recovery service",
  "Breakdown recovery",
  "Accident recovery",
  "Towing service",
  "Roadside assistance",
  "Vehicle transport",
  "Liverpool, Wirral and Merseyside coverage",
];


const tyreSeoParagraphs = [
  {
    title: "24-hour emergency mobile tyre fitting",
    paragraphs: [
      "AdForge helps drivers find 24-hour emergency mobile tyre fitting when a tyre fails unexpectedly at home, at work, in a car park or at the roadside. A mobile tyre fitter can travel to the vehicle with the equipment needed to inspect the damage, remove the unsafe tyre and fit a suitable replacement without the customer first arranging transport to a garage.",
      "This service can include emergency tyre call outs, out-of-hours tyre fitting, evening and weekend assistance, rapid roadside tyre replacement and same-day mobile tyre fitting across Liverpool, Wirral and Merseyside. Availability, response time and tyre stock depend on the location, tyre size and local provider.",
    ],
  },
  {
    title: "Emergency tyre call outs and same-day fitting",
    paragraphs: [
      "An emergency tyre call out is useful when a vehicle cannot be driven safely because of a flat tyre, sidewall damage, a blowout, exposed cords or severe loss of pressure. AdForge connects urgent enquiries with local mobile tyre services that may be able to attend on the same day and fit a replacement tyre at the vehicle's location.",
      "Customers can search for same-day tyre fitting, immediate mobile tyre replacement, 24-hour tyre call outs, weekend tyre fitting and bank-holiday tyre assistance. The fitter will normally need the tyre size, vehicle details and exact location before confirming stock and an estimated arrival time.",
    ],
  },
  {
    title: "Puncture repairs and flat tyre assistance",
    paragraphs: [
      "A puncture does not always require a new tyre. Where the damage is within the safe repairable area and the tyre has not been driven while dangerously underinflated, a mobile puncture repair may be possible. AdForge pages help drivers find emergency puncture repairs, slow-puncture checks, leaking-valve inspections and flat tyre assistance.",
      "When a puncture is too close to the sidewall, the tyre structure is damaged or the tread is below the legal limit, the provider may recommend a replacement instead. The aim is to arrange a safe repair where appropriate and a roadside tyre replacement where repair is not possible.",
    ],
  },
  {
    title: "Roadside tyre replacement after a blowout",
    paragraphs: [
      "A tyre blowout or sudden pressure loss can leave a vehicle stranded and unsafe to move. Roadside tyre replacement allows a mobile fitter to attend the breakdown location, assess the wheel and tyre, and fit a suitable replacement so the journey can continue without recovery to a tyre depot.",
      "AdForge helps drivers search for roadside mobile tyres, emergency replacement tyres, flat tyre call outs and urgent tyre fitting near Liverpool and surrounding areas. Drivers should stop in the safest available place, switch on hazard lights and avoid standing close to moving traffic while waiting for assistance.",
    ],
  },
  {
    title: "New tyres, budget tyres and premium tyres",
    paragraphs: [
      "Mobile tyre providers may carry a choice of new tyres covering budget, mid-range and premium brands. The right option depends on vehicle type, tyre size, driving conditions, annual mileage and budget. AdForge helps customers find mobile new tyre fitting without needing to visit a fixed tyre centre.",
      "A provider can confirm available brands and prices after receiving the tyre size shown on the sidewall. Where stock is available, new tyres can often be fitted at home, at work or at the roadside as part of a scheduled or emergency call out.",
    ],
  },
  {
    title: "Part-worn tyres and affordable replacements",
    paragraphs: [
      "Some local providers offer part-worn tyres as a lower-cost replacement option. A correctly supplied part-worn tyre should be inspected, clearly marked where required and have sufficient legal tread depth and no unsafe structural damage. Availability varies considerably by tyre size.",
      "AdForge helps customers search for mobile part-worn tyre fitting, affordable replacement tyres and budget mobile tyres across Liverpool, Wirral and Merseyside. Customers should ask the provider about tread depth, condition and suitability before fitting.",
    ],
  },
  {
    title: "Locking wheel nut and locking nut removal",
    paragraphs: [
      "A wheel cannot always be removed when the locking wheel nut key has been lost, damaged or rounded off. Selected mobile providers may offer locking wheel nut removal, locking nut removal, damaged wheel nut extraction and assistance with seized or broken locking bolts.",
      "Once the locking nut has been removed, the fitter can access the wheel and complete a puncture repair or tyre replacement where possible. The customer should provide the vehicle make, model and any photographs requested so the provider can bring suitable removal equipment.",
    ],
  },
  {
    title: "Wheel balancing after mobile tyre fitting",
    paragraphs: [
      "Wheel balancing helps distribute weight evenly around the wheel and tyre assembly. An imbalance may cause steering-wheel vibration, cabin vibration, uneven tyre wear or discomfort at higher speeds. Many equipped mobile tyre vans can balance a wheel after fitting a replacement tyre.",
      "AdForge service pages cover mobile wheel balancing, tyre fitting and balancing, vibration checks and tyre-condition inspections. Wheel balancing is different from wheel alignment, so persistent pulling or uneven wear may require a separate alignment assessment at a suitably equipped premises.",
    ],
  },
  {
    title: "Home tyre fitting and workplace tyre fitting",
    paragraphs: [
      "Mobile tyre fitting can be arranged at a home address or workplace, allowing the tyre change to be completed while the customer continues with their day. This is useful for planned replacements as well as urgent problems discovered before a journey or during working hours.",
      "Customers can search AdForge for home tyre fitting, driveway tyre replacement, workplace mobile tyres, office car-park tyre fitting and scheduled same-day fitting. Safe access and enough working space around the vehicle are normally required.",
    ],
  },
  {
    title: "Car tyres, van tyres, SUV tyres and 4x4 tyres",
    paragraphs: [
      "Different vehicles require tyres with the correct dimensions, load rating and speed rating. AdForge helps customers search for mobile car tyres, commercial van tyres, reinforced tyres, SUV tyres and 4x4 tyre replacement based on the vehicle and tyre specification.",
      "Van and commercial-vehicle tyres may require a higher load rating than standard passenger-car tyres. Giving the provider the complete tyre size and vehicle registration helps them identify a suitable option before travelling to the call out.",
    ],
  },
  {
    title: "Run-flat tyres and low-profile tyres",
    paragraphs: [
      "Run-flat and low-profile tyres can require specialist handling and suitable fitting equipment. A run-flat tyre may allow limited travel after pressure loss, but it still needs to be inspected because internal damage may not be visible from outside.",
      "AdForge helps drivers locate mobile run-flat tyre fitting, low-profile tyre replacement and urgent assistance for vehicles without a usable spare wheel. Stock can be more limited for specialist sizes, so the full tyre markings should be provided when booking.",
    ],
  },
  {
    title: "Tyre pressure, tread depth and safety checks",
    paragraphs: [
      "Low pressure, uneven wear, cracking and insufficient tread can increase stopping distance and make a tyre unsafe. Mobile providers may carry out tyre-pressure checks, tread-depth checks, visual tyre inspections and valve checks while attending another tyre service.",
      "The legal and safe condition of a tyre remains important whether it is new or part worn. AdForge encourages customers to arrange an inspection when they notice repeated pressure loss, vibration, bulges, cuts, exposed cords or unusual tyre noise.",
    ],
  },
];

const recoverySeoParagraphs = [
  {
    title: "24-hour emergency vehicle recovery",
    paragraphs: [
      "AdForge helps drivers find 24-hour emergency vehicle recovery when a car, van or motorcycle cannot be driven safely. Recovery may be required after a mechanical failure, electrical fault, collision, tyre-related incident or breakdown that cannot be resolved at the roadside.",
      "Local operators may provide emergency recovery call outs during the day, overnight, at weekends and on bank holidays across Liverpool, Wirral and Merseyside. The operator will normally ask for the vehicle type, condition, pickup location and required destination before dispatching the correct recovery truck.",
    ],
  },
  {
    title: "Breakdown recovery and roadside collection",
    paragraphs: [
      "Breakdown recovery is used when a vehicle will not start, has lost power, is overheating or has developed a fault that makes continued driving unsafe. A recovery operator can collect the vehicle and transport it to a home address, garage, dealership or chosen repair centre.",
      "AdForge pages cover local breakdown recovery, emergency roadside collection, same-day recovery and out-of-hours breakdown assistance. The exact recovery method depends on the vehicle, access, road conditions and whether the wheels can roll freely.",
    ],
  },
  {
    title: "Roadside assistance and non-starting vehicles",
    paragraphs: [
      "Some call outs can be resolved without transporting the vehicle. Depending on the operator, roadside assistance may include basic fault checks, jump starts, help with a flat battery or minor assistance that allows the vehicle to move to a safer place.",
      "When a roadside fix is not safe or successful, the operator can arrange vehicle recovery instead. AdForge helps customers search for roadside assistance, non-start recovery and urgent breakdown support through one local service platform.",
    ],
  },
  {
    title: "Accident recovery and damaged vehicle recovery",
    paragraphs: [
      "After a collision, a vehicle may need professional accident recovery even when the visible damage appears minor. Damaged steering, suspension, wheels, bodywork or fluid leaks can make the vehicle unsafe to drive and may require specialist loading equipment.",
      "Selected operators may provide accident-damaged vehicle recovery, non-runner collection and transport to a body shop, garage, storage facility or home address. Customers should make sure the scene is safe and follow instructions from emergency services where they are involved.",
    ],
  },
  {
    title: "Car recovery, van recovery and motorcycle recovery",
    paragraphs: [
      "Recovery equipment must suit the vehicle being transported. AdForge helps customers search for car recovery, van recovery, motorcycle recovery, 4x4 recovery and light commercial vehicle recovery throughout Liverpool and surrounding areas.",
      "The operator may need information about vehicle weight, height, wheel condition, gearbox type and access restrictions. Motorcycles and specialist vehicles may require additional straps, wheel supports or a particular recovery body.",
    ],
  },
  {
    title: "Towing services and emergency towing",
    paragraphs: [
      "Towing services can move a broken-down or non-running vehicle over a local distance when the correct equipment and method are used. AdForge pages target local towing, emergency towing, car towing and van towing searches while directing enquiries to suitable recovery providers.",
      "Not every vehicle or fault is suitable for a simple tow. Automatic, electric, four-wheel-drive and badly damaged vehicles may need to be fully lifted or transported on a flatbed to prevent further damage.",
    ],
  },
  {
    title: "Flatbed recovery and vehicle transport",
    paragraphs: [
      "Flatbed recovery carries the entire vehicle off the road surface and is often suitable for accident-damaged cars, non-runners, low vehicles and vehicles that should not be towed with wheels on the ground. It can also be used for planned vehicle transport.",
      "AdForge helps customers find flatbed recovery, vehicle collection, garage-to-garage transport, auction collection, dealership delivery and private vehicle transport. Accurate pickup and destination details help the operator provide a clear quotation.",
    ],
  },
  {
    title: "Local recovery and long-distance recovery",
    paragraphs: [
      "Local recovery usually transports a vehicle within the same town or surrounding area, while long-distance recovery moves it between cities or regions. AdForge supports searches for both urgent local recovery and pre-arranged long-distance vehicle transport.",
      "Pricing may depend on loading requirements, mileage, tolls, waiting time and the size of the recovery vehicle. Customers should confirm whether the quote includes the full journey from pickup to final destination.",
    ],
  },
  {
    title: "Motorway recovery and major-road breakdowns",
    paragraphs: [
      "Breaking down on a motorway or fast road requires extra care. Drivers should move to a safe place where possible, leave the vehicle from the side away from traffic when safe to do so and follow official road-safety guidance before arranging recovery.",
      "AdForge recovery pages cover motorway recovery and breakdown collection near major routes around Liverpool and Merseyside. The operator will need a precise location, direction of travel, nearby junction or marker information and details of the vehicle.",
    ],
  },
  {
    title: "Jump starts and flat battery assistance",
    paragraphs: [
      "A flat or weak battery can prevent a vehicle from starting at home, at work or after it has been parked. Some recovery providers offer battery jump starts and flat battery assistance as part of their roadside call-out service.",
      "If the vehicle still will not start, or if the charging system appears faulty, recovery to a garage may be the safer option. Electric and hybrid vehicles require appropriate procedures and should only be handled by a suitably equipped provider.",
    ],
  },
  {
    title: "Non-runner collection and garage transport",
    paragraphs: [
      "A non-runner may need moving even when there is no emergency. AdForge helps customers arrange collection of vehicles that have been stored, purchased, sold or booked into a garage but cannot move under their own power.",
      "Non-runner transport may require a winch, skates or additional loading equipment when brakes are seized, steering is locked or wheels are damaged. The condition of the vehicle should be explained before collection so the correct truck can be sent.",
    ],
  },
  {
    title: "Same-day recovery and out-of-hours call outs",
    paragraphs: [
      "AdForge helps customers search for same-day vehicle recovery, rapid-response breakdown recovery, weekend towing, evening recovery and 24-hour emergency call outs. This is useful when a vehicle must be removed urgently from a roadside, workplace, car park or private property.",
      "Response times depend on traffic, distance, current workload and the recovery equipment required. Providing complete information at the first call helps the operator assess the job and avoid delays caused by sending an unsuitable vehicle.",
    ],
  },
];

const areas = [
  "Liverpool",
  "Wirral",
  "Bootle",
  "Huyton",
  "Kirkby",
  "Knowsley",
  "Wallasey",
  "Sefton",
  "St Helens",
  "Widnes",
  "Merseyside",
];

export default async function PublicHomePage() {
  const { data: activePages } = await supabase
    .from("landing_pages")
    .select("slug,headline,meta_description")
    .eq("active", true)
    .limit(500);

  const allPages = (activePages || []) as LandingPage[];
  const tyrePages = allPages.filter((page) => isTyrePage(page.slug)).slice(0, 18);
  const recoveryPages = allPages.filter((page) => isRecoveryPage(page.slug)).slice(0, 18);
  const latestPages = allPages.slice(0, 20);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdForge",
    url: "https://adforge.uk/",
    description:
      "AdForge helps customers find mobile tyre fitting, vehicle recovery and trusted local services across Liverpool, Wirral and Merseyside.",
  };

  return (
    <>
      <main className="page">
        <header className="siteHeader">
          <Link href="/" className="logo">
            <span className="logoBox">AF</span>

            <span className="logoText">
              <strong>
                Ad<span>Forge</span>
              </strong>
              <small>LOCAL SERVICE PLATFORM</small>
            </span>
          </Link>

          <nav className="desktopNav">
            <Link href="#services">Services</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="#areas">Areas</Link>
            <Link href="/ai-receptionist">AI Receptionist</Link>
            <Link href="/home">Open App</Link>
          </nav>

          <div className="headerActions">
            <a href={`tel:${PHONE}`} className="callTop">
              <span>CALL NOW</span>
              <strong>{DISPLAY_PHONE}</strong>
            </a>

            <Link href="/signup" className="listTop">
              List Business Free
            </Link>
          </div>
        </header>

        <nav className="mobileNav">
          <Link href="#services">Services</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="#areas">Areas</Link>
          <Link href="/home">Open App</Link>
        </nav>

        <section className="hero">
          <div className="heroMedia" />
          <div className="heroOverlay" />

          <div className="heroGrid">
            <div className="heroCopy">
              <div className="eyebrow">
                <span />
                24/7 LOCAL EMERGENCY SERVICES
              </div>

              <h1>{HOME_SEO.h1}</h1>

              <p className="heroLead">
                AdForge helps drivers find 24-hour mobile tyre fitting,
                emergency tyre repair, puncture repairs, mobile tyres, new and
                part-worn tyres, vehicle recovery, breakdown recovery, towing
                services and roadside assistance across Liverpool, Wirral and
                Merseyside.
              </p>

              <div className="heroActions">
                <a href={`tel:${PHONE}`} className="primaryCta">
                  Call AdForge
                  <span>→</span>
                </a>

                <Link href="/services/mobile-tyre-fitting" className="secondaryCta">
                  Find Mobile Tyres
                  <span>→</span>
                </Link>

                <Link href="/services/vehicle-recovery" className="secondaryCta">
                  Find Recovery
                  <span>→</span>
                </Link>
              </div>
            </div>

            <aside className="heroPanel">
              <span className="panelKicker">LIVE LOCAL RESPONSE</span>

              <div className="statusRow">
                <span>Service</span>
                <strong>Tyres &amp; Recovery</strong>
              </div>

              <div className="statusRow">
                <span>Area</span>
                <strong>Liverpool &amp; nearby</strong>
              </div>

              <div className="statusRow">
                <span>Status</span>
                <strong className="available">Available now</strong>
              </div>

              <a href={`tel:${PHONE}`} className="panelCall">
                Call {DISPLAY_PHONE}
              </a>
            </aside>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>24/7</strong>
            <span>Emergency support</span>
          </div>

          <div>
            <strong>Local</strong>
            <span>Liverpool coverage</span>
          </div>

          <div>
            <strong>Direct</strong>
            <span>Calls through AdForge</span>
          </div>

          <div>
            <strong>Fast</strong>
            <span>Simple enquiry process</span>
          </div>
        </section>

        <section className="services" id="services">
          <div className="sectionIntro">
            <span>WHAT ADFORGE HELPS YOU FIND</span>
            <h2>One platform for urgent local help.</h2>
            <p>
              Browse AdForge service hubs, find a local provider and send every
              call or enquiry through AdForge.
            </p>
          </div>

          <div className="serviceStack">
            {serviceCards.map((service) => (
              <Link href={service.href} className="serviceRow" key={service.number}>
                <div className="serviceNumber">{service.number}</div>

                <div className="serviceWords">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>

                <span className="serviceArrow">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="popularSeo" id="popular">
          <div className="sectionIntro wide">
            <span>DYNAMIC INTERNAL LINKING</span>
            <h2>Popular mobile tyre searches.</h2>
            <p>
              These links are pulled directly from active AdForge landing pages.
              New tyre pages added in Supabase can appear here automatically,
              giving Google a clear crawl path from the homepage.
            </p>
          </div>

          <div className="seoLinkGrid">
            {tyrePages.map((page) => (
              <Link href={`/seo/${page.slug}`} key={page.slug}>
                <span>{cleanTitle(page)}</span>
                <b>→</b>
              </Link>
            ))}
          </div>

          <Link href="/services/mobile-tyre-fitting" className="viewAllSeo">
            View all mobile tyre areas <span>→</span>
          </Link>
        </section>

        <section className="popularSeo recoveryPopular">
          <div className="sectionIntro wide">
            <span>RECOVERY SERVICE PAGES</span>
            <h2>Popular vehicle recovery searches.</h2>
            <p>
              AdForge recovery pages target breakdown recovery, towing, accident
              recovery, roadside assistance and vehicle transport searches.
            </p>
          </div>

          <div className="seoLinkGrid">
            {recoveryPages.map((page) => (
              <Link href={`/seo/${page.slug}`} key={page.slug}>
                <span>{cleanTitle(page)}</span>
                <b>→</b>
              </Link>
            ))}
          </div>

          <Link href="/services/vehicle-recovery" className="viewAllSeo">
            View all recovery areas <span>→</span>
          </Link>
        </section>

        <section className="splitServices">
          <article className="splitCard tyreCard">
            <div className="splitImage tyrePhoto" />

            <div className="splitContent">
              <span className="splitKicker">MOBILE TYRE SERVICES</span>
              <h2>24-hour mobile tyre fitting across Liverpool.</h2>

              <p>
                AdForge helps customers find emergency mobile tyre fitting,
                puncture repairs, emergency tyre repair, roadside tyre
                replacement, mobile tyres, new and part-worn tyres, wheel
                balancing and locking-wheel-nut removal.
              </p>

              <details>
                <summary>
                  View all tyre services
                  <b>+</b>
                </summary>

                <div className="detailGrid">
                  {tyreServices.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              </details>

              <div className="splitActions">
                <Link href="/services/mobile-tyre-fitting" className="smallGreen">
                  Browse Tyre Areas
                </Link>

                <a href={`tel:${PHONE}`} className="smallDark">
                  Call Now
                </a>
              </div>
            </div>
          </article>

          <article className="splitCard recoveryCard">
            <div className="splitContent">
              <span className="splitKicker">VEHICLE RECOVERY</span>
              <h2>Breakdown recovery, towing and roadside help.</h2>

              <p>
                Find 24-hour vehicle recovery, breakdown recovery, accident
                recovery, towing service, roadside assistance and vehicle
                transport through AdForge across Liverpool, Wirral and
                Merseyside.
              </p>

              <details>
                <summary>
                  View all recovery services
                  <b>+</b>
                </summary>

                <div className="detailGrid">
                  {recoveryServices.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              </details>

              <div className="splitActions">
                <Link href="/services/vehicle-recovery" className="smallGreen">
                  Browse Recovery Areas
                </Link>

                <a href={`tel:${PHONE}`} className="smallDark">
                  Call Now
                </a>
              </div>
            </div>

            <div className="splitImage recoveryPhoto" />
          </article>
        </section>


        <section className="keywordContent" id="service-details">
          <div className="sectionIntro wide">
            <span>DETAILED MOBILE TYRE SERVICES</span>
            <h2>Complete guide to mobile tyre fitting services.</h2>
            <p>
              Open any box below to read detailed service information. The
              wording naturally covers the different tyre services customers
              search for without filling the visible homepage with repeated
              keyword lists.
            </p>
          </div>

          <div className="keywordBoxGrid">
            {tyreSeoParagraphs.map((item) => (
              <details className="keywordBox" key={item.title}>
                <summary>
                  <span>{item.title}</span>
                  <b>+</b>
                </summary>
                <div className="keywordParagraphs">{item.paragraphs.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}</div>
              </details>
            ))}
          </div>

          <div className="keywordSectionActions">
            <Link href="/services/mobile-tyre-fitting" className="smallGreen">
              View Mobile Tyre Services
            </Link>
            <a href={`tel:${PHONE}`} className="smallDark">
              Request an Emergency Call Out
            </a>
          </div>
        </section>

        <section className="keywordContent recoveryKeywordContent">
          <div className="sectionIntro wide">
            <span>DETAILED VEHICLE RECOVERY SERVICES</span>
            <h2>Complete guide to vehicle recovery services.</h2>
            <p>
              These expandable sections explain the recovery services available
              through AdForge while targeting useful local search phrases in
              complete, natural sentences.
            </p>
          </div>

          <div className="keywordBoxGrid">
            {recoverySeoParagraphs.map((item) => (
              <details className="keywordBox" key={item.title}>
                <summary>
                  <span>{item.title}</span>
                  <b>+</b>
                </summary>
                <div className="keywordParagraphs">{item.paragraphs.map((paragraph) => (<p key={paragraph}>{paragraph}</p>))}</div>
              </details>
            ))}
          </div>

          <div className="keywordSectionActions">
            <Link href="/services/vehicle-recovery" className="smallGreen">
              View Vehicle Recovery Services
            </Link>
            <a href={`tel:${PHONE}`} className="smallDark">
              Request Emergency Recovery
            </a>
          </div>
        </section>

        <section className="featured">
          <div className="featuredMedia">
            <span className="featuredBadge">FEATURED LOCAL PROVIDER</span>

            <img
              src="/images/totaaltyres.jpeg"
              alt="Total Tyres mobile tyre fitting van in Liverpool"
            />
          </div>

          <div className="featuredCopy">
            <span className="featuredKicker">
              LOCAL BUSINESS COVERING LIVERPOOL &amp; MERSEYSIDE
            </span>

            <h2>Total Tyres &amp; Recovery 247 Ltd</h2>
            <h3>Mobile Tyre Fitting &amp; Tyre Support</h3>

            <p>
              Local mobile tyre fitting provider offering emergency tyre
              replacement, puncture repairs, new and part-worn tyres, wheel
              balancing, locking nut removal and roadside tyre support.
            </p>

            <div className="featureList">
              <span>✓ Mobile Tyre Fitting</span>
              <span>✓ Puncture Repairs</span>
              <span>✓ New &amp; Part-Worn Tyres</span>
              <span>✓ Emergency Tyre Replacement</span>
              <span>✓ Wheel Balancing</span>
              <span>✓ Locking Nut Removal</span>
            </div>

            <div className="coverage">
              <strong>Coverage:</strong> Liverpool, Wirral &amp; Merseyside
            </div>

            <div className="featuredActions">
              <a href={`tel:${PHONE}`} className="featuredPrimary">
                Call Through AdForge
                <span>→</span>
              </a>

              <Link href="/services/mobile-tyre-fitting" className="featuredSecondary">
                View Services
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="areas" id="areas">
          <div className="sectionIntro">
            <span>LOCAL COVERAGE</span>
            <h2>Tyre and recovery services near you.</h2>
            <p>
              AdForge service pages cover Liverpool, Wirral, Merseyside and
              surrounding towns.
            </p>
          </div>

          <div className="areaGrid">
            {areas.map((area) => (
              <Link href="/services/mobile-tyre-fitting" key={area}>
                {area}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>

        {latestPages.length > 0 && (
          <section className="latestSeoPages">
            <div className="sectionIntro wide">
              <span>MORE ACTIVE ADFORGE PAGES</span>
              <h2>More local tyre and recovery pages.</h2>
              <p>
                This section creates another internal crawl path into active
                service pages across the AdForge directory.
              </p>
            </div>

            <div className="compactSeoLinks">
              {latestPages.map((page) => (
                <Link href={`/seo/${page.slug}`} key={page.slug}>
                  {cleanTitle(page)}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="faqSection">
          <div className="sectionIntro wide">
            <span>COMMON QUESTIONS</span>
            <h2>Mobile tyre and recovery FAQs.</h2>
            <p>
              Helpful answers for customers searching for emergency tyre fitting,
              recovery and roadside assistance.
            </p>
          </div>

          <div className="faqGrid">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}<b>+</b></summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="businessCta">
          <div>
            <span>FOR LOCAL BUSINESSES</span>
            <h2>List your business free on AdForge.</h2>
            <p>
              Create a public business listing and upgrade later to advertising
              tools or the AdForge AI receptionist.
            </p>
          </div>

          <Link href="/signup" className="businessButton">
            Create Free Listing
            <span>→</span>
          </Link>
        </section>

        <footer className="footer">
          <div className="footerBrand">
            Ad<span>Forge</span>
          </div>

          <p>
            Mobile tyre fitting, vehicle recovery and trusted local services
            across Liverpool, Wirral and Merseyside.
          </p>

          <div className="footerLinks">
            <Link href="/services/mobile-tyre-fitting">Mobile Tyres</Link>
            <Link href="/services/vehicle-recovery">Vehicle Recovery</Link>
            <Link href="/businesses">Businesses</Link>
            <Link href="/signup">List Business Free</Link>
          </div>

          <small>© 2026 AdForge</small>
        </footer>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <style>{`
        :root {
          --green: #32ff73;
          --black: #000;
          --panel: #07090c;
          --panel2: #0b0e12;
          --line: rgba(255,255,255,.12);
          --muted: #9ca2aa;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--black);
        }

        body {
          margin: 0;
          background: var(--black);
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 12% 18%, rgba(50,255,115,.05), transparent 24%),
            #000;
        }

        .siteHeader {
          position: absolute;
          z-index: 30;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(calc(100% - 48px), 1380px);
          min-height: 94px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logoBox {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50,255,115,.4);
          border-radius: 14px;
          color: var(--green);
          font-style: italic;
          font-weight: 1000;
          font-size: 18px;
        }

        .logoText {
          display: flex;
          flex-direction: column;
          line-height: .9;
        }

        .logoText strong {
          font-size: 24px;
          letter-spacing: -1.8px;
        }

        .logoText strong span {
          color: var(--green);
        }

        .logoText small {
          margin-top: 8px;
          color: #7f858d;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .desktopNav {
          display: flex;
          gap: 8px;
        }

        .desktopNav a {
          padding: 11px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 850;
          color: #d7dade;
        }

        .desktopNav a:hover {
          color: var(--green);
          background: rgba(255,255,255,.04);
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .callTop {
          min-width: 166px;
          min-height: 58px;
          padding: 8px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.17);
          border-radius: 18px;
          background: rgba(5,7,10,.82);
          backdrop-filter: blur(16px);
        }

        .callTop span {
          color: var(--green);
          font-size: 8px;
          letter-spacing: 2.4px;
          font-weight: 950;
        }

        .callTop strong {
          margin-top: 4px;
          font-size: 14px;
        }

        .listTop {
          min-height: 48px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          border-radius: 999px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .mobileNav {
          display: none;
        }

        .hero {
          position: relative;
          min-height: 860px;
          display: flex;
          align-items: flex-end;
        }

        .heroMedia {
          position: absolute;
          inset: 0;
          background-image: url("/images/hero-recovery.png");
          background-size: cover;
          background-position: center 26%;
        }

        .heroOverlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(0,0,0,.58) 0%, rgba(0,0,0,.24) 52%, rgba(0,0,0,.08) 100%),
            linear-gradient(180deg, rgba(0,0,0,.02) 0%, rgba(0,0,0,.08) 56%, rgba(0,0,0,.82) 86%, #000 100%);
        }

        .heroGrid {
          position: relative;
          z-index: 3;
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          padding: 170px 0 74px;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, .65fr);
          align-items: end;
          gap: 60px;
        }

        .heroCopy {
          max-width: 760px;
        }

        .eyebrow {
          width: max-content;
          max-width: 100%;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(50,255,115,.42);
          border-radius: 999px;
          background: rgba(4,8,5,.66);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.2px;
        }

        .eyebrow span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 18px rgba(50,255,115,.85);
        }

        .hero h1 {
          margin: 18px 0 0;
          max-width: 700px;
          font-size: clamp(48px, 5.4vw, 78px);
          line-height: .92;
          letter-spacing: -4px;
          font-weight: 1000;
        }

        .hero h1 span {
          display: block;
          color: var(--green);
        }

        .heroLead {
          max-width: 700px;
          margin: 24px 0 0;
          color: #c3c7cc;
          font-size: 17px;
          line-height: 1.72;
        }

        .heroActions {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 52px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border-radius: 13px;
          font-size: 11px;
          font-weight: 950;
        }

        .primaryCta {
          min-width: 174px;
          background: var(--green);
          color: #031006;
        }

        .secondaryCta {
          min-width: 170px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(4,6,8,.8);
        }

        .heroPanel {
          padding: 28px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 24px;
          background: rgba(6,9,12,.8);
          backdrop-filter: blur(22px);
          box-shadow: 0 30px 90px rgba(0,0,0,.45);
        }

        .panelKicker {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .statusRow {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid var(--line);
        }

        .statusRow span {
          color: #858b93;
          font-size: 11px;
        }

        .statusRow strong {
          font-size: 12px;
          text-align: right;
        }

        .available {
          color: var(--green);
        }

        .panelCall {
          min-height: 52px;
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 12px;
          font-weight: 950;
        }

        .stats {
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--panel);
        }

        .stats div {
          min-height: 105px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--line);
        }

        .stats div:last-child {
          border-right: 0;
        }

        .stats strong {
          color: var(--green);
          font-size: 24px;
        }

        .stats span {
          margin-top: 4px;
          color: #8f959d;
          font-size: 11px;
        }

        .services,
        .popularSeo,
        .splitServices,
        .keywordContent,
        .featured,
        .latestSeoPages,
        .faqSection,
        .areas,
        .businessCta,
        .footer {
          width: min(calc(100% - 56px), 1280px);
          margin-left: auto;
          margin-right: auto;
        }

        .services {
          padding: 110px 0 45px;
          display: grid;
          grid-template-columns: .72fr 1.28fr;
          gap: 80px;
        }

        .sectionIntro > span,
        .splitKicker,
        .featuredKicker,
        .businessCta > div > span {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.8px;
        }

        .sectionIntro h2 {
          margin: 16px 0 0;
          font-size: clamp(44px, 5vw, 72px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .sectionIntro p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .serviceStack {
          display: grid;
          gap: 12px;
        }

        .serviceRow {
          min-height: 132px;
          padding: 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--panel);
        }

        .serviceRow:hover {
          border-color: rgba(50,255,115,.42);
          transform: translateY(-2px);
        }

        .serviceNumber {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50,255,115,.36);
          border-radius: 17px;
          color: var(--green);
          font-size: 15px;
          font-weight: 950;
        }

        .serviceWords h3 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -1px;
        }

        .serviceWords p {
          margin: 8px 0 0;
          color: #91979f;
          font-size: 12px;
          line-height: 1.55;
        }

        .serviceArrow {
          color: var(--green);
          font-size: 25px;
        }

        .sectionIntro.wide {
          max-width: 820px;
        }

        .popularSeo {
          padding: 90px 0 20px;
        }

        .recoveryPopular {
          padding-top: 75px;
        }

        .seoLinkGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .seoLinkGrid a {
          min-height: 62px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--panel);
          font-size: 11px;
          font-weight: 850;
        }

        .seoLinkGrid a:hover {
          border-color: rgba(50,255,115,.42);
        }

        .seoLinkGrid b {
          color: var(--green);
          font-size: 17px;
        }

        .viewAllSeo {
          width: max-content;
          max-width: 100%;
          min-height: 48px;
          margin-top: 20px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 26px;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .latestSeoPages,
        .faqSection {
          padding: 90px 0 20px;
        }

        .compactSeoLinks {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .compactSeoLinks a {
          padding: 11px 14px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--panel);
          font-size: 10px;
          font-weight: 800;
        }

        .faqGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .faqGrid details {
          margin-top: 0;
          align-self: start;
        }

        .faqGrid p {
          margin: 0;
          padding: 0 17px 17px;
          color: #9da3aa;
          font-size: 11px;
          line-height: 1.65;
        }


        .keywordContent {
          padding: 85px 0 10px;
        }

        .recoveryKeywordContent {
          padding-top: 72px;
        }

        .keywordBoxGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .keywordBox {
          margin-top: 0;
          align-self: start;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: var(--panel);
        }

        .keywordBox[open] {
          border-color: rgba(50,255,115,.34);
          background:
            radial-gradient(circle at 92% 8%, rgba(50,255,115,.06), transparent 27%),
            var(--panel);
        }

        .keywordBox summary {
          min-height: 68px;
          padding: 0 18px;
          gap: 20px;
          font-size: 12px;
          line-height: 1.35;
        }

        .keywordBox summary span {
          text-transform: capitalize;
        }

        .keywordBox[open] summary b {
          transform: rotate(45deg);
        }

        .keywordBox summary b {
          flex: 0 0 auto;
          transition: transform .2s ease;
        }

        .keywordParagraphs {
          padding: 0 17px 18px;
        }

        .keywordBox p {
          margin: 0 0 14px;
          padding: 0 18px 20px;
          color: #a2a8af;
          font-size: 12px;
          line-height: 1.75;
        }

        .keywordBox p:last-child {
          margin-bottom: 0;
        }

        .keywordSectionActions {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .splitServices {
          padding: 75px 0 25px;
          display: grid;
          gap: 22px;
        }

        .splitCard {
          min-height: 560px;
          display: grid;
          grid-template-columns: 45% 55%;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 26px;
          background: var(--panel);
        }

        .recoveryCard {
          grid-template-columns: 55% 45%;
        }

        .splitImage {
          min-height: 560px;
          background-size: cover;
          background-position: center;
        }

        .tyrePhoto {
          background-image: url("/images/mobile-tyre-fitting.jpg");
        }

        .recoveryPhoto {
          background-image: url("/images/recovery-truck.jpg");
        }

        .splitContent {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .splitContent h2 {
          margin: 16px 0 0;
          font-size: clamp(42px, 4.8vw, 68px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .splitContent > p {
          margin: 22px 0 0;
          color: #a4a9b0;
          font-size: 14px;
          line-height: 1.72;
        }

        details {
          margin-top: 22px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: #050608;
        }

        summary {
          min-height: 56px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          list-style: none;
          font-size: 12px;
          font-weight: 900;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        summary b {
          color: var(--green);
          font-size: 19px;
        }

        .detailGrid {
          padding: 0 17px 17px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          color: #d7dade;
          font-size: 11px;
        }

        .splitActions {
          margin-top: 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .smallGreen,
        .smallDark {
          min-height: 48px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 950;
        }

        .smallGreen {
          background: var(--green);
          color: #031006;
        }

        .smallDark {
          border: 1px solid rgba(50,255,115,.3);
          background: #050608;
        }

        .featured {
          margin-top: 95px;
          display: grid;
          grid-template-columns: 46% 54%;
          overflow: hidden;
          border: 1px solid rgba(50,255,115,.46);
          border-radius: 28px;
          background: var(--panel);
        }

        .featuredMedia {
          position: relative;
          min-height: 620px;
          overflow: hidden;
        }

        .featuredMedia img {
          width: 100%;
          height: 100%;
          min-height: 620px;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .featuredBadge {
          position: absolute;
          z-index: 2;
          top: 26px;
          left: 26px;
          padding: 11px 16px;
          border: 1px solid rgba(50,255,115,.5);
          border-radius: 999px;
          background: rgba(7,9,12,.9);
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2px;
        }

        .featuredCopy {
          padding: 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .featuredCopy h2 {
          margin: 16px 0 0;
          font-size: clamp(42px, 4.8vw, 68px);
          line-height: .94;
          letter-spacing: -4px;
        }

        .featuredCopy h3 {
          margin: 14px 0 0;
          color: var(--green);
          font-size: 22px;
        }

        .featuredCopy > p {
          margin: 21px 0 0;
          color: #a6abb2;
          font-size: 13px;
          line-height: 1.72;
        }

        .featureList {
          margin-top: 23px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
          font-size: 11px;
          font-weight: 850;
        }

        .coverage {
          margin-top: 23px;
          padding: 14px 16px;
          border: 1px solid var(--line);
          border-radius: 13px;
          color: #aeb3b9;
          font-size: 11px;
        }

        .coverage strong {
          color: #fff;
        }

        .featuredActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 10px;
        }

        .featuredPrimary,
        .featuredSecondary {
          min-height: 52px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 950;
        }

        .featuredPrimary {
          background: var(--green);
          color: #031006;
        }

        .featuredSecondary {
          border: 1px solid rgba(50,255,115,.3);
          background: #050608;
        }

        .areas {
          padding: 110px 0 45px;
        }

        .areaGrid {
          margin-top: 34px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .areaGrid a {
          min-height: 58px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--panel);
          font-size: 11px;
          font-weight: 850;
        }

        .areaGrid span {
          color: var(--green);
        }

        .businessCta {
          margin-top: 85px;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          border: 1px solid rgba(50,255,115,.34);
          border-radius: 26px;
          background:
            radial-gradient(circle at 88% 12%, rgba(50,255,115,.1), transparent 28%),
            var(--panel);
        }

        .businessCta > div {
          max-width: 760px;
        }

        .businessCta h2 {
          margin: 14px 0 0;
          font-size: clamp(38px, 4vw, 58px);
          line-height: .95;
          letter-spacing: -3px;
        }

        .businessCta p {
          margin: 17px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .businessButton {
          min-width: 205px;
          min-height: 52px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .footer {
          margin-top: 95px;
          padding: 45px 0 40px;
          border-top: 1px solid var(--line);
        }

        .footerBrand {
          font-size: 30px;
          font-weight: 1000;
          letter-spacing: -2px;
        }

        .footerBrand span {
          color: var(--green);
        }

        .footer p {
          max-width: 620px;
          color: #8e949b;
          font-size: 12px;
          line-height: 1.65;
        }

        .footerLinks {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 22px;
        }

        .footerLinks a {
          font-size: 11px;
          font-weight: 800;
        }

        .footer small {
          display: block;
          margin-top: 34px;
          color: #666b72;
          font-size: 9px;
        }

        @media (max-width: 1160px) {
          .desktopNav {
            display: none;
          }

          .heroGrid {
            grid-template-columns: 1fr;
          }

          .heroPanel {
            max-width: 520px;
          }

          .services {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 980px) {
          .siteHeader {
            width: calc(100% - 36px);
          }

          .listTop {
            display: none;
          }

          .mobileNav {
            position: absolute;
            z-index: 29;
            top: 94px;
            left: 0;
            width: 100%;
            padding: 0 18px 12px;
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .mobileNav::-webkit-scrollbar {
            display: none;
          }

          .mobileNav a {
            min-height: 44px;
            padding: 0 18px;
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            border: 1px solid rgba(255,255,255,.16);
            border-radius: 999px;
            background: rgba(5,7,9,.84);
            backdrop-filter: blur(16px);
            font-size: 10px;
            font-weight: 850;
          }

          .splitCard,
          .recoveryCard,
          .featured {
            grid-template-columns: 1fr;
          }

          .recoveryCard .splitImage {
            order: -1;
          }

          .areaGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 760px) {
          .siteHeader {
            top: 0;
            left: 0;
            transform: none;
            width: 100%;
            min-height: 90px;
            padding: 12px 18px;
          }

          .logoBox {
            width: 42px;
            height: 42px;
            font-size: 15px;
          }

          .logoText strong {
            font-size: 20px;
          }

          .logoText small {
            font-size: 5px;
            letter-spacing: 1.6px;
          }

          .callTop {
            min-width: 146px;
            min-height: 54px;
            padding: 7px 11px;
          }

          .callTop span {
            font-size: 7px;
          }

          .callTop strong {
            font-size: 12px;
          }

          .mobileNav {
            top: 90px;
          }

          .hero {
            min-height: 820px;
          }

          .heroMedia {
            background-position: 58% 20%;
          }

          .heroOverlay {
            background:
              linear-gradient(180deg, rgba(0,0,0,.02) 0%, rgba(0,0,0,.07) 44%, rgba(0,0,0,.62) 76%, #000 100%);
          }

          .heroGrid {
            width: 100%;
            padding: 160px 20px 36px;
            gap: 24px;
          }

          .eyebrow {
            padding: 9px 13px;
            font-size: 7px;
            letter-spacing: 1.8px;
          }

          .hero h1 {
            margin-top: 14px;
            max-width: 560px;
            font-size: 39px;
            line-height: .95;
            letter-spacing: -2.5px;
          }

          .heroLead {
            width: 92%;
            max-width: 560px;
            margin-top: 14px;
            font-size: 12px;
            line-height: 1.62;
          }

          .heroActions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .primaryCta {
            grid-column: 1 / -1;
          }

          .primaryCta,
          .secondaryCta {
            min-width: 0;
            min-height: 48px;
            padding: 0 14px;
            font-size: 10px;
          }

          .heroPanel {
            display: none;
          }

          .stats,
          .services,
          .popularSeo,
          .splitServices,
          .keywordContent,
          .featured,
          .latestSeoPages,
          .faqSection,
          .areas,
          .businessCta,
          .footer {
            width: calc(100% - 34px);
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .stats div {
            min-height: 88px;
            border-bottom: 1px solid var(--line);
          }

          .stats div:nth-child(2) {
            border-right: 0;
          }

          .stats div:nth-child(3),
          .stats div:nth-child(4) {
            border-bottom: 0;
          }

          .services {
            padding-top: 80px;
          }

          .sectionIntro h2 {
            font-size: 44px;
            letter-spacing: -3px;
          }

          .serviceRow {
            min-height: 112px;
            padding: 17px;
            gap: 15px;
          }

          .serviceNumber {
            width: 50px;
            height: 50px;
          }

          .serviceWords h3 {
            font-size: 20px;
          }

          .serviceWords p {
            font-size: 10px;
          }

          .sectionIntro.wide {
          max-width: 820px;
        }

        .popularSeo {
          padding: 90px 0 20px;
        }

        .recoveryPopular {
          padding-top: 75px;
        }

        .seoLinkGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .seoLinkGrid a {
          min-height: 62px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: var(--panel);
          font-size: 11px;
          font-weight: 850;
        }

        .seoLinkGrid a:hover {
          border-color: rgba(50,255,115,.42);
        }

        .seoLinkGrid b {
          color: var(--green);
          font-size: 17px;
        }

        .viewAllSeo {
          width: max-content;
          max-width: 100%;
          min-height: 48px;
          margin-top: 20px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 26px;
          border-radius: 13px;
          background: var(--green);
          color: #031006;
          font-size: 11px;
          font-weight: 950;
        }

        .latestSeoPages,
        .faqSection {
          padding: 90px 0 20px;
        }

        .compactSeoLinks {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .compactSeoLinks a {
          padding: 11px 14px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--panel);
          font-size: 10px;
          font-weight: 800;
        }

        .faqGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .faqGrid details {
          margin-top: 0;
          align-self: start;
        }

        .faqGrid p {
          margin: 0;
          padding: 0 17px 17px;
          color: #9da3aa;
          font-size: 11px;
          line-height: 1.65;
        }

        .splitServices {
            padding-top: 55px;
          }

          .splitImage {
            min-height: 300px;
          }

          .splitContent {
            padding: 30px 21px;
          }

          .splitContent h2 {
            font-size: 40px;
            letter-spacing: -3px;
          }

          .splitContent > p {
            font-size: 12px;
          }

          .detailGrid {
            grid-template-columns: 1fr;
          }

          .featured {
            margin-top: 65px;
          }

          .featuredMedia,
          .featuredMedia img {
            min-height: 310px;
            max-height: 350px;
          }

          .featuredCopy {
            padding: 30px 21px;
          }

          .featuredCopy h2 {
            font-size: 40px;
            letter-spacing: -3px;
          }

          .featuredCopy h3 {
            font-size: 19px;
          }

          .featureList {
            grid-template-columns: 1fr;
          }

          .featuredActions {
            grid-template-columns: 1fr;
          }

          .areas {
            padding-top: 85px;
          }

          .areaGrid {
            grid-template-columns: 1fr 1fr;
          }

          .businessCta {
            margin-top: 65px;
            padding: 30px 21px;
            display: block;
          }

          .businessCta h2 {
            font-size: 40px;
          }

          .businessButton {
            width: 100%;
            min-width: 0;
            margin-top: 24px;
          }

          .footer {
            margin-top: 72px;
          }
        }

        @media (max-width: 430px) {
          .logoBox {
            display: none;
          }

          .callTop {
            min-width: 142px;
          }

          .hero h1 {
            font-size: 37px;
          }

          .heroLead {
            width: 92%;
          }

          .heroActions {
            grid-template-columns: 1fr;
          }

          .primaryCta {
            grid-column: auto;
          }

          .areaGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
