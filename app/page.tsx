import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const HOME_SEO = Object.freeze({
  title: "24 Hour Mobile Tyre Fitting &  Recovery Service Liverpool | AdForge",
  h1: "24 Hour Mobile Tyre Fitting & Recovery Service Liverpool",
  description:
    "Find 24-hour mobile tyre fitting, emergency tyre repair, puncture repairs, locking wheel nut removal, wheel balancing, new and part-worn tyres, breakdown recovery, vehicle recovery, roadside assistance and emergency call-outs across Liverpool, Wirral and Merseyside.",
  canonical: "https://adforge.uk/",
} as const);

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
        alt: "24 Hour Mobile Tyre Fitting and Recovery service by AdForge",
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



        <section className="expandedLocalServices">
          <div className="expandedServicesIntro">
            <span>24 HOUR LOCAL SERVICES</span>
            <p>
              We provide mobile tyre fitting and vehicle recovery services across
              Liverpool and surrounding areas. Open either service below for detailed
              information about the help we provide throughout Liverpool, Wirral,
              Merseyside and nearby towns.
            </p>
          </div>

          <div className="expandedServiceGrid">
            <details className="expandedServiceBox tyreExpanded">
              <summary>
                <div>
                  <span className="expandedServiceKicker">MOBILE TYRE SERVICES</span>
                  <strong>24 Hour Mobile Tyre Fitting</strong>
                  <small>
                    Emergency tyres, puncture repairs, roadside tyre replacement and
                    mobile fitting across Liverpool and surrounding areas.
                  </small>
                </div>
                <b>+</b>
              </summary>

              <div className="expandedServiceBody">
                <h3>24 hour mobile tyre fitting across Liverpool and surrounding areas</h3>
                <p>
                  We provide 24-hour mobile tyre fitting across Liverpool and surrounding
                  areas for drivers who need fast help with a flat tyre, puncture, tyre
                  blowout, damaged sidewall, sudden pressure loss or an unsafe tyre that
                  cannot be driven on. Our mobile tyre service is designed to bring tyre
                  fitting directly to the vehicle, whether the customer is at home, at
                  work, in a public car park, outside a business, on a residential street
                  or at a suitable roadside location. We provide mobile tyre fitting
                  throughout Liverpool City Centre, Anfield, Everton, Walton, Kirkdale,
                  Wavertree, Toxteth, Aigburth, Allerton, Childwall, West Derby, Knotty
                  Ash, Dovecot, Belle Vale, Speke, Garston and Hunts Cross, as well as
                  surrounding Merseyside areas.
                </p>

                <p>
                  We provide emergency mobile tyre fitting when a vehicle cannot be moved
                  safely because the tyre has lost pressure completely or has suffered
                  serious damage. A mobile tyre fitter can attend the vehicle with the
                  equipment required to remove the damaged tyre and fit a suitable
                  replacement at the customer's location. This can avoid the need to
                  arrange recovery to a fixed tyre garage simply because of a tyre fault.
                  We provide emergency tyre call-outs during the day, in the evening and
                  out of hours across Liverpool and nearby areas, subject to fitter
                  availability, tyre size and stock.
                </p>

                <h3>Emergency tyre replacement and roadside tyre assistance</h3>
                <p>
                  We provide emergency tyre replacement across Liverpool for customers
                  dealing with punctures that cannot be repaired, split sidewalls, impact
                  damage, tyre blowouts, exposed cords, severe tread damage or tyres that
                  are no longer safe for road use. Roadside tyre replacement can be
                  arranged at suitable locations near Liverpool City Centre, Queens Drive,
                  Edge Lane, Prescot Road, Aigburth Road, Smithdown Road, Speke Boulevard,
                  the A59, A561, A580, M57 and M62. If a tyre fails on a fast road, drivers
                  should move to the safest available position and stay away from moving
                  traffic while assistance is arranged.
                </p>

                <p>
                  We provide roadside mobile tyre assistance throughout Liverpool,
                  Bootle, Huyton, Kirkby, Prescot, Whiston, Halewood, Aintree, Crosby,
                  Wallasey, Birkenhead, Widnes, Runcorn, St Helens and surrounding areas.
                  Customers should provide the exact road name, postcode, direction of
                  travel or live location where possible. Accurate location information
                  is particularly important on long roads, industrial estates, motorway
                  approaches and large retail parks where a postcode alone may cover a
                  wide area.
                </p>

                <h3>Puncture repairs and flat tyre help</h3>
                <p>
                  We provide puncture repair assistance across Liverpool and surrounding
                  areas when the tyre remains suitable for a safe repair. A small puncture
                  within the repairable tread area may sometimes be repaired, but damage
                  close to the shoulder or sidewall, internal damage caused by driving on
                  a flat tyre, large holes, exposed cords or badly worn tread can mean the
                  tyre needs to be replaced instead. We provide mobile puncture checks,
                  slow-puncture assistance and flat tyre help so the problem can be
                  assessed at the vehicle's location rather than requiring the customer
                  to drive on a tyre that may be unsafe.
                </p>

                <p>
                  Slow pressure loss is not always caused by a nail or screw. Leaking
                  valves, wheel-rim corrosion, poor bead sealing and previous damage can
                  also cause a tyre to lose air repeatedly. We provide mobile tyre fitting
                  and tyre fault assistance across Liverpool, Wirral and Merseyside, and
                  customers should explain how quickly the tyre is losing pressure,
                  whether the vehicle has been driven while flat and whether any visible
                  damage can be seen. A clear photograph of the tyre and sidewall markings
                  can also help identify the tyre size and likely service required.
                </p>

                <h3>New tyres, part-worn tyres and replacement tyres</h3>
                <p>
                  We provide new tyre fitting across Liverpool for cars, vans, taxis,
                  private-hire vehicles, SUVs and suitable light commercial vehicles.
                  Depending on tyre size and availability, customers may be able to choose
                  from budget, mid-range and premium replacement tyres. The correct tyre
                  should match the required width, profile, wheel diameter, load rating
                  and speed rating for the vehicle. We provide mobile new tyre fitting at
                  homes, workplaces and suitable roadside locations across Liverpool and
                  nearby Merseyside towns, helping customers replace an unsafe tyre
                  without first travelling to a tyre centre.
                </p>

                <p>
                  We also provide access to part-worn tyre fitting for selected sizes
                  where suitable stock is available. Part-worn tyres can offer a lower-cost
                  replacement option, but the tyre still needs to be suitable for road use
                  and free from dangerous structural damage. We provide mobile part-worn
                  tyres across Liverpool and surrounding areas subject to stock, size and
                  specification. Customers should provide the complete tyre size shown on
                  the sidewall so the available new or part-worn options can be checked
                  before a fitter travels.
                </p>

                <h3>Home tyre fitting and workplace mobile tyres</h3>
                <p>
                  We provide home mobile tyre fitting throughout Liverpool for customers
                  who discover a flat tyre, damaged tyre or slow puncture while the vehicle
                  is parked outside their house or on a driveway. Home tyre fitting can be
                  useful before work, before a long journey or when the vehicle has been
                  parked overnight and is no longer safe to drive. We provide mobile tyre
                  services throughout Anfield, Everton, Walton, West Derby, Childwall,
                  Allerton, Aigburth, Wavertree, Speke, Garston and surrounding
                  neighbourhoods, subject to safe access around the vehicle.
                </p>

                <p>
                  We provide workplace tyre fitting throughout Liverpool for employees,
                  tradespeople, taxi drivers, couriers, delivery drivers and local
                  businesses. A tyre problem may be noticed after arriving at work or when
                  preparing to leave at the end of a shift. Where there is enough safe
                  working space, we can arrange mobile tyre fitting at offices, industrial
                  estates, depots, warehouses, retail parks and commercial premises
                  across Liverpool, Bootle, Knowsley, Speke, Garston, Huyton and nearby
                  business areas.
                </p>

                <h3>Locking wheel nut removal and wheel problems</h3>
                <p>
                  We provide assistance with selected locking wheel nut problems when a
                  tyre cannot be removed because the locking key has been lost, damaged or
                  rounded. Customers should check the glovebox, boot, spare-wheel area and
                  original vehicle tool kit before requesting locking wheel nut removal.
                  If the key cannot be found, the customer should mention this when
                  arranging mobile tyre fitting so suitable removal equipment can be
                  considered. We provide locking wheel nut assistance alongside emergency
                  tyre replacement across Liverpool and surrounding Merseyside areas,
                  depending on the vehicle, wheel design and condition of the locking nut.
                </p>

                <p>
                  Seized, rounded or overtightened wheel bolts can also prevent a normal
                  tyre change. Attempting to remove damaged wheel fixings with unsuitable
                  tools can make the problem worse. We provide mobile tyre assistance for
                  many common wheel and tyre issues, although severe wheel damage or badly
                  seized fixings may require specialist workshop equipment or vehicle
                  recovery. Customers should describe any previous unsuccessful removal
                  attempts when calling so the situation can be assessed properly.
                </p>

                <h3>Wheel balancing, tyre pressure and tyre safety</h3>
                <p>
                  We provide mobile tyre fitting with wheel balancing where suitable
                  equipment and the selected provider allow it. Wheel imbalance can cause
                  vibration through the steering wheel or vehicle, particularly at higher
                  speeds, and may contribute to uneven tyre wear. Wheel balancing is
                  different from wheel alignment, so a vehicle that pulls to one side or
                  continues to wear tyres unevenly may need a separate wheel-alignment
                  inspection at an appropriately equipped premises.
                </p>

                <p>
                  We provide tyre replacement and tyre safety assistance for drivers who
                  notice low pressure, cracking, bulges, exposed cords, uneven wear or
                  insufficient tread. Tyre condition directly affects braking, steering
                  and road grip, particularly in wet conditions. Drivers across Liverpool,
                  Wirral and Merseyside should avoid continuing to use a tyre that is
                  visibly damaged or repeatedly losing pressure. A mobile tyre service can
                  inspect the immediate problem and arrange a suitable repair or
                  replacement where possible.
                </p>

                <h3>Mobile tyres for cars, vans, taxis and commercial vehicles</h3>
                <p>
                  We provide mobile car tyre fitting across Liverpool for everyday family
                  cars, company vehicles, taxis and private-hire vehicles. We also provide
                  van tyre fitting for suitable light commercial vehicles, where the
                  correct load-rated tyre is available. Van and commercial tyres can have
                  different load requirements from standard passenger-car tyres, so the
                  complete tyre specification and vehicle details should be provided
                  before attendance. Taxi and private-hire drivers can also request urgent
                  tyre assistance to reduce time off the road when a puncture or damaged
                  tyre interrupts a shift.
                </p>

                <p>
                  We provide mobile tyre services across Liverpool and surrounding areas
                  including Wirral, Birkenhead, Wallasey, Bootle, Sefton, Crosby, Formby,
                  Huyton, Kirkby, Knowsley, Prescot, Whiston, Halewood, Widnes, Runcorn,
                  St Helens, Rainhill, Haydock and nearby parts of Merseyside and the North
                  West. Coverage and response times vary according to the exact location,
                  traffic, fitter availability and tyre stock, so customers should provide
                  their postcode, vehicle details and complete tyre size when requesting
                  assistance.
                </p>

                <h3>What we need when you request mobile tyre fitting</h3>
                <p>
                  When requesting mobile tyre fitting in Liverpool, customers should
                  provide the exact location, contact number, vehicle registration, make
                  and model, complete tyre size and a clear explanation of the fault. It is
                  also useful to confirm whether the tyre is completely flat, whether the
                  wheel is visibly damaged, whether the vehicle has been driven since the
                  tyre lost pressure and whether the locking wheel nut key is available.
                  This information helps us arrange the right local mobile tyre support and
                  reduces delays caused by missing tyre or vehicle details.
                </p>

                <p>
                  We provide 24-hour mobile tyre fitting, emergency tyre call-outs,
                  puncture repairs, flat tyre assistance, roadside tyre replacement, new
                  tyres, part-worn tyres, locking wheel nut assistance and mobile tyre
                  support across Liverpool and surrounding areas. Whether a tyre problem
                  happens at home, at work, in a car park or during a journey, AdForge
                  helps connect the enquiry with suitable local support so the customer
                  can arrange the service required at their location.
                </p>

                <div className="expandedServiceActions">
                  <Link href="/services/mobile-tyre-fitting" className="smallGreen">
                    View Mobile Tyre Services
                  </Link>
                  <a href={`tel:${PHONE}`} className="smallDark">
                    Call For Tyre Assistance
                  </a>
                </div>
              </div>
            </details>

            <details className="expandedServiceBox recoveryExpanded">
              <summary>
                <div>
                  <span className="expandedServiceKicker">RECOVERY SERVICES</span>
                  <strong>24 Hour Vehicle Recovery</strong>
                  <small>
                    Breakdown recovery, accident recovery, towing, roadside assistance
                    and vehicle transport across Liverpool and surrounding areas.
                  </small>
                </div>
                <b>+</b>
              </summary>

              <div className="expandedServiceBody">
                <h3>24 hour vehicle recovery across Liverpool and surrounding areas</h3>
                <p>
                  We provide 24-hour vehicle recovery across Liverpool and surrounding
                  areas for drivers whose cars or vans cannot be driven safely. Recovery
                  may be needed after a mechanical breakdown, electrical failure,
                  overheating problem, clutch fault, gearbox issue, steering problem,
                  accident damage, flat battery or another fault that leaves the vehicle
                  immobilised. We provide recovery from homes, workplaces, car parks,
                  business premises and suitable roadside locations throughout Liverpool
                  City Centre, Anfield, Everton, Walton, Kirkdale, Wavertree, Toxteth,
                  Aigburth, Allerton, Childwall, West Derby, Speke, Garston and nearby
                  Merseyside areas.
                </p>

                <p>
                  We provide emergency recovery during the day, overnight, at weekends and
                  on bank holidays, subject to local operator availability. The vehicle
                  can be collected and transported to an agreed garage, repair centre,
                  dealership, storage location, home address or another suitable
                  destination. Customers should provide the exact pickup location,
                  vehicle make and model, registration, nature of the fault and intended
                  destination so the correct type of recovery support can be arranged
                  before a truck is dispatched.
                </p>

                <h3>Breakdown recovery and roadside collection</h3>
                <p>
                  We provide breakdown recovery across Liverpool when a vehicle will not
                  start, loses power, overheats or develops a fault that makes continued
                  driving unsafe. Common reasons for recovery include alternator failure,
                  starter-motor problems, clutch failure, gearbox faults, cooling-system
                  problems, engine warning lights, fuel-system issues, electrical faults
                  and suspension damage. Even when a vehicle still starts, it may not be
                  safe to continue driving, and recovery can prevent a small fault from
                  becoming a more expensive mechanical problem.
                </p>

                <p>
                  We provide breakdown collection from residential roads, office car
                  parks, industrial estates, retail parks, depots and safe roadside
                  locations across Liverpool. We also provide recovery around Bootle,
                  Huyton, Kirkby, Prescot, Whiston, Halewood, Widnes, Runcorn, St Helens,
                  Wirral, Wallasey, Birkenhead and surrounding parts of Merseyside. The
                  exact recovery method depends on the vehicle, access, wheel condition
                  and whether the vehicle can roll, steer and brake normally.
                </p>

                <h3>Roadside assistance and non-starting vehicles</h3>
                <p>
                  We provide roadside assistance in Liverpool for vehicles that have
                  stopped unexpectedly or will not restart. Depending on the fault and
                  provider, roadside assistance may include basic checks, a battery jump
                  start, help with a flat battery or minor assistance that allows the
                  vehicle to move to a safer place. When a safe roadside repair is not
                  possible, we provide recovery so the vehicle can be transported to a
                  garage or another agreed destination rather than repeatedly attempting
                  to drive a vehicle with an unresolved fault.
                </p>

                <p>
                  We provide recovery for non-starting cars and vans at homes, workplaces,
                  hotels, shopping centres, public car parks and business premises across
                  Liverpool and surrounding areas. Customers should explain what happened
                  before the vehicle stopped, whether any warning lights are displayed,
                  whether the engine turns over and whether there are unusual noises,
                  smoke or fluid leaks. This information helps identify whether roadside
                  assistance may be suitable or whether vehicle recovery is likely to be
                  required.
                </p>

                <h3>Accident recovery and damaged vehicle transport</h3>
                <p>
                  We provide accident recovery across Liverpool when a vehicle has been
                  damaged in a collision and cannot be driven safely. Collision damage can
                  affect steering, suspension, wheels, tyres, cooling systems, lights,
                  airbags and bodywork even when the engine still runs. A damaged vehicle
                  should not be driven simply because it can move under its own power.
                  Once the scene is safe and any emergency-service requirements have been
                  completed, recovery can be arranged to a body shop, garage, storage
                  facility, insurance-approved repair centre or home address.
                </p>

                <p>
                  We provide damaged vehicle recovery throughout Liverpool City Centre and
                  surrounding districts, as well as nearby Merseyside areas including
                  Bootle, Sefton, Huyton, Knowsley, Kirkby, Prescot, Whiston, Widnes,
                  Runcorn, St Helens, Wirral, Birkenhead and Wallasey. Customers should
                  mention whether any wheels are locked or damaged, whether fluids are
                  leaking, whether airbags have deployed and whether body panels are
                  obstructing the wheels, as these details can affect the loading method
                  and recovery equipment required.
                </p>

                <h3>Car recovery, van recovery and light commercial recovery</h3>
                <p>
                  We provide car recovery across Liverpool for family cars, company cars,
                  taxis, private-hire vehicles and other suitable passenger vehicles. A
                  vehicle may need recovery because of mechanical failure, accident
                  damage, electrical problems, a non-starting fault or because it simply
                  needs transporting to a garage. We provide local car recovery from
                  residential streets, business locations and roadside positions
                  throughout Liverpool and surrounding areas.
                </p>

                <p>
                  We provide van recovery for suitable light commercial vehicles used by
                  tradespeople, couriers, delivery drivers and local businesses. Vehicle
                  size, approximate weight and whether the van is carrying a load should
                  be confirmed before attendance because larger or heavily loaded vans may
                  require different recovery equipment. We provide van recovery around
                  Liverpool, Speke, Garston, Bootle, Knowsley, Huyton, Kirkby and nearby
                  commercial and industrial areas, subject to the vehicle being suitable
                  for the available recovery equipment.
                </p>

                <h3>Towing, flatbed recovery and vehicle transport</h3>
                <p>
                  We provide access to towing and vehicle recovery services for broken
                  down and non-running vehicles across Liverpool and surrounding areas.
                  The safest method depends on the vehicle and its condition. Some
                  automatic, electric, four-wheel-drive, low or accident-damaged vehicles
                  may need to be fully lifted or transported on a flatbed rather than
                  moved with wheels on the road. Flatbed recovery can also be suitable for
                  non-runners, damaged vehicles and planned transport where the vehicle
                  should not be driven.
                </p>

                <p>
                  We provide vehicle transport from Liverpool for customers who need a car
                  or van moved even when there has not been an emergency breakdown. This
                  can include garage-to-garage transport, auction collection, dealership
                  delivery, project-car transport, collection of a recently purchased
                  vehicle or movement of a non-runner between addresses. Customers should
                  provide the collection address, destination, vehicle condition and
                  access information, including whether the vehicle has keys and whether
                  it rolls and steers.
                </p>

                <h3>Motorway recovery and major road breakdowns</h3>
                <p>
                  We provide vehicle recovery near Liverpool's main motorway and major-road
                  routes, including the M62, M57, M58, A59, A580 East Lancashire Road,
                  A561, A562, Queens Drive and other major routes connecting Liverpool
                  with Knowsley, Sefton, St Helens, Widnes, Warrington, Wirral and the
                  wider North West. Motorway and high-speed-road breakdowns require extra
                  care, and drivers should move to the safest available location where
                  possible and follow official road-safety guidance before arranging
                  recovery.
                </p>

                <p>
                  When requesting motorway recovery, customers should provide the motorway
                  or road name, direction of travel, nearest junction, marker information,
                  emergency refuge area or live location. Accurate location details can
                  significantly reduce delays, particularly on long motorway sections or
                  roads that cross several local authority areas. We provide recovery near
                  Liverpool motorway connections and surrounding routes, subject to safe
                  access and operator availability.
                </p>

                <h3>Recovery from homes, workplaces and car parks</h3>
                <p>
                  We provide home vehicle recovery throughout Liverpool when a car or van
                  will not start, has developed a mechanical fault or needs transporting
                  to a garage. The vehicle should be accessible to the recovery truck and
                  customers should mention narrow roads, underground parking, height
                  restrictions, locked steering or missing keys before attendance. We
                  provide home recovery across Anfield, Everton, Walton, West Derby,
                  Wavertree, Childwall, Allerton, Aigburth, Speke, Garston and surrounding
                  Liverpool neighbourhoods.
                </p>

                <p>
                  We provide workplace and commercial recovery across Liverpool for
                  vehicles stranded at offices, industrial estates, depots, warehouses,
                  retail parks and business premises. Recovery can also be arranged from
                  public car parks and shopping areas where suitable access is available.
                  Large multi-storey or underground car parks may need different
                  arrangements if a standard recovery truck cannot enter, so customers
                  should describe any access restrictions when requesting assistance.
                </p>

                <h3>Local recovery and long-distance vehicle recovery</h3>
                <p>
                  We provide local recovery within Liverpool and surrounding areas, and
                  longer-distance vehicle transport may also be available by arrangement.
                  Local recovery can move a broken-down vehicle from a roadside location
                  to a nearby garage or home address, while long-distance recovery can
                  transport vehicles between towns, cities or regions. Pricing and
                  availability can depend on mileage, loading requirements, vehicle size,
                  waiting time and the equipment needed for the job.
                </p>

                <p>
                  We provide recovery across Liverpool and nearby areas including Bootle,
                  Aintree, Crosby, Huyton, Kirkby, Knowsley, Prescot, Whiston, Halewood,
                  Widnes, Runcorn, St Helens, Rainhill, Haydock, Wirral, Birkenhead,
                  Wallasey and surrounding Merseyside locations. Customers travelling
                  between two towns should provide the exact breakdown position rather
                  than only the nearest town name, especially when the vehicle is close to
                  a motorway junction or local boundary.
                </p>

                <h3>What we need when you request vehicle recovery</h3>
                <p>
                  When requesting recovery in Liverpool, customers should provide their
                  exact location, contact number, vehicle make and model, registration,
                  nature of the fault or damage and required destination. It is also
                  important to confirm whether the vehicle rolls, steers and brakes,
                  whether any tyres or wheels are damaged, whether the keys are available,
                  whether there are fluid leaks and whether the vehicle is in a restricted
                  or dangerous location. Complete information helps us arrange the right
                  local recovery support and avoid delays caused by unsuitable equipment.
                </p>

                <p>
                  We provide 24-hour vehicle recovery, breakdown recovery, accident
                  recovery, roadside assistance, car recovery, van recovery, towing,
                  flatbed recovery, non-runner transport and vehicle transport across
                  Liverpool and surrounding areas. Whether a vehicle fails at home, at
                  work, in a car park, on a local road or during a longer journey, AdForge
                  helps direct the enquiry towards suitable local recovery support across
                  Liverpool, Wirral, Merseyside and nearby North West areas.
                </p>

                <div className="expandedServiceActions">
                  <Link href="/services/vehicle-recovery" className="smallGreen">
                    View Vehicle Recovery Services
                  </Link>
                  <a href={`tel:${PHONE}`} className="smallDark">
                    Call For Recovery
                  </a>
                </div>
              </div>
            </details>
          </div>
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
              src="/images/totaltyres.jpeg"
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


        .expandedLocalServices {
          width: min(calc(100% - 56px), 1280px);
          margin: 0 auto;
          padding: 85px 0 20px;
        }

        .expandedServicesIntro {
          max-width: 820px;
          margin-bottom: 28px;
        }

        .expandedServicesIntro > span {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.8px;
        }

        .expandedServicesIntro p {
          margin: 14px 0 0;
          color: #9ca2aa;
          font-size: 14px;
          line-height: 1.75;
        }

        .expandedServiceGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
        }

        .expandedServiceBox {
          margin: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 22px;
          background:
            radial-gradient(circle at 92% 8%, rgba(50,255,115,.05), transparent 28%),
            #07090c;
        }

        .expandedServiceBox[open] {
          grid-column: 1 / -1;
          border-color: rgba(50,255,115,.38);
        }

        .expandedServiceBox summary {
          min-height: 176px;
          padding: 28px;
          align-items: flex-start;
          gap: 28px;
        }

        .expandedServiceBox summary > div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .expandedServiceKicker {
          color: var(--green);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 2.4px;
        }

        .expandedServiceBox summary strong {
          margin-top: 12px;
          color: #fff;
          font-size: clamp(26px, 3vw, 42px);
          line-height: 1;
          letter-spacing: -1.7px;
        }

        .expandedServiceBox summary small {
          max-width: 540px;
          margin-top: 14px;
          color: #9da3aa;
          font-size: 12px;
          line-height: 1.65;
          font-weight: 600;
        }

        .expandedServiceBox summary b {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(50,255,115,.32);
          border-radius: 50%;
          background: rgba(50,255,115,.06);
          color: var(--green);
          font-size: 24px;
          line-height: 1;
          transition: transform .2s ease;
        }

        .expandedServiceBox[open] summary b {
          transform: rotate(45deg);
        }

        .expandedServiceBody {
          padding: 4px 30px 32px;
          border-top: 1px solid rgba(255,255,255,.08);
          column-count: 2;
          column-gap: 46px;
        }

        .expandedServiceBody h3,
        .expandedServiceBody p,
        .expandedServiceActions {
          break-inside: avoid;
        }

        .expandedServiceBody h3 {
          margin: 28px 0 10px;
          color: #fff;
          font-size: 18px;
          line-height: 1.25;
          letter-spacing: -.4px;
        }

        .expandedServiceBody p {
          margin: 0 0 18px;
          color: #aab0b7;
          font-size: 13px;
          line-height: 1.82;
        }

        .expandedServiceActions {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          column-span: all;
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

          .expandedLocalServices {
            width: min(calc(100% - 28px), 1280px);
            padding: 62px 0 8px;
          }

          .expandedServiceGrid {
            grid-template-columns: 1fr;
          }

          .expandedServiceBox[open] {
            grid-column: auto;
          }

          .expandedServiceBox summary {
            min-height: 150px;
            padding: 22px 18px;
            gap: 14px;
          }

          .expandedServiceBox summary strong {
            font-size: 28px;
            letter-spacing: -1.2px;
          }

          .expandedServiceBox summary small {
            font-size: 11px;
          }

          .expandedServiceBox summary b {
            width: 36px;
            height: 36px;
            flex-basis: 36px;
          }

          .expandedServiceBody {
            padding: 0 18px 24px;
            column-count: 1;
          }

          .expandedServiceBody h3 {
            margin-top: 24px;
            font-size: 16px;
          }

          .expandedServiceBody p {
            font-size: 12px;
            line-height: 1.8;
          }


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
