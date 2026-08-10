import React from "react";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Script from "next/script";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const phone = "+447576579923";
const SITE_URL = "https://adforge.uk";

export async function generateMetadata({ params }: any) {
  const { data } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 4999)
    .eq("slug", params.slug)
    .eq("active", true)
    .single();

  const slug = String(params.slug || "");

  const isTyrePage =
    slug.includes("tyre") ||
    slug.includes("puncture") ||
    slug.includes("locking-nut") ||
    slug.includes("wheel-nut") ||
    slug.includes("flat-tyre") ||
    slug.includes("run-flat");

  const imageUrl = isTyrePage
    ? `${SITE_URL}/images/mobile-tyre-fitting.jpg`
    : `${SITE_URL}/images/recovery-truck.jpg`;

  const pageHeadline = String(
    data?.headline || "Local Emergency Service",
  )
    .replace(/\s*\|\s*AdForge\s*$/i, "")
    .trim();

  const searchTitle = `${pageHeadline} | AdForge`;
  const description = data?.meta_description || "";
  const url = `${SITE_URL}/seo/${slug}`;

  return {
    title: searchTitle,
    description,
    applicationName: "AdForge",

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: searchTitle,
      description,
      url,
      siteName: "AdForge",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageHeadline,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: searchTitle,
      description,
      images: [imageUrl],
    },
  };
}

function titleCase(value: string) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalise(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function valueContains(value: unknown, term: string) {
  if (!value || !term) return false;

  if (Array.isArray(value)) {
    return value.some((item) => normalise(item).includes(normalise(term)));
  }

  return normalise(value).includes(normalise(term));
}

function getBusinessName(business: any) {
  return business?.name || business?.business_name || "Local Business";
}

function getBusinessPhone(business: any) {
  return business?.phone || business?.notification_phone || "";
}

function getBusinessImage(business: any) {
  return (
    business?.profile_image_url ||
    business?.image_url ||
    business?.logo_url ||
    ""
  );
}

function getBusinessAreaText(business: any) {
  const value =
    business?.service_area ||
    business?.service_areas ||
    business?.areas_covered ||
    business?.location ||
    "Local area";

  return Array.isArray(value) ? value.join(", ") : String(value);
}

export default async function LandingPage({ params }: any) {
  const { data: page } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", params.slug)
    .eq("active", true)
    .single();

  if (!page) notFound();

  const slug = page.slug || "";
  const title = page.headline;
  const description =
    page.meta_description ||
    "Fast local service available across your area with rapid response.";

  const isTyrePage =
    slug.includes("tyre") ||
    slug.includes("puncture") ||
    slug.includes("locking-nut") ||
    slug.includes("wheel-nut") ||
    slug.includes("flat-tyre") ||
    slug.includes("run-flat");

  const isRecoveryPage =
    slug.includes("recovery") ||
    slug.includes("breakdown") ||
    slug.includes("towing") ||
    slug.includes("vehicle-transport") ||
    slug.includes("roadside-assistance");

  const heroImageSrc = isTyrePage
    ? "/images/mobile-tyre-fitting.jpg"
    : "/images/recovery-truck.jpg";

  const schemaImage = `${SITE_URL}${heroImageSrc}`;

  const serviceName = isTyrePage
    ? "mobile tyre fitting"
    : isRecoveryPage
      ? "vehicle recovery"
      : titleCase(slug);

  const greenHeading = isTyrePage
    ? "24 HOUR MOBILE TYRE FITTING"
    : isRecoveryPage
      ? "24 HOUR EMERGENCY RECOVERY"
      : "LOCAL EMERGENCY SERVICE";

  const searchTags = isTyrePage
    ? [
        "24 Hour Tyre Fitting",
        "Puncture Repair",
        "Mobile Tyre Fitter Near Me",
        "Roadside Tyre Replacement",
      ]
    : [
        "24 Hour Vehicle Recovery",
        "Breakdown Recovery",
        "Car Towing",
        "Roadside Assistance",
        "Recovery Near Me",
      ];

  const serviceCards = isTyrePage
    ? [
        "Mobile Tyre Fitting",
        "Emergency Tyre Fitting",
        "Puncture Repair",
        "Tyre Replacement",
      ]
    : [
        "Breakdown Recovery",
        "Accident Recovery",
        "Vehicle Transport",
        "Roadside Assistance",
      ];

  const serviceImageMap: Record<string, string> = {
    "Mobile Tyre Fitting": "/images/mobile-tyre-fitting.jpg",
    "Emergency Tyre Fitting": "/images/quick-1.jpg",
    "Puncture Repair": "/images/quick-2.jpg",
    "Tyre Replacement": "/images/quick-3.jpg",
    "Breakdown Recovery": "/images/recovery-truck.jpg",
    "Accident Recovery": "/images/quick-2.jpg",
    "Vehicle Transport": "/images/quick-3.jpg",
    "Roadside Assistance": "/images/quick-4.jpg",
  };

  function getServiceImage(service: string) {
    return serviceImageMap[service] || heroImageSrc;
  }

  const areas = [
    "Liverpool",
    "Bootle",
    "Huyton",
    "Kirkby",
    "Speke",
    "Widnes",
    "St Helens",
    "Wirral",
    "Wallasey",
    "Sefton",
    "Knowsley",
    "Southport",
    "Crosby",
    "Maghull",
    "Aintree",
    "Prescot",
    "Halewood",
    "Birkenhead",
    "Warrington",
    "M57",
    "M58",
    "M62",
  ];

  const roads = [
    "M62",
    "M57",
    "M58",
    "M53",
    "M56",
    "A580",
    "A59",
    "A565",
    "Queens Drive",
    "East Lancs Road",
  ];

  const commonProblems = isTyrePage
    ? [
        "Flat tyre",
        "Puncture",
        "Tyre blowout",
        "Damaged sidewall",
        "Slow puncture",
        "Locking wheel nut issue",
        "Run flat tyre",
        "Emergency tyre replacement",
      ]
    : [
        "Vehicle breakdown",
        "Car will not start",
        "Flat battery",
        "Accident recovery",
        "Vehicle transport",
        "Motorway recovery",
        "Roadside assistance",
        "Non-runner vehicle",
      ];

  const detectedArea =
    areas.find((area) => normalise(title).includes(normalise(area))) ||
    areas.find((area) => normalise(slug).includes(normalise(area)));

  const pageLocation =
    detectedArea ||
    titleCase(
      slug
        .replace(
          /24-hour|24hr|24|hour|mobile|emergency|local|service|services|help|tyre|tire|fitting|puncture|repair|replacement|recovery|breakdown|towing|vehicle|transport|roadside|assistance|locking|wheel|nut|flat|run/gi,
          " ",
        )
        .replace(/\s+/g, " ")
        .trim(),
    ) ||
    "your area";

  const pageUrl = `${SITE_URL}/seo/${slug}`;

  const { data: businessRows } = await supabase
    .from("businesses")
    .select("*")
    .limit(250);

  const allBusinesses = businessRows || [];

  const featuredProvider =
    allBusinesses.find((business: any) => {
      const providerType = normalise(business?.provider_type);
      const businessName = normalise(getBusinessName(business));

      const approved =
        business?.approved === true || business?.featured === true;
      const receivesLeads = business?.receive_leads !== false;
      const matchesService = isTyrePage
        ? providerType.includes("tyre") || businessName.includes("total tyres")
        : providerType.includes("recovery") ||
          businessName.includes("total tyres");

      return approved && receivesLeads && matchesService;
    }) ||
    allBusinesses.find((business: any) =>
      normalise(getBusinessName(business)).includes("total tyres"),
    ) ||
    null;

  const futurePaidProviders = allBusinesses
    .filter((business: any) => {
      if (!business || business?.id === featuredProvider?.id) return false;
      if (business?.active === false) return false;

      const isApprovedPaidProvider =
        business?.approved === true &&
        business?.featured !== true &&
        business?.receive_leads === true &&
        (business?.is_paid === true ||
          business?.subscription_active === true ||
          normalise(business?.plan).includes("pro") ||
          normalise(business?.plan).includes("premium"));

      if (!isApprovedPaidProvider) return false;

      const businessService = [
        business?.provider_type,
        business?.business_type,
        business?.category,
        business?.service,
        business?.services,
        business?.description,
      ].filter(Boolean);

      const serviceMatches = isTyrePage
        ? businessService.some(
            (value) =>
              valueContains(value, "tyre") ||
              valueContains(value, "tire") ||
              valueContains(value, "puncture"),
          )
        : businessService.some(
            (value) =>
              valueContains(value, "recovery") ||
              valueContains(value, "towing") ||
              valueContains(value, "roadside") ||
              valueContains(value, "transport"),
          );

      return serviceMatches;
    })
    .slice(0, 5);

  const displayedBusinesses = [
    ...(featuredProvider ? [featuredProvider] : []),
    ...futurePaidProviders,
  ];

  const matchingBusinessNames = displayedBusinesses
    .map((business: any) => getBusinessName(business))
    .filter(Boolean);

  const rawProviderName = featuredProvider
    ? getBusinessName(featuredProvider)
    : "Total Tyres & Recovery 247 Ltd";

  const providerName = normalise(rawProviderName).includes("total tyres")
    ? "Total Tyres & Recovery 247 Ltd"
    : rawProviderName;

  const providerImage = featuredProvider
    ? getBusinessImage(featuredProvider)
    : "";

  const providerImageStyle = {
    backgroundImage: isTyrePage
      ? `${providerImage ? `url("${providerImage}"), ` : ""}url("/images/mobile-tyre-fitting.jpg")`
      : `${providerImage ? `url("${providerImage}"), ` : ""}url("/images/recovery-truck.jpg")`,
  };

  const providerArea = featuredProvider
    ? getBusinessAreaText(featuredProvider)
    : "Liverpool, Merseyside and surrounding areas";

  const providerDescription = isTyrePage
    ? `Local mobile tyre fitting provider offering emergency tyre replacement, puncture repairs, new tyres and roadside tyre support across ${pageLocation} and nearby areas.`
    : `Local vehicle recovery provider offering breakdown recovery, roadside assistance, accident recovery and vehicle transport across ${pageLocation} and nearby areas.`;

  const providerServices = isTyrePage
    ? [
        "Mobile Tyre Fitting",
        "Puncture Repairs",
        "New Tyres Supplied",
        "Emergency Tyre Replacement",
      ]
    : [
        "Breakdown Recovery",
        "Roadside Assistance",
        "Accident Recovery",
        "Vehicle Transport",
      ];

  const galleryImages = isTyrePage
    ? [
        'url("/images/mobile-tyre-fitting.jpg")',
        'url("/images/quick-2.jpg")',
        'url("/images/quick-3.jpg")',
      ]
    : [
        'url("/images/recovery-truck.jpg")',
        'url("/images/quick-2.jpg")',
        'url("/images/quick-4.jpg")',
      ];

  const businessSchema = displayedBusinesses.map((business: any) => {
    const businessName = getBusinessName(business);
    const businessImage = getBusinessImage(business);
    const businessUrl = business?.slug
      ? `${SITE_URL}/business/${business.slug}`
      : pageUrl;

    return {
      "@type": "LocalBusiness",
      "@id": `${pageUrl}#business-${business?.id || normalise(businessName).replace(/\s+/g, "-")}`,
      name: businessName,
      url: businessUrl,
      telephone: phone,
      image: businessImage || schemaImage,
      areaServed: getBusinessAreaText(business),
      description:
        business?.description ||
        `${businessName} is a local business provider offering ${serviceName} services in and around ${pageLocation}. Calls are routed through AdForge.`,
    };
  });

  const { data: relatedPages } = await supabase
    .from("landing_pages")
    .select("slug, headline")
    .neq("slug", params.slug)
    .eq("active", true)
    .ilike("slug", isTyrePage ? "%tyre%" : "%recovery%")
    .limit(30);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "AdForge",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "AdForge",
        alternateName: "AdForge Local Business Directory",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${title} | AdForge`,
        headline: title,
        description,
        image: {
          "@type": "ImageObject",
          url: schemaImage,
          contentUrl: schemaImage,
          caption: page.headline,
        },
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "AdForge",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isTyrePage ? "Mobile Tyre Services" : "Recovery Services",
            item: `${SITE_URL}/seo`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Service",
        name: title,
        description,
        image: schemaImage,
        areaServed: areas,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        url: pageUrl,
      },
      ...businessSchema,
    ],
  };

  return (
    <main className="page">
      <Script
        id="seo-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <header className="siteHeader">
        <div className="headerInner">
          <a href="/" className="brandLink">
            <span className="brand">
              Ad<span>Forge</span>
            </span>
            <span className="brandSub">LOCAL EMERGENCY SERVICES</span>
          </a>

          <nav className="nav">
            <a href="/" className="homeNavButton">Home</a>
            <a href="#services">Services</a>
            <a href="#coverage">Areas We Cover</a>
            <a href="#why">Why AdForge</a>
            <a href="#faq">FAQs</a>
          </nav>

          <a href={`tel:${phone}`} className="headerCall">
            <span className="callLabel">CALL NOW</span>
            <span>{phone}</span>
          </a>
        </div>
      </header>

      <section className="hero">
        <img src={heroImageSrc} alt={title} className="heroImg" />
        <div className="heroShade" />
        <div className="heroGlow" />

        <div className="heroInner">
          <div className="heroCopy">
            <div className="greenPill">{greenHeading}</div>
            <h1>{title}</h1>
            <p className="intro">{description}</p>

            <div className="heroButtons">
              <a href={`tel:${phone}`} className="primaryBtn">
                Call Now
              </a>
              <a href="#services" className="secondaryBtn">
                View Services
              </a>
            </div>

            <div className="heroTrust">
              <div className="trustItem">
                <strong>24/7</strong>
                <span>Available</span>
                <small>Local help day and night</small>
              </div>
              <div className="trustItem">
                <strong>Fast</strong>
                <span>Response</span>
                <small>Simple call-out process</small>
              </div>
              <div className="trustItem">
                <strong>Local</strong>
                <span>Coverage</span>
                <small>Across nearby towns</small>
              </div>
              <div className="trustItem">
                <strong>Direct</strong>
                <span>Contact</span>
                <small>Speak to a local provider</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="local-businesses" className="section businessSection">
        <div className="sectionHeading providerHeading">
          <div>
            <p className="label">FEATURED LOCAL PROVIDER</p>
            <h2>Local help for {pageLocation}</h2>
          </div>
          <p className="sectionIntro">
            AdForge connects customers with a genuine local provider while every
            enquiry stays inside the AdForge system.
          </p>
        </div>

        <article className="featuredProviderCard">
          <div
            className="featuredProviderMedia"
            role="img"
            aria-label={`${providerName} serving ${pageLocation}`}
            style={providerImageStyle}
          >
            <span className="featuredBadge">FEATURED LOCAL PROVIDER</span>
          </div>

          <div className="featuredProviderBody">
            <p className="providerEyebrow">
              LOCAL BUSINESS COVERING {String(pageLocation).toUpperCase()}
            </p>
            <h3>{providerName}</h3>
            <h4>
              {isTyrePage
                ? "Mobile Tyre Fitting & Tyre Support"
                : "Vehicle Recovery & Roadside Assistance"}
            </h4>
            <p>{providerDescription}</p>

            <div className="providerServiceGrid">
              {providerServices.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="providerCoverage">
              <strong>Coverage:</strong> {providerArea}
            </div>

            <div className="featuredProviderActions">
              <a href={`tel:${phone}`} className="primaryBtn">
                Call Through AdForge
              </a>
              <a href="/request-service" className="secondaryBtn">
                Request Help
              </a> 
            </div>

            <p className="providerNotice">
              All calls and enquiries go through AdForge. We collect the job
              details and arrange the right local support without publishing the
              provider&apos;s private number.
            </p>
          </div>
        </article>

        {futurePaidProviders.length > 0 && (
          <div className="additionalProviders">
            <p className="label">MORE APPROVED PROVIDERS</p>
            <div className="businessGrid">
              {futurePaidProviders.map((business: any) => {
                const businessName = getBusinessName(business);
                const businessImage =
                  getBusinessImage(business) || heroImageSrc;
                const businessArea = getBusinessAreaText(business);

                return (
                  <article
                    key={business?.id || businessName}
                    className="businessCard"
                  >
                    <div className="businessImage">
                      <img
                        src={businessImage}
                        alt={`${businessName} local provider`}
                      />
                    </div>
                    <div className="businessBody">
                      <span className="verifiedBadge">APPROVED PROVIDER</span>
                      <h3>{businessName}</h3>
                      <p>
                        {serviceName} services across {businessArea}.
                      </p>
                      <div className="businessActions">
                        <a href={`tel:${phone}`} className="businessCall">
                          Call Through AdForge
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section id="services" className="section sectionTop">
        <div className="sectionHeading">
          <div>
            <p className="label">OUR SERVICES</p>
            <h2>Local help when you need it</h2>
          </div>
          <p className="sectionIntro">
            Fast access to local businesses and trusted local providers offering{" "}
            {serviceName} services.
          </p>
        </div>

        <div className="serviceGrid">
          {serviceCards.map((service, index) => (
            <a
              key={service}
              href={`/seo/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="serviceCard"
            >
              <div
                className="serviceImage"
                role="img"
                aria-label={service}
                style={{
                  backgroundImage: `url("${getServiceImage(service)}")`,
                }}
              />
              <div className="serviceShade" />
              <div className="serviceContent">
                <span className="serviceNumber">0{index + 1}</span>
                <div>
                  <h3>{service}</h3>
                  <p>
                    Fast local support with direct contact and clear service
                    information.
                  </p>
                </div>
                <span className="serviceArrow">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section landingExpandedServices">
        <div className="landingExpandedIntro">
          <p className="label">24 HOUR LOCAL SERVICES</p>
          <p>
            We provide mobile tyre fitting and vehicle recovery services across {pageLocation},
            Liverpool and surrounding areas. Open either service below for detailed information
            about the help we provide across Liverpool, Wirral, Merseyside and nearby towns.
          </p>
        </div>

        <div className="landingExpandedGrid">
          <details className="landingExpandedBox">
            <summary>
              <div>
                <span className="landingExpandedKicker">MOBILE TYRE SERVICES</span>
                <strong>24 Hour Mobile Tyre Fitting</strong>
                <small>
                  Emergency tyres, puncture repairs, roadside tyre replacement and mobile tyre
                  fitting across {pageLocation}, Liverpool and surrounding areas.
                </small>
              </div>
              <b>+</b>
            </summary>

            <div className="landingExpandedBody">
              <h3>24 hour mobile tyre fitting in {pageLocation} and surrounding areas</h3>
              <p>
                We provide 24-hour mobile tyre fitting in {pageLocation} and throughout Liverpool
                and surrounding areas for drivers who need tyre help at home, at work, in a car
                park or at the roadside. Our mobile tyre service is designed for situations where
                travelling to a tyre garage is difficult, unsafe or simply inconvenient. We
                provide emergency mobile tyre fitting, roadside tyre replacement, same-day tyre
                fitting and out-of-hours tyre assistance for cars, vans, taxis, SUVs, 4x4s and
                light commercial vehicles, subject to tyre stock and local provider availability.
              </p>

              <p>
                We provide mobile tyre fitting for flat tyres, damaged tyres, tyre blowouts,
                sidewall damage, slow punctures, pressure loss, worn tyres and tyres that are no
                longer safe to drive on. A mobile tyre fitter can attend the vehicle, inspect the
                problem, remove the damaged tyre and fit a suitable replacement where required.
                This can save customers from arranging a separate recovery truck just to reach a
                tyre depot and is especially useful when a vehicle is stranded away from home.
              </p>

              <h3>Emergency tyre replacement and roadside tyre fitting</h3>
              <p>
                We provide emergency tyre replacement across {pageLocation}, Liverpool, Wirral,
                Merseyside and surrounding areas when a tyre has failed unexpectedly. Whether the
                problem happens before work, late at night, during a weekend journey or while
                travelling on a busy local road, mobile tyre assistance can be arranged directly
                to the vehicle. Customers should provide the complete tyre size, vehicle details
                and exact location so the correct tyre and fitting equipment can be prepared
                before the fitter travels to the call-out.
              </p>

              <p>
                We provide roadside tyre fitting for drivers who have suffered a blowout, severe
                puncture, damaged sidewall or sudden loss of pressure and cannot safely continue
                their journey. Roadside tyre replacement may be available on local streets, at
                homes and workplaces, in suitable car parks and at safe roadside locations. If a
                vehicle is stopped on a motorway or high-speed road, customers should prioritise
                their safety and follow official road-safety guidance while arranging help.
              </p>

              <h3>Mobile puncture repairs and flat tyre assistance</h3>
              <p>
                We provide mobile puncture repair where the tyre damage is in a safely repairable
                part of the tread and the tyre has not suffered structural or sidewall damage. A
                puncture does not always mean a replacement tyre is required, so the tyre can be
                inspected before the correct repair or replacement is recommended. We also
                provide assistance for slow punctures, leaking valves, repeated pressure loss and
                flat tyres where the cause of the problem needs to be identified at the vehicle.
              </p>

              <p>
                When a puncture cannot be repaired safely, we provide mobile tyre replacement so
                the damaged tyre can be removed and a suitable tyre fitted at the same location.
                Damage close to the sidewall, exposed cords, deep cuts, bulges, excessive tread
                wear or driving for too long on an underinflated tyre can mean replacement is the
                safer option. The final decision should always be based on the actual condition of
                the tyre rather than simply trying to repair every puncture.
              </p>

              <h3>New tyres, budget tyres and part-worn tyres</h3>
              <p>
                We provide new tyre fitting with a range of tyre options depending on vehicle,
                tyre size, availability and budget. Customers may be able to choose from budget,
                mid-range and premium replacement tyres, with fitting carried out at their home,
                workplace or roadside location. Giving the full tyre markings shown on the
                sidewall helps the provider check the correct width, profile, rim size, load
                rating and other important specifications before travelling.
              </p>

              <p>
                We also provide access to part-worn tyre fitting through suitable local providers
                where stock is available. Part-worn tyres can offer a lower-cost option for some
                customers, but the tyre still needs to be suitable for the vehicle and in a safe,
                legal condition. Customers should ask about condition, tread depth and tyre size
                before fitting. Availability of individual part-worn sizes can vary, so providing
                the tyre size when first calling can prevent unnecessary delays.
              </p>

              <h3>Locking wheel nut removal, wheel balancing and tyre checks</h3>
              <p>
                We provide locking wheel nut removal assistance where a locking key has been
                lost, damaged or rounded and the wheel cannot be removed normally. Depending on
                the vehicle and the condition of the locking nut, specialist extraction equipment
                may be required before a puncture repair or tyre replacement can be completed. It
                is useful to provide the vehicle make, model and photographs of the wheel or
                locking nut where requested.
              </p>

              <p>
                We provide wheel balancing with mobile tyre fitting where the attending vehicle
                is equipped for balancing. Correct wheel balancing helps reduce steering-wheel
                vibration and uneven weight distribution after a tyre is fitted. Mobile providers
                may also check tyre pressure, visible tread condition, valves and signs of damage
                while attending. Wheel balancing and wheel alignment are different services, so
                persistent pulling or unusual tyre wear may require a separate alignment check.
              </p>

              <h3>Home, workplace and commercial mobile tyre fitting</h3>
              <p>
                We provide mobile tyre fitting at homes and workplaces across {pageLocation} and
                surrounding areas, allowing customers to have tyres replaced without spending
                time travelling to and waiting at a tyre centre. This is useful for planned tyre
                changes as well as urgent faults discovered before a journey. Where there is safe
                access and enough working room around the vehicle, fitting can often be completed
                on a driveway, private parking area, office car park, yard or other suitable
                location.
              </p>

              <p>
                We provide tyre assistance for cars, taxis, private-hire vehicles, vans and light
                commercial vehicles. Commercial drivers often depend on their vehicle for work,
                so a tyre failure can quickly cause lost time and cancelled jobs. Mobile fitting
                allows the tyre problem to be dealt with at the vehicle and can help a driver get
                moving again without first arranging transport to a fixed garage.
              </p>

              <h3>Mobile tyre coverage around Liverpool and Merseyside</h3>
              <p>
                We provide mobile tyre fitting across {pageLocation}, Liverpool City Centre,
                Bootle, Huyton, Kirkby, Knowsley, Prescot, Whiston, Halewood, Speke, Garston,
                Aigburth, Allerton, Childwall, West Derby, Aintree, Crosby, Maghull, Sefton, St
                Helens, Widnes, Runcorn, Warrington, Birkenhead, Wallasey, Wirral and other nearby
                areas. Local availability can vary by time, distance, tyre size and current demand,
                but AdForge is designed to make it easier to find suitable local tyre support.
              </p>

              <p>
                We provide mobile tyre assistance near major routes around Liverpool and
                Merseyside including the M62, M57, M58, M53, M56, A580, A59, A565, Queens Drive
                and surrounding connecting roads where safe attendance is possible. When calling
                from a roadside location, providing the road name, direction of travel, nearby
                junction, postcode or recognisable landmark helps the attending provider locate
                the vehicle more quickly.
              </p>

              <div className="landingExpandedActions">
                <a href={`tel:${phone}`} className="primaryBtn">Call for Mobile Tyre Help</a>
                <a href="/services/mobile-tyre-fitting" className="secondaryBtn">Browse Mobile Tyre Services</a>
              </div>
            </div>
          </details>

          <details className="landingExpandedBox">
            <summary>
              <div>
                <span className="landingExpandedKicker">RECOVERY SERVICES</span>
                <strong>24 Hour Vehicle Recovery</strong>
                <small>
                  Breakdown recovery, accident recovery, towing, roadside assistance and vehicle
                  transport across {pageLocation}, Liverpool and surrounding areas.
                </small>
              </div>
              <b>+</b>
            </summary>

            <div className="landingExpandedBody">
              <h3>24 hour vehicle recovery in {pageLocation} and surrounding areas</h3>
              <p>
                We provide 24-hour vehicle recovery in {pageLocation}, Liverpool and surrounding
                areas for drivers who are stranded because their car, van or light commercial
                vehicle cannot be driven safely. A recovery service may be required after a
                mechanical breakdown, electrical fault, overheating problem, clutch or gearbox
                issue, accident, damaged wheel, tyre-related incident or any other fault that
                prevents the vehicle from continuing its journey safely.
              </p>

              <p>
                We provide emergency recovery during the day and out of hours, including evening,
                overnight and weekend call-outs depending on local provider availability. When
                arranging a recovery, customers should provide the vehicle make and model, exact
                pickup location, the problem with the vehicle and the destination it needs to be
                taken to. This information helps the recovery operator determine what type of
                truck, loading method and equipment will be needed for the job.
              </p>

              <h3>Breakdown recovery and roadside collection</h3>
              <p>
                We provide breakdown recovery when a vehicle will not start, has lost power, is
                overheating, has developed a warning fault or cannot be moved safely under its own
                power. A recovery truck can collect the vehicle from a roadside location, home,
                workplace, car park or other accessible location and transport it to a garage,
                dealership, repair centre, home address or another agreed destination.
              </p>

              <p>
                We provide local breakdown recovery as well as longer-distance vehicle transport
                where available. Some breakdowns happen close to home while others occur during a
                longer journey, so the required destination can vary considerably. Customers
                should explain whether the vehicle can roll and steer, whether any wheels are
                damaged or locked and whether there are access restrictions that could affect how
                the vehicle is loaded.
              </p>

              <h3>Accident recovery and damaged vehicle transport</h3>
              <p>
                We provide accident recovery for vehicles that have been involved in a collision
                and are no longer safe or legal to drive. Even where bodywork damage appears
                limited, damaged steering, suspension, wheels, tyres, lights or fluid systems can
                make continued driving unsafe. The recovery operator can load the vehicle and
                transport it away from the scene to a garage, body shop, storage facility or
                another suitable destination.
              </p>

              <p>
                We provide recovery for damaged and non-running vehicles where specialist loading
                may be necessary. A vehicle with broken suspension, locked wheels, damaged tyres
                or steering problems may require a winch, skates or a flatbed rather than a simple
                tow. Giving accurate information about the vehicle condition before dispatch helps
                make sure the attending truck is suitable and reduces the risk of delays at the
                collection point.
              </p>

              <h3>Car recovery, van recovery and light commercial recovery</h3>
              <p>
                We provide car recovery for everyday passenger vehicles as well as recovery for
                vans, SUVs, 4x4s and suitable light commercial vehicles. Different vehicles can
                have different weights, wheelbases, ground clearances and loading requirements, so
                the recovery operator may ask for additional vehicle information before attending.
                This is particularly important for larger vans, lowered cars, damaged vehicles and
                vehicles carrying equipment or commercial loads.
              </p>

              <p>
                We provide van recovery for tradespeople, couriers and businesses whose vehicles
                have broken down while working across {pageLocation}, Liverpool and surrounding
                areas. A commercial vehicle breakdown can stop a working day immediately, so clear
                pickup and destination information helps arrange the correct recovery vehicle as
                efficiently as possible.
              </p>

              <h3>Towing, flatbed recovery and vehicle transport</h3>
              <p>
                We provide towing and recovery options according to the vehicle and the fault.
                Some vehicles can be moved using appropriate towing equipment, while others should
                be transported with all wheels off the road. Automatic vehicles, electric and
                hybrid vehicles, four-wheel-drive vehicles, low vehicles and accident-damaged cars
                may require a particular recovery method to avoid causing further damage.
              </p>

              <p>
                We provide flatbed recovery and vehicle transport for breakdowns, non-runners,
                accident-damaged vehicles and planned vehicle movements. Vehicle transport can be
                useful for collecting a vehicle from a garage, dealership, auction, seller,
                storage location or private address and moving it to another destination without
                the vehicle being driven. Planned transport can often be arranged in advance,
                while emergency recovery is intended for unexpected roadside problems.
              </p>

              <h3>Roadside assistance, flat batteries and non-starting vehicles</h3>
              <p>
                We provide access to roadside assistance where a problem may be resolved without
                transporting the vehicle. Depending on the attending provider and the fault, this
                may include basic checks, flat-battery assistance or a jump start. If the vehicle
                still does not start, or if there is another fault that makes driving unsafe,
                recovery to a garage or chosen destination can be arranged instead.
              </p>

              <p>
                We provide recovery for non-starting vehicles at homes, workplaces and public
                parking locations as well as roadside breakdowns. A non-runner does not have to be
                an emergency; vehicles that have been stored, purchased, sold or booked into a
                repair centre may also need transporting because they cannot move under their own
                power. The condition of the steering, brakes, wheels and transmission should be
                explained before collection where known.
              </p>

              <h3>Motorway recovery and major-road breakdown assistance</h3>
              <p>
                We provide vehicle recovery around major roads and motorway routes serving
                Liverpool and Merseyside, including the M62, M57, M58, M53, M56, A580, A59 and
                other busy connecting routes. Breaking down on a motorway or fast road can be
                dangerous, so drivers should prioritise safety, move to a safer location where
                possible and follow official road-safety instructions while arranging assistance.
              </p>

              <p>
                When requesting motorway recovery, customers should provide as precise a location
                as possible, including the motorway or road number, direction of travel, nearest
                junction, marker information, nearby services or another clear landmark. Accurate
                location details are especially important at night or where several carriageways
                and junctions are close together.
              </p>

              <h3>Recovery coverage across Liverpool, Wirral and Merseyside</h3>
              <p>
                We provide vehicle recovery across {pageLocation}, Liverpool City Centre, Bootle,
                Huyton, Kirkby, Knowsley, Prescot, Whiston, Halewood, Speke, Garston, Aintree,
                Crosby, Maghull, Sefton, St Helens, Widnes, Runcorn, Warrington, Birkenhead,
                Wallasey, Wirral and other surrounding locations. Coverage and response time depend
                on the location of the recovery vehicle, current workload, traffic conditions and
                the equipment required for the particular vehicle.
              </p>

              <p>
                We provide a straightforward way for customers to request breakdown recovery,
                accident recovery, roadside assistance, towing and vehicle transport through
                AdForge. Whether a vehicle has failed outside a house, at a workplace, in a retail
                park, on an industrial estate or while travelling through Liverpool and the wider
                Merseyside area, the aim is to collect the essential job details and help arrange
                suitable local support for the situation.
              </p>

              <div className="landingExpandedActions">
                <a href={`tel:${phone}`} className="primaryBtn">Call for Vehicle Recovery</a>
                <a href="/services/vehicle-recovery" className="secondaryBtn">Browse Recovery Services</a>
              </div>
            </div>
          </details>
        </div>
      </section>

      <section id="why" className="section">
        <div className="sectionHeading">
          <div>
            <p className="label">WHY CHOOSE ADFORGE</p>
            <h2>Built around local response</h2>
          </div>
        </div>

        <div className="featureGrid">
          <div className="featureCard">
            <span className="featureIcon">01</span>
            <h3>Fast Response</h3>
            <p>
              Clear contact options help customers reach local providers
              quickly.
            </p>
          </div>
          <div className="featureCard">
            <span className="featureIcon">02</span>
            <h3>Local Coverage</h3>
            <p>Pages are matched to nearby towns, roads and service areas.</p>
          </div>
          <div className="featureCard">
            <span className="featureIcon">03</span>
            <h3>Simple Booking</h3>
            <p>
              Call directly from the page without searching through outdated
              listings.
            </p>
          </div>
          <div className="featureCard">
            <span className="featureIcon">04</span>
            <h3>Useful Information</h3>
            <p>
              Service details, nearby areas and common questions are all in one
              place.
            </p>
          </div>
        </div>
      </section>

      <section className="section gallerySection">
        <div className="sectionHeading">
          <div>
            <p className="label">SERVICE AT A GLANCE</p>
            <h2>Professional local support</h2>
          </div>
        </div>

        <div className="galleryGrid">
          <div
            className="galleryLarge galleryPhoto"
            role="img"
            aria-label={`${serviceCards[0]} in ${pageLocation}`}
            style={{ backgroundImage: galleryImages[0] }}
          />
          <div
            className="gallerySmall galleryPhoto"
            role="img"
            aria-label={`${serviceCards[1]} in ${pageLocation}`}
            style={{ backgroundImage: galleryImages[1] }}
          />
          <div
            className="gallerySmall galleryPhoto"
            role="img"
            aria-label={`${serviceCards[2]} in ${pageLocation}`}
            style={{ backgroundImage: galleryImages[2] }}
          />
        </div>
      </section>

      <section className="section twoColSection">
        <div>
          <p className="label">POPULAR SEARCHES</p>
          <h2>Services customers look for</h2>
          <div className="chipGrid">
            {searchTags.map((tag) => (
              <a
                key={tag}
                href={`/seo/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                {tag}
              </a>
            ))}
            {commonProblems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div id="coverage">
          <p className="label">AREAS WE COVER</p>
          <h2>Local coverage</h2>
          <div className="areaGrid">
            {areas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section contentSection">
        <div className="sectionHeading">
          <div>
            <p className="label">SERVICE INFORMATION</p>
            <h2>Everything you need to know</h2>
          </div>
        </div>

        <details open>
          <summary>Read more about this service</summary>
          <div className="detailsBody">
            <p>{page.content}</p>
            <p>
              AdForge helps customers find fast local help for {serviceName}{" "}
              when they need a clear, simple way to contact a local provider.
              This page is built for people searching for
              {` ${serviceName} near me`}, emergency help, same day support, out
              of hours service, roadside assistance and local call-outs.
              {"\n\n"}
              Whether you are at home, at work, stuck on a roadside, waiting in
              a supermarket car park, broken down near a motorway junction or
              trying to arrange urgent help for a customer, AdForge is designed
              to make local services easier to find.
              {"\n\n"}
              Many customers do not search using one exact phrase. They may
              search for “open now”, “near me”, “24 hour”, “emergency”, “same
              day”, “local company”, “fast response”, “roadside help” or “urgent
              call-out”. This page includes those search terms naturally so
              Google can understand the full meaning of the service.
            </p>
          </div>
        </details>

        <details>
          <summary>Popular searches for this service</summary>
          <div className="detailsBody">
            <div className="keywordGrid">
              {(isTyrePage
                ? [
                    "24 hour mobile tyre fitting",
                    "mobile tyre fitting near me",
                    "emergency mobile tyre fitting",
                    "mobile tyre replacement",
                    "roadside tyre fitting",
                    "same day tyre fitting",
                    "mobile puncture repair",
                    "flat tyre repair",
                    "emergency tyre replacement",
                    "home tyre fitting",
                    "workplace tyre fitting",
                    "run flat tyre replacement",
                    "locking wheel nut removal",
                    "mobile tyre fitter open now",
                    "cheap mobile tyre fitting",
                    "local mobile tyre company",
                    "mobile tyre service near me",
                    "out of hours tyre fitting",
                    "weekend mobile tyre fitting",
                    "blown tyre replacement",
                    "van tyre fitting",
                    "commercial tyre fitting",
                    "tyre change at home",
                    "tyre change at work",
                  ]
                : [
                    "24 hour recovery",
                    "vehicle recovery near me",
                    "breakdown recovery",
                    "car recovery",
                    "van recovery",
                    "roadside recovery",
                    "accident recovery",
                    "emergency vehicle recovery",
                    "car towing service",
                    "tow truck near me",
                    "vehicle transport",
                    "motorway recovery",
                    "flat battery recovery",
                    "jump start service",
                    "non runner recovery",
                    "breakdown service open now",
                    "local recovery company",
                    "recovery truck near me",
                    "car breakdown service",
                    "van breakdown recovery",
                    "roadside assistance near me",
                    "emergency towing service",
                    "vehicle breakdown help",
                    "24 hour towing",
                  ]
              ).map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>

            <p>
              AdForge pages are written to match the different ways real
              customers search online. Some people search by service, some
              search by location, some search by road name and others search by
              urgency. That is why this page includes a wide mix of natural
              search phrases connected to {serviceName}.{"\n\n"}
              For example, a customer may search for a fast local provider, an
              emergency call-out, a same-day service, a company open now, a
              provider near their postcode, or help on a main road or motorway.
              AdForge uses this type of local content to help each page become
              more useful for both customers and search engines.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Local businesses and service providers in {pageLocation}
          </summary>
          <div className="detailsBody">
            <p>
              AdForge helps customers connect with local businesses and trusted
              local business providers offering {serviceName} in {pageLocation}{" "}
              and nearby areas. A local provider may be able to attend homes,
              workplaces, car parks, roadside locations, retail parks,
              industrial estates and motorway routes depending on availability.
              {"\n\n"}
              {displayedBusinesses.length > 0
                ? `Businesses currently matched to this page include ${matchingBusinessNames.join(", ")}. These business names are taken directly from active AdForge listings rather than being invented for search content.`
                : `AdForge is currently building its network of local businesses covering ${pageLocation}. Businesses can create or claim a listing so customers can find genuine providers serving this area.`}
              {"\n\n"}
              Customers can use AdForge to compare local service information,
              contact a listed business directly and find nearby providers
              without searching through outdated lists. Local businesses can use
              their AdForge listing to show their services, coverage areas,
              telephone number, opening information, images and other useful
              details.
            </p>
          </div>
        </details>

        <details>
          <summary>Why choose local help?</summary>
          <div className="detailsBody">
            <p>
              Choosing local help matters because response time is often the
              biggest problem when someone needs {serviceName}. A local provider
              may already know the surrounding roads, nearby estates, car parks,
              business parks, retail parks, industrial areas and motorway
              routes.
              {"\n\n"}
              AdForge is built to make that local connection easier. Instead of
              customers searching through lots of websites, old listings or
              companies that may not cover the area, this page brings together
              service information, nearby locations and genuine local business
              providers in one place. Customers can contact a listed local
              business directly or use AdForge to find suitable help.
              {"\n\n"}
              Local pages also help Google understand the service area better.
              By mentioning nearby towns, roads, common problems and customer
              search phrases, each AdForge page becomes more relevant for local
              searches.
            </p>
          </div>
        </details>

        <details>
          <summary>Areas and nearby towns covered</summary>
          <div className="detailsBody">
            <p>
              This AdForge page can help customers across {areas.join(", ")} and
              surrounding local areas. Coverage may include homes, workplaces,
              business parks, industrial estates, supermarkets, retail parks,
              garages, car parks, roadside locations and nearby motorway routes.
              {"\n\n"}A customer looking for {serviceName} may also search for
              help near Liverpool, Wirral, Wallasey, Sefton, Knowsley, Bootle,
              Huyton, Kirkby, Prescot, St Helens, Widnes, Southport, Crosby,
              Maghull, Aintree, Birkenhead, Warrington or nearby motorway
              routes.
            </p>
          </div>
        </details>

        <details>
          <summary>Roads and motorway coverage</summary>
          <div className="detailsBody">
            <p>
              Emergency services are often needed on busy roads and motorway
              routes such as
              {` ${roads.join(", ")}`}. Customers may need help after a
              breakdown, accident, flat battery, puncture, tyre blowout, warning
              light, engine fault, overheating, clutch problem, gearbox fault or
              vehicle transport issue.
              {"\n\n"}
              AdForge pages include road and motorway terms because many urgent
              searches happen when someone is already stranded. People may
              search for “recovery near M62”, “breakdown help on M57”, “tyre
              fitter near M58”, “tow truck near me” or “roadside assistance open
              now”.
            </p>
          </div>
        </details>

        <details>
          <summary>Common problems customers need help with</summary>
          <div className="detailsBody">
            <div className="keywordGrid">
              {commonProblems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <p>
              Customers usually search for {serviceName} because something has
              gone wrong quickly. A vehicle may not start, a tyre may be flat, a
              battery may be dead, a warning light may appear, a vehicle may be
              damaged after an accident, or the driver may not feel safe
              continuing the journey.
              {"\n\n"}
              AdForge pages are designed to explain these problems clearly so
              customers can recognise their situation and call for help. This
              helps the page cover more search intent than a basic directory
              listing.
            </p>
          </div>
        </details>

        <details>
          <summary>
            {isTyrePage
              ? "Mobile tyre fitting information"
              : "Vehicle recovery information"}
          </summary>
          <div className="detailsBody">
            {isTyrePage ? (
              <p>
                Mobile tyre fitting is useful when you need tyres fitted at
                home, work or roadside. Customers may need help with a flat
                tyre, puncture, tyre blowout, damaged sidewall, slow puncture,
                low tread, valve issue, run flat tyre, locking wheel nut
                problem, damaged alloy, tyre pressure warning or emergency tyre
                replacement.
                {"\n\n"}
                AdForge includes mobile tyre fitting content because customers
                search in many different ways. Some search for “mobile tyre
                fitting near me”, others search for “emergency tyre
                replacement”, “puncture repair near me”, “roadside tyre
                fitting”, “same day tyres”, “mobile tyre fitter open now”, “home
                tyre fitting” or “workplace tyre fitting”.
              </p>
            ) : (
              <p>
                Vehicle recovery helps when a car, van, SUV, 4x4 or light
                commercial vehicle cannot be driven safely. This may include
                breakdown recovery, accident recovery, car towing, van recovery,
                vehicle transport, motorway recovery, non-runner recovery, flat
                battery help, jump starts and roadside assistance.
                {"\n\n"}
                AdForge includes recovery keywords because customers search for
                help in different ways. Some search for “24 hour recovery”,
                others search for “tow truck near me”, “vehicle recovery near
                me”, “breakdown recovery”, “car recovery”, “van recovery”,
                “roadside recovery”, “accident recovery”, “motorway recovery” or
                “breakdown service open now”.
              </p>
            )}
          </div>
        </details>

        <details>
          <summary>How the service works</summary>
          <div className="detailsBody">
            <p>
              The process is simple. A customer finds the AdForge page, checks
              the service and location, then uses the call button to request
              help. The customer should explain what has happened, where the
              vehicle is, whether it is safe, and what type of vehicle needs
              assistance.
              {"\n\n"}
              AdForge pages are made to reduce confusion by giving customers a
              simple page, clear call buttons, service details and local
              information all in one place.
            </p>
          </div>
        </details>

        <details>
          <summary>Emergency advice</summary>
          <div className="detailsBody">
            <p>
              If you have broken down or suffered a tyre problem, avoid driving
              if the vehicle feels unsafe. Pull over where it is safe, switch on
              hazard lights and keep passengers away from moving traffic.
              {"\n\n"}
              When calling for help through an AdForge local service page, give
              your location clearly. Mention the road name, direction of travel,
              junction number, nearest exit, postcode, what3words if available,
              nearby landmark or any shops, garages or buildings nearby.
            </p>
          </div>
        </details>

        <details>
          <summary>Frequently asked questions</summary>
          <div className="detailsBody faqGrid">
            <div>
              <h3>Is this service available 24/7?</h3>
              <p>
                Emergency help may be available day and night depending on local
                provider availability.
              </p>
            </div>
            <div>
              <h3>How quickly can someone arrive?</h3>
              <p>
                Response times depend on location, traffic, weather, demand and
                provider availability.
              </p>
            </div>
            <div>
              <h3>Do you cover nearby towns?</h3>
              <p>
                Yes, nearby areas and surrounding towns may be covered depending
                on the local provider.
              </p>
            </div>
            <div>
              <h3>Can I call now?</h3>
              <p>
                Yes. Use the call button on this AdForge page to arrange help
                quickly.
              </p>
            </div>
            <div>
              <h3>Can help come to my workplace?</h3>
              <p>
                Many services can attend homes, workplaces, yards, car parks and
                roadside locations.
              </p>
            </div>
            <div>
              <h3>Do you cover motorways?</h3>
              <p>
                Motorway support may be available depending on location and
                safety requirements.
              </p>
            </div>
            <div>
              <h3>Can vans be helped?</h3>
              <p>
                Cars, vans, SUVs, 4x4s and light commercial vehicles may be
                supported.
              </p>
            </div>
            <div>
              <h3>Why is AdForge showing this page?</h3>
              <p>
                AdForge creates local service pages to help customers find
                trusted local help faster.
              </p>
            </div>
            <div>
              <h3>Can businesses advertise on AdForge?</h3>
              <p>
                Yes. Local businesses can use AdForge to advertise services,
                create pages and attract customers.
              </p>
            </div>
          </div>
        </details>
      </section>

      <section className="section relatedSection">
        <div className="sectionHeading">
          <div>
            <p className="label">NEARBY PAGES</p>
            <h2>Related local pages</h2>
          </div>
        </div>

        <div className="related">
          {relatedPages?.map((p) => (
            <a key={p.slug} href={`/seo/${p.slug}`}>
              <span>{p.headline}</span>
              <small>View local page →</small>
            </a>
          ))}
        </div>
      </section>

      <section className="ctaSection">
        <div className="ctaInner">
          <div>
            <p className="label">NEED LOCAL HELP?</p>
            <h2>Speak to a local provider now</h2>
            <p>
              Fast direct contact for {serviceName} and emergency local
              services.
            </p>
          </div>
          <a href={`tel:${phone}`} className="primaryBtn">
            Call Now
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footerInner">
          <div>
            <div className="brand footerBrand">
              Ad<span>Forge</span>
            </div>
            <p>Local services, faster connections and clear information.</p>
          </div>
          <div>
            <strong>Services</strong>
            <a href="#services">Local Services</a>
            <a href="#coverage">Areas We Cover</a>
            <a href="#faq">FAQs</a>
          </div>
          <div>
            <strong>Contact</strong>
            <a href={`tel:${phone}`}>{phone}</a>
            <a href="/">adforge.uk</a>
          </div>
        </div>
      </footer>

      <style>{`
* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body { margin: 0; }

.page {
min-height: 100vh;
background: #05070d;
color: #fff;
font-family: Inter, Arial, sans-serif;
}

.siteHeader {
position: sticky;
top: 0;
z-index: 50;
background: rgba(5,7,13,.88);
backdrop-filter: blur(18px);
border-bottom: 1px solid rgba(255,255,255,.10);
}

.headerInner {
max-width: 1240px;
margin: 0 auto;
padding: 14px 22px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 24px;
}

.brandLink {
display: flex;
flex-direction: column;
color: #fff;
text-decoration: none;
}

.brand {
font-size: 34px;
font-weight: 1000;
letter-spacing: -2px;
line-height: .9;
}

.brand span {
color: #32ff73;
text-shadow: 0 0 24px rgba(50,255,115,.45);
}

.brandSub {
margin-top: 7px;
font-size: 9px;
letter-spacing: 2px;
font-weight: 900;
color: rgba(255,255,255,.58);
}

.nav {
display: flex;
align-items: center;
gap: 26px;
}

.nav a {
color: rgba(255,255,255,.84);
font-size: 13px;
font-weight: 800;
text-decoration: none;
}

.homeNavButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid rgba(50,255,115,.42);
  background: rgba(50,255,115,.10);
  color: #32ff73 !important;
  font-weight: 1000 !important;
}

.homeNavButton:hover {
  background: #32ff73;
  color: #05070d !important;
}

.headerCall {
display: flex;
flex-direction: column;
align-items: flex-end;
padding: 10px 16px;
border: 1px solid rgba(255,255,255,.18);
border-radius: 12px;
color: #fff;
text-decoration: none;
background: rgba(255,255,255,.045);
font-weight: 900;
}

.callLabel {
font-size: 9px;
letter-spacing: 1.5px;
color: #32ff73;
}

.hero {
position: relative;
min-height: 650px;
overflow: hidden;
border-bottom: 1px solid rgba(255,255,255,.07);
}

.heroImg {
position: absolute;
inset: 0;
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
filter: saturate(.9) contrast(1.05);
}

.heroShade {
position: absolute;
inset: 0;
background:
linear-gradient(90deg, rgba(5,7,13,.97) 0%, rgba(5,7,13,.88) 31%, rgba(5,7,13,.42) 57%, rgba(5,7,13,.18) 100%),
linear-gradient(180deg, rgba(5,7,13,.10), rgba(5,7,13,.2) 65%, #05070d 100%);
}

.heroGlow {
position: absolute;
inset: 0;
background: radial-gradient(circle at 73% 36%, rgba(255,255,255,.045), transparent 28%);
}

.heroInner {
position: relative;
z-index: 2;
max-width: 1240px;
margin: 0 auto;
padding: 76px 22px 44px;
}

.heroCopy {
max-width: 660px;
}

.greenPill {
display: inline-flex;
padding: 10px 16px;
border-radius: 999px;
border: 1px solid rgba(255,255,255,.18);
background: rgba(255,255,255,.06);
color: #32ff73;
font-size: 12px;
font-weight: 1000;
letter-spacing: 1.2px;
box-shadow: none;
}

h1 {
font-size: clamp(46px, 5.8vw, 76px);
line-height: .96;
letter-spacing: -3px;
margin: 24px 0 18px;
font-weight: 1000;
max-width: 760px;
}

.intro {
font-size: 18px;
line-height: 1.65;
max-width: 590px;
color: rgba(255,255,255,.82);
}

.heroButtons {
display: flex;
gap: 14px;
flex-wrap: wrap;
margin-top: 28px;
}

.primaryBtn,
.secondaryBtn {
display: inline-flex;
align-items: center;
justify-content: center;
min-width: 145px;
padding: 15px 24px;
border-radius: 10px;
font-weight: 1000;
text-decoration: none;
}

.primaryBtn {
background: #32ff73;
color: #05070d;
box-shadow: 0 10px 30px rgba(50,255,115,.18);
}

.secondaryBtn {
background: rgba(255,255,255,.07);
color: #fff;
border: 1px solid rgba(255,255,255,.24);
}

.heroTrust {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
margin-top: 42px;
max-width: 800px;
border: 1px solid rgba(255,255,255,.12);
border-radius: 14px;
overflow: hidden;
background: rgba(7,10,16,.86);
backdrop-filter: blur(14px);
}

.trustItem {
padding: 18px;
border-right: 1px solid rgba(255,255,255,.10);
}

.trustItem:last-child { border-right: 0; }

.trustItem strong {
display: block;
font-size: 20px;
color: #32ff73;
}

.trustItem span {
display: block;
font-weight: 900;
margin-top: 2px;
}

.trustItem small {
display: block;
margin-top: 6px;
font-size: 11px;
line-height: 1.4;
color: rgba(255,255,255,.55);
}

.section {
max-width: 1240px;
margin: 0 auto;
padding: 72px 22px;
}

.section + .section {
border-top: 1px solid rgba(255,255,255,.045);
}

.sectionTop { padding-top: 54px; }

.businessSection {
padding-top: 54px;
padding-bottom: 54px;
}

.providerIntro {
max-width: 900px;
margin: -4px 0 24px;
color: rgba(255,255,255,.68);
line-height: 1.7;
}

.providerIntro strong {
color: #fff;
}

.providerHeading { margin-bottom: 22px; }

.featuredProviderCard {
display: grid;
grid-template-columns: minmax(300px, .85fr) minmax(0, 1.35fr);
gap: 0;
overflow: hidden;
border-radius: 20px;
border: 1px solid rgba(50,255,115,.42);
background:
radial-gradient(circle at 86% 10%, rgba(50,255,115,.09), transparent 30%),
#080b11;
box-shadow: 0 24px 70px rgba(0,0,0,.24);
}

.featuredProviderMedia {
position: relative;
min-height: 330px;
overflow: hidden;
background-color: #05070d;
background-size: cover;
background-position: center center;
background-repeat: no-repeat;
}

.featuredProviderMedia::after {
content: "";
position: absolute;
inset: 0;
background: linear-gradient(180deg, transparent 52%, rgba(5,7,13,.76) 100%);
pointer-events: none;
}

.featuredProviderMedia img {
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
display: block;
}

.featuredBadge {
position: absolute;
top: 18px;
left: 18px;
z-index: 2;
padding: 9px 12px;
border-radius: 999px;
background: rgba(5,7,13,.8);
border: 1px solid rgba(50,255,115,.46);
color: #32ff73;
font-size: 10px;
font-weight: 1000;
letter-spacing: 1.2px;
backdrop-filter: blur(12px);
}

.featuredProviderBody {
padding: 30px;
display: flex;
flex-direction: column;
justify-content: center;
}

.providerEyebrow {
margin: 0 0 10px;
color: #32ff73;
font-size: 11px;
font-weight: 1000;
letter-spacing: 1.8px;
}

.featuredProviderBody h3 {
margin: 0;
font-size: clamp(30px, 4vw, 48px);
line-height: .98;
letter-spacing: -1.7px;
}

.featuredProviderBody h4 {
margin: 12px 0 0;
color: #32ff73;
font-size: 18px;
}

.featuredProviderBody > p:not(.providerEyebrow) {
margin: 18px 0;
max-width: 720px;
color: rgba(255,255,255,.72);
font-size: 15px;
line-height: 1.7;
}

.providerServiceGrid {
display: grid;
grid-template-columns: repeat(2, minmax(0,1fr));
gap: 10px 20px;
margin: 4px 0 20px;
}

.providerServiceGrid span {
position: relative;
padding-left: 24px;
color: rgba(255,255,255,.9);
font-size: 14px;
font-weight: 800;
}

.providerServiceGrid span::before {
content: "✓";
position: absolute;
left: 0;
top: -1px;
width: 17px;
height: 17px;
display: inline-flex;
align-items: center;
justify-content: center;
border-radius: 999px;
border: 1px solid rgba(50,255,115,.58);
color: #32ff73;
font-size: 10px;
}

.providerCoverage {
margin-bottom: 22px;
padding: 13px 15px;
border-radius: 11px;
background: rgba(255,255,255,.045);
border: 1px solid rgba(255,255,255,.09);
color: rgba(255,255,255,.67);
font-size: 13px;
}

.providerCoverage strong { color: #fff; }

.featuredProviderActions {
display: flex;
gap: 12px;
flex-wrap: wrap;
}

.providerNotice {
display: block;
margin-top: 16px;
max-width: 700px;
color: rgba(255,255,255,.52);
font-size: 11px;
line-height: 1.55;
}

.additionalProviders { margin-top: 34px; }

.businessGrid {
display: grid;
grid-template-columns: repeat(3, minmax(0,1fr));
gap: 14px;
}

.businessCard {
overflow: hidden;
border-radius: 16px;
border: 1px solid rgba(255,255,255,.11);
background: #0a0d13;
}

.businessImage {
height: 180px;
overflow: hidden;
border-bottom: 1px solid rgba(255,255,255,.08);
}

.businessImage img {
width: 100%;
height: 100%;
object-fit: cover;
display: block;
}

.businessBody { padding: 19px; }

.businessBody h3 {
margin: 9px 0 0;
font-size: 22px;
line-height: 1.05;
}

.verifiedBadge {
display: inline-flex;
font-size: 9px;
letter-spacing: 1.4px;
font-weight: 1000;
color: #32ff73;
}

.businessBody > p {
margin: 16px 0;
color: rgba(255,255,255,.66);
font-size: 14px;
line-height: 1.6;
}

.businessActions {
display: flex;
flex-wrap: wrap;
gap: 8px;
}

.businessCall {
display: inline-flex;
align-items: center;
justify-content: center;
min-height: 40px;
padding: 10px 13px;
border-radius: 9px;
font-size: 12px;
font-weight: 950;
text-decoration: none;
background: #32ff73;
color: #05070d;
}

.sectionHeading {
display: flex;
align-items: end;
justify-content: space-between;
gap: 28px;
margin-bottom: 26px;
}

.label {
margin: 0 0 10px;
color: #32ff73;
letter-spacing: 2.1px;
font-weight: 1000;
font-size: 12px;
}

.section h2,
.ctaInner h2 {
font-size: clamp(30px, 4vw, 46px);
line-height: 1;
margin: 0;
font-weight: 1000;
letter-spacing: -1.5px;
}

.sectionIntro {
max-width: 390px;
margin: 0;
color: rgba(255,255,255,.62);
line-height: 1.6;
}

.serviceGrid {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
gap: 14px;
}

.serviceCard {
position: relative;
min-height: 290px;
border-radius: 16px;
overflow: hidden;
border: 1px solid rgba(255,255,255,.11);
color: #fff;
text-decoration: none;
background: #090c12;
}

.serviceImage {
position: absolute;
inset: 0;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
transition: transform .35s ease;
}

.serviceCard:hover .serviceImage { transform: scale(1.04); }

.serviceShade {
position: absolute;
inset: 0;
background: linear-gradient(180deg, rgba(5,7,13,.05), rgba(5,7,13,.28) 38%, rgba(5,7,13,.96) 100%);
}

.serviceContent {
position: absolute;
inset: 0;
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 18px;
}

.serviceNumber,
.featureIcon {
display: inline-flex;
width: 40px;
height: 40px;
align-items: center;
justify-content: center;
border-radius: 999px;
background: rgba(255,255,255,.055);
border: 1px solid rgba(255,255,255,.14);
color: #32ff73;
font-size: 12px;
font-weight: 1000;
}

.serviceCard h3 {
font-size: 22px;
line-height: 1.05;
margin: 0 0 8px;
}

.serviceCard p {
margin: 0;
font-size: 13px;
line-height: 1.45;
color: rgba(255,255,255,.68);
}

.serviceArrow {
position: absolute;
right: 18px;
bottom: 18px;
color: #32ff73;
font-size: 24px;
}

.featureGrid {
display: grid;
grid-template-columns: repeat(4, minmax(0,1fr));
gap: 14px;
}

.featureCard {
padding: 24px;
border-radius: 16px;
border: 1px solid rgba(255,255,255,.11);
background: linear-gradient(180deg, #0b0e14, #080b11);
}

.featureCard h3 {
font-size: 18px;
margin: 18px 0 10px;
}

.featureCard p {
margin: 0;
color: rgba(255,255,255,.62);
line-height: 1.55;
font-size: 14px;
}

.gallerySection { padding-top: 30px; }

.galleryGrid {
display: grid;
grid-template-columns: 1.5fr .75fr .75fr;
gap: 12px;
height: 360px;
}

.galleryGrid > div {
border-radius: 16px;
overflow: hidden;
border: 1px solid rgba(255,255,255,.1);
}

.galleryPhoto {
width: 100%;
height: 100%;
background-size: cover;
background-position: center;
background-repeat: no-repeat;
}

.twoColSection {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 46px;
padding-top: 30px;
}

.chipGrid,
.areaGrid,
.keywordGrid {
display: flex;
flex-wrap: wrap;
gap: 10px;
}

.chipGrid a,
.chipGrid span,
.areaGrid span,
.keywordGrid span {
padding: 11px 14px;
border-radius: 9px;
border: 1px solid rgba(255,255,255,.12);
background: #0a0d13;
color: rgba(255,255,255,.84);
font-size: 13px;
font-weight: 800;
text-decoration: none;
}

.areaGrid span {
border-color: rgba(255,255,255,.13);
background: #0a0d13;
}

.contentSection { padding-top: 36px; }

details {
margin-bottom: 12px;
border: 1px solid rgba(255,255,255,.11);
border-radius: 14px;
background: #0a0d13;
overflow: hidden;
}

summary {
cursor: pointer;
padding: 19px 22px;
font-size: 16px;
font-weight: 950;
list-style: none;
}

summary::-webkit-details-marker { display: none; }

summary::after {
content: "+";
float: right;
font-size: 21px;
color: #32ff73;
}

details[open] summary::after { content: "−"; }

.detailsBody {
padding: 0 22px 22px;
border-top: 1px solid rgba(255,255,255,.08);
}

.detailsBody p {
color: rgba(255,255,255,.74);
line-height: 1.75;
font-size: 15px;
white-space: pre-line;
}

.faqGrid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px;
padding-top: 22px;
}

.faqGrid div {
padding: 18px;
border-radius: 12px;
background: #0a0d13;
border: 1px solid rgba(255,255,255,.08);
}

.faqGrid h3 {
margin: 0 0 8px;
font-size: 15px;
}

.faqGrid p { margin: 0; }

.related {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: 12px;
}

.related a {
display: flex;
flex-direction: column;
gap: 10px;
padding: 18px;
border-radius: 14px;
border: 1px solid rgba(255,255,255,.11);
background: #0a0d13;
color: #fff;
text-decoration: none;
font-weight: 900;
}

.related small {
color: #32ff73;
font-weight: 900;
}

.ctaSection {
padding: 20px 22px 80px;
}

.ctaInner {
max-width: 1196px;
margin: 0 auto;
padding: 34px;
border-radius: 18px;
border: 1px solid rgba(50,255,115,.24);
background:
radial-gradient(circle at 85% 0%, rgba(255,255,255,.05), transparent 35%),
#0a0d13;
display: flex;
align-items: center;
justify-content: space-between;
gap: 30px;
}

.ctaInner p {
margin: 12px 0 0;
color: rgba(255,255,255,.62);
}

.footer {
border-top: 1px solid rgba(255,255,255,.08);
background: #04060b;
}

.footerInner {
max-width: 1240px;
margin: 0 auto;
padding: 44px 22px;
display: grid;
grid-template-columns: 2fr 1fr 1fr;
gap: 40px;
}

.footerBrand { font-size: 30px; }

.footer p {
max-width: 330px;
color: rgba(255,255,255,.5);
line-height: 1.6;
}

.footer strong {
display: block;
margin-bottom: 14px;
}

.footer a {
display: block;
margin: 9px 0;
color: rgba(255,255,255,.65);
text-decoration: none;
font-size: 14px;
}

.landingExpandedServices {
  padding-top: 32px;
  padding-bottom: 72px;
}

.landingExpandedIntro {
  max-width: 920px;
  margin-bottom: 30px;
}

.landingExpandedIntro > p:last-child {
  margin: 18px 0 0;
  color: rgba(255,255,255,.68);
  font-size: 17px;
  line-height: 1.9;
}

.landingExpandedGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  align-items: start;
}

.landingExpandedBox {
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 26px;
  background:
    radial-gradient(circle at 92% 8%, rgba(50,255,115,.07), transparent 30%),
    #070a0d;
}

.landingExpandedBox[open] {
  grid-column: 1 / -1;
  border-color: rgba(50,255,115,.38);
}

.landingExpandedBox summary {
  min-height: 280px;
  padding: 38px 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  list-style: none;
  cursor: pointer;
}

.landingExpandedBox summary::-webkit-details-marker {
  display: none;
}

.landingExpandedBox summary > div {
  max-width: 540px;
  display: flex;
  flex-direction: column;
}

.landingExpandedKicker {
  color: #32ff73;
  font-size: 11px;
  font-weight: 1000;
  letter-spacing: 4px;
}

.landingExpandedBox summary strong {
  margin-top: 20px;
  color: #fff;
  font-size: clamp(38px, 4.4vw, 58px);
  line-height: .96;
  letter-spacing: -2.6px;
}

.landingExpandedBox summary small {
  margin-top: 24px;
  color: rgba(255,255,255,.66);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.75;
}

.landingExpandedBox summary b {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(50,255,115,.55);
  border-radius: 50%;
  color: #32ff73;
  font-size: 34px;
  line-height: 1;
  transition: transform .2s ease;
}

.landingExpandedBox[open] summary b {
  transform: rotate(45deg);
}

.landingExpandedBody {
  max-width: 1050px;
  padding: 0 40px 42px;
}

.landingExpandedBody h3 {
  margin: 34px 0 12px;
  color: #fff;
  font-size: 25px;
  line-height: 1.15;
  letter-spacing: -.6px;
}

.landingExpandedBody h3:first-child {
  margin-top: 4px;
}

.landingExpandedBody p {
  margin: 0 0 20px;
  color: rgba(255,255,255,.71);
  font-size: 15px;
  line-height: 1.9;
}

.landingExpandedActions {
  margin-top: 34px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}


@media (max-width: 980px) {
.nav { display: none; }
.featuredProviderCard { grid-template-columns: 1fr; }
.featuredProviderMedia { min-height: 340px; }
.businessGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
.serviceGrid,
.featureGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
.galleryGrid { grid-template-columns: 1.2fr .8fr; }
.gallerySmall:last-child { display: none; }
}

@media (max-width: 760px) {
.landingExpandedServices { padding-top: 20px; padding-bottom: 54px; }
.landingExpandedIntro { margin-bottom: 22px; }
.landingExpandedIntro > p:last-child { font-size: 14px; line-height: 1.8; }
.landingExpandedGrid { grid-template-columns: 1fr; gap: 16px; }
.landingExpandedBox[open] { grid-column: auto; }
.landingExpandedBox { border-radius: 20px; }
.landingExpandedBox summary { min-height: 250px; padding: 28px 26px; gap: 16px; }
.landingExpandedKicker { font-size: 9px; letter-spacing: 3.4px; }
.landingExpandedBox summary strong { margin-top: 17px; font-size: 40px; letter-spacing: -2px; }
.landingExpandedBox summary small { margin-top: 20px; font-size: 13px; line-height: 1.7; }
.landingExpandedBox summary b { width: 52px; height: 52px; flex-basis: 52px; font-size: 31px; }
.landingExpandedBody { padding: 0 26px 30px; }
.landingExpandedBody h3 { margin-top: 28px; font-size: 21px; }
.landingExpandedBody p { font-size: 14px; line-height: 1.82; }
.landingExpandedActions { display: grid; grid-template-columns: 1fr; }
.landingExpandedActions .primaryBtn, .landingExpandedActions .secondaryBtn { width: 100%; }

.page { padding-bottom: 120px; }
.headerInner { padding: 12px 16px; }
.brand { font-size: 29px; }
.brandSub {
  display: block;
  margin-top: 6px;
  font-size: 8px;
  letter-spacing: 1.5px;
  white-space: nowrap;
}
.headerCall { padding: 9px 12px; font-size: 12px; }

.hero { min-height: 680px; }
.heroImg { object-position: 67% center; }
.heroShade {
background:
linear-gradient(90deg, rgba(5,7,13,.94), rgba(5,7,13,.56)),
linear-gradient(180deg, rgba(5,7,13,.1), rgba(5,7,13,.35) 60%, #05070d 100%);
}
.heroInner { padding: 40px 18px 24px; }
.heroCopy { max-width: 100%; }
.greenPill { transform: translateY(-18px); margin-bottom: -10px; }
h1 { font-size: 42px; max-width: 350px; margin-top: 14px; }
.intro { font-size: 15.5px; max-width: 335px; }
.heroTrust { grid-template-columns: repeat(2,1fr); }
.trustItem:nth-child(2) { border-right: 0; }
.trustItem:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,.1); }
/* MOBILE HERO IMAGE — SHOW MORE OF THE FULL PHOTO */
.hero {
min-height: 580px;
}

.heroImg {
object-fit: contain;
object-position: 70% top;
background: #05070d;
filter: none;
}

.heroShade {
background:
linear-gradient(
90deg,
rgba(5, 7, 13, 0.82) 0%,
rgba(5, 7, 13, 0.56) 42%,
rgba(5, 7, 13, 0.18) 100%
),
linear-gradient(
180deg,
rgba(5, 7, 13, 0.04),
rgba(5, 7, 13, 0.16) 65%,
#05070d 100%
);
}

/* MAKE THE FOUR TRUST BOXES SMALLER */
.heroTrust {
margin-top: 24px;
border-radius: 12px;
}

.trustItem {
min-height: 94px;
padding: 12px 14px;
}

.trustItem strong {
font-size: 17px;
}

.trustItem span {
font-size: 13px;
}

.trustItem small {
margin-top: 4px;
font-size: 10px;
line-height: 1.3;
}
.section { padding: 54px 18px; }
.sectionHeading { align-items: flex-start; flex-direction: column; }
.sectionIntro { max-width: 100%; }

.featuredProviderCard,
.businessGrid,
.serviceGrid,
.featureGrid,
.twoColSection,
.faqGrid { grid-template-columns: 1fr; }

.featuredProviderCard { grid-template-columns: 1fr; border-radius: 16px; }
.businessSection { padding-top: 42px; padding-bottom: 72px; }
.providerHeading { margin-bottom: 16px; }
.featuredProviderMedia {
min-height: 245px;
background-position: center 58%;
}

.featuredBadge { top: 12px; left: 12px; padding: 8px 10px; font-size: 9px; }
.featuredProviderBody { padding: 20px 18px 24px; }
.providerEyebrow { margin-bottom: 7px; font-size: 9px; letter-spacing: 1.35px; }
.featuredProviderBody h3 { font-size: 28px; line-height: 1.02; }
.featuredProviderBody h4 { margin-top: 8px; font-size: 16px; }
.featuredProviderBody > p:not(.providerEyebrow) { margin: 13px 0; font-size: 13px; line-height: 1.55; }
.providerServiceGrid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px 12px; margin-bottom: 14px; }
.providerServiceGrid span { padding-left: 21px; font-size: 12px; line-height: 1.3; }
.providerCoverage { margin-bottom: 14px; padding: 10px 12px; font-size: 11px; }
.featuredProviderActions { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.featuredProviderActions .primaryBtn,
.featuredProviderActions .secondaryBtn { width: 100%; min-width: 0; padding: 13px 10px; font-size: 12px; }
.providerNotice { margin-top: 11px; font-size: 10px; }

.serviceCard { min-height: 260px; }

.galleryGrid {
grid-template-columns: 1fr 1fr;
height: 300px;
}
.galleryLarge { grid-column: 1 / -1; }
.gallerySmall { height: 120px; }
.gallerySmall:last-child { display: block; }

.twoColSection { gap: 44px; }

.ctaInner {
padding: 28px;
align-items: flex-start;
flex-direction: column;
}

.footerInner { grid-template-columns: 1fr; gap: 24px; }
}
`}</style>
    </main>
  );
}