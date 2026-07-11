
export type LandingPageLike = {
  slug?: string | null;
  headline?: string | null;
};

type PageType =
  | "tyre"
  | "recovery"
  | "custom";

const CONTENT_VERSION = "ADFORGE_SEO_ENGINE_V4";

function titleCase(value: string) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

function normalise(value: string) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hashText(value: string) {
  return Array.from(value).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );
}

function rotateItems<T>(items: T[], seedText: string, amount?: number) {
  if (!items.length) return [];
  const start = hashText(seedText) % items.length;
  const rotated = [...items.slice(start), ...items.slice(0, start)];
  return typeof amount === "number" ? rotated.slice(0, amount) : rotated;
}

function detectPageType(page: LandingPageLike): PageType {
  const source = `${page.slug || ""} ${page.headline || ""}`.toLowerCase();

  if (
    source.includes("tyre") ||
    source.includes("puncture") ||
    source.includes("locking wheel") ||
    source.includes("locking-wheel") ||
    source.includes("run flat") ||
    source.includes("run-flat")
  ) {
    return "tyre";
  }

  if (
    source.includes("recovery") ||
    source.includes("breakdown") ||
    source.includes("towing") ||
    source.includes("tow truck") ||
    source.includes("vehicle transport") ||
    source.includes("roadside assistance")
  ) {
    return "recovery";
  }

  return "custom";
}

function extractLocation(page: LandingPageLike) {
  const headline = normalise(
    page.headline || titleCase(page.slug || "") || "Local Area"
  );

  const cleaned = headline
    .replace(/^24\s*hour\s*/i, "")
    .replace(/^emergency\s*/i, "")
    .replace(/^same\s*day\s*/i, "")
    .replace(/mobile\s*tyre\s*fitting/gi, "")
    .replace(/mobile\s*tyre\s*replacement/gi, "")
    .replace(/emergency\s*tyre\s*replacement/gi, "")
    .replace(/mobile\s*puncture\s*repair/gi, "")
    .replace(/puncture\s*repair/gi, "")
    .replace(/roadside\s*tyre\s*replacement/gi, "")
    .replace(/locking\s*wheel\s*nut\s*removal/gi, "")
    .replace(/vehicle\s*breakdown\s*recovery\s*service/gi, "")
    .replace(/vehicle\s*breakdown\s*service/gi, "")
    .replace(/breakdown\s*recovery\s*service/gi, "")
    .replace(/vehicle\s*recovery\s*service/gi, "")
    .replace(/emergency\s*vehicle\s*recovery/gi, "")
    .replace(/roadside\s*assistance/gi, "")
    .replace(/vehicle\s*transport/gi, "")
    .replace(/accident\s*recovery/gi, "")
    .replace(/car\s*towing\s*service/gi, "")
    .replace(/car\s*towing/gi, "")
    .replace(/recovery\s*service/gi, "")
    .replace(/vehicle\s*recovery/gi, "")
    .replace(/breakdown\s*recovery/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return titleCase(cleaned || "Your Local Area");
}

function extractService(page: LandingPageLike) {
  const location = extractLocation(page);
  const headline = normalise(
    page.headline || titleCase(page.slug || "") || "Local Service"
  );

  const service = headline
    .replace(new RegExp(`${location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"), "")
    .trim();

  return service || "Local Service";
}

function getNearbyAreas(location: string) {
  const key = location.toLowerCase();

  const map: Record<string, string[]> = {
    liverpool: [
      "Bootle", "Anfield", "Aigburth", "Wavertree", "Speke", "Garston",
      "Huyton", "Kirkby", "Prescot", "Toxteth", "Allerton", "Childwall",
    ],
    bootle: [
      "Netherton", "Litherland", "Seaforth", "Walton", "Aintree",
      "Crosby", "Liverpool", "Orrell", "Ford", "Old Roan",
    ],
    netherton: [
      "Bootle", "Aintree", "Litherland", "Seaforth", "Walton",
      "Crosby", "Orrell", "Maghull", "Old Roan", "Kirkdale",
    ],
    wirral: [
      "Birkenhead", "Wallasey", "Moreton", "Heswall", "West Kirby",
      "Bromborough", "Hoylake", "Upton", "Bebington", "Ellesmere Port",
    ],
    wallasey: [
      "New Brighton", "Liscard", "Seacombe", "Moreton", "Birkenhead",
      "Leasowe", "Upton", "Wirral", "Egremont", "Poulton",
    ],
    southport: [
      "Birkdale", "Ainsdale", "Formby", "Churchtown", "Banks",
      "Hesketh Bank", "Ormskirk", "Crossens", "Hillside", "Scarisbrick",
    ],
    "st helens": [
      "Prescot", "Rainhill", "Haydock", "Newton-le-Willows", "Sutton",
      "Thatto Heath", "Eccleston", "Widnes", "Whiston", "Billinge",
    ],
    warrington: [
      "Widnes", "Runcorn", "Lymm", "Great Sankey", "Winwick",
      "Newton-le-Willows", "St Helens", "Birchwood", "Padgate", "Stockton Heath",
    ],
    widnes: [
      "Runcorn", "Huyton", "Prescot", "St Helens", "Warrington",
      "Speke", "Hale", "Cronton", "Halewood", "Farnworth",
    ],
    formby: [
      "Ainsdale", "Southport", "Crosby", "Hightown",
      "Freshfield", "Maghull", "Ormskirk", "Thornton",
    ],
    birkenhead: [
      "Wallasey", "Bebington", "Tranmere", "Prenton",
      "Oxton", "Upton", "Rock Ferry", "Moreton",
    ],
  };

  const match = Object.keys(map).find((name) => key.includes(name));
  if (match) return map[match];

  return rotateItems(
    [
      "nearby towns",
      "surrounding districts",
      "local villages",
      "business parks",
      "industrial estates",
      "retail parks",
      "residential areas",
      "nearby motorway junctions",
      "town centres",
      "workplace locations",
    ],
    location
  );
}

function getRoads(location: string) {
  const key = location.toLowerCase();

  const map: Record<string, string[]> = {
    liverpool: [
      "M62", "M57", "A580", "Queens Drive", "Edge Lane",
      "Dock Road", "Aigburth Road", "Speke Boulevard", "Scotland Road", "Prescot Road",
    ],
    bootle: [
      "A5036", "Derby Road", "Stanley Road", "Dunnings Bridge Road",
      "M57", "M58", "Switch Island", "Hawthorne Road",
    ],
    netherton: [
      "A5036", "Dunnings Bridge Road", "Park Lane", "Copy Lane",
      "M57", "M58", "Switch Island", "Northern Perimeter Road",
    ],
    wirral: [
      "M53", "A41", "A552", "New Chester Road",
      "Woodchurch Road", "Dock Road", "Kingsway Tunnel", "Queensway Tunnel",
    ],
    southport: [
      "A565", "Marine Drive", "Lord Street", "Scarisbrick New Road",
      "Coastal Road", "Liverpool Road", "Cambridge Road",
    ],
    "st helens": [
      "A580", "M62", "A570", "Linkway",
      "East Lancashire Road", "Prescot Road", "Rainford Road",
    ],
    warrington: [
      "M6", "M62", "M56", "A49", "A57",
      "Winwick Road", "Knutsford Road", "Manchester Road",
    ],
    widnes: [
      "A562", "A557", "M62", "Speke Road",
      "Queensway", "Fiddlers Ferry Road", "Liverpool Road",
    ],
  };

  const match = Object.keys(map).find((name) => key.includes(name));
  if (match) return map[match];

  return [
    "local main roads",
    "nearby dual carriageways",
    "residential streets",
    "business parks",
    "industrial estates",
    "retail parks",
    "motorway routes",
    "town-centre roads",
  ];
}

function getLocalPlaces(location: string) {
  return rotateItems(
    [
      `${location} town centre`,
      "supermarket car parks",
      "retail parks",
      "industrial estates",
      "business parks",
      "workplace car parks",
      "railway stations",
      "hotels",
      "hospitals",
      "schools and colleges",
      "petrol stations",
      "residential estates",
      "garage forecourts",
      "shopping areas",
      "delivery yards",
      "public car parks",
    ],
    location,
    12
  );
}

function getVehicleTypes(seed: string) {
  return rotateItems(
    [
      "cars", "vans", "SUVs", "4x4 vehicles", "electric vehicles",
      "hybrid vehicles", "light commercial vehicles", "company cars",
      "fleet vehicles", "taxis", "private-hire vehicles", "courier vans",
      "delivery vehicles", "campervans", "family cars", "performance vehicles",
    ],
    seed,
    14
  );
}

function getTyreBrands(seed: string) {
  return rotateItems(
    [
      "Michelin", "Continental", "Goodyear", "Pirelli", "Bridgestone",
      "Hankook", "Dunlop", "Yokohama", "Avon", "Firestone",
      "Falken", "Kumho", "Nexen", "Toyo", "General Tire", "budget tyre ranges",
    ],
    seed,
    12
  );
}

function getVehicleMakes(seed: string) {
  return rotateItems(
    [
      "BMW", "Audi", "Mercedes-Benz", "Ford", "Vauxhall",
      "Volkswagen", "Toyota", "Nissan", "Kia", "Hyundai",
      "Tesla", "Land Rover", "Range Rover", "Peugeot", "Renault",
      "Citroën", "Volvo", "Skoda", "SEAT", "Honda",
    ],
    seed,
    15
  );
}

function buildRecoveryContent(page: LandingPageLike) {
  const location = extractLocation(page);
  const seed = `${page.slug || ""}-${location}`;
  const nearby = getNearbyAreas(location);
  const roads = getRoads(location);
  const places = getLocalPlaces(location);
  const vehicles = getVehicleTypes(seed);

  const faults = rotateItems(
    [
      "flat battery", "starter motor failure", "alternator fault",
      "engine failure", "clutch failure", "gearbox problem",
      "overheating", "coolant loss", "electrical fault",
      "warning lights", "accident damage", "suspension damage",
      "steering problem", "wheel damage", "fuel-system problem",
      "non-starting vehicle", "unsafe vehicle", "broken drive belt",
      "oil leak", "locked steering",
    ],
    seed
  );

  return `${CONTENT_VERSION}

# 24 Hour Vehicle Recovery in ${location}

AdForge helps drivers find local vehicle recovery, breakdown recovery and roadside assistance in ${location}. When a car, van, motorcycle, SUV, 4x4 or light commercial vehicle cannot be driven safely, AdForge provides a clear route to local recovery information and contact options.

Customers commonly search for 24 hour recovery near me, breakdown recovery ${location}, car recovery, van recovery, tow truck near me, accident recovery, motorway recovery, vehicle transport and roadside assistance. This page is written around those real services rather than simply repeating a place name.

# Recovery Services Available Through AdForge

AdForge recovery pages explain the main services drivers may need:

• 24 Hour Breakdown Recovery
• Emergency Vehicle Recovery
• Car Recovery
• Van Recovery
• Motorcycle Recovery
• Accident Recovery
• Vehicle Transport
• Long Distance Recovery
• Motorway Recovery
• Roadside Assistance
• Flat Battery Assistance
• Jump Starts
• Home Starts
• Non Runner Recovery
• Winching Where Available
• Wrong Fuel Assistance Where Available
• Fleet and Commercial Recovery
• Auction and Garage Transport

AdForge continually links drivers with relevant local recovery information so customers can understand the service before they call.

# 24 Hour Breakdown Recovery

Breakdowns do not follow office hours. Vehicles can fail early in the morning, late at night, during weekends or on bank holidays. A 24 hour recovery service may be needed when a vehicle will not start, loses power, overheats, develops a clutch or gearbox fault, suffers electrical failure or becomes unsafe to drive.

AdForge is designed to make 24 hour breakdown recovery easier to find in ${location}. Drivers can use the page to identify common services, explain the fault and arrange help without searching through multiple unrelated listings.

# Accident Recovery

Accident recovery may be required when a vehicle has body damage, broken suspension, damaged steering, deployed airbags, leaking fluids or wheels that no longer roll correctly. Even when a vehicle still starts, it may not be safe or legal to drive.

AdForge pages highlight accident recovery because it is a major part of local recovery work. The vehicle may need careful loading and transport to a garage, repair centre, storage yard, insurer-approved site or home address.

# Vehicle Transport

Vehicle transport is useful for non-runners, auction purchases, garage transfers, classic cars, project vehicles, newly purchased vehicles and vehicles that need to be moved without being driven.

Through AdForge, customers can find information about local vehicle transport in ${location}, including short-distance and long-distance movements. Accurate details about the vehicle condition, size and destination help the provider bring the right equipment.

# Car, Van and Motorcycle Recovery

Recovery may be suitable for ${vehicles.join(", ")}.

Cars, vans and motorcycles often need different loading methods. Low vehicles, automatic vehicles, electric vehicles, four-wheel-drive vehicles and motorcycles should be described clearly when calling. AdForge encourages customers to give the make, model, registration and condition so the job can be assessed properly.

# Flat Battery Help and Jump Starts

A flat battery is one of the most common roadside problems. Batteries may fail because of age, cold weather, lights being left on, charging faults or long periods without use.

A jump start may get the vehicle moving, but repeat failure may point to a battery, alternator or charging-system problem. AdForge recovery pages explain when a jump start may help and when full recovery to a garage is safer.

# Home Starts and Roadside Assistance

Some drivers discover a fault before leaving home. Home-start assistance can be useful for a flat battery, non-starting engine, electrical fault or warning light.

Roadside assistance may involve basic checks, battery support or making the vehicle safe. When the problem cannot be resolved safely, recovery may be arranged. AdForge presents both roadside assistance and recovery information on the same local page.

# Winching and Difficult Access

Vehicles may become stuck in mud, grass, soft ground, snow, flood water, steep driveways or awkward car parks. Winching may be available depending on the location, vehicle and access.

Customers should tell the provider about narrow entrances, low ceilings, underground parking, height restrictions, locked wheels, damaged suspension or a vehicle that cannot roll. AdForge encourages clear information so unsuitable equipment is not sent.

# Wrong Fuel and Fuel Problems

Putting the wrong fuel into a vehicle can cause serious damage if the engine is started or driven. Where wrong-fuel assistance is available, the provider may advise whether the vehicle can be drained locally or needs recovery.

Running out of fuel can also leave a driver stranded. AdForge pages mention fuel-related assistance because customers often search for wrong fuel recovery, fuel delivery or breakdown help near me.

# Local Recovery Around ${location}

Recovery may be requested from ${places.join(", ")} and other locations throughout ${location}.

AdForge repeatedly connects the service with the local area so customers and search engines can understand that the page is about recovery work in ${location}, not generic national advice.

# Roads and Motorway Routes

Drivers may need help on or near ${roads.join(", ")}. Searches often include recovery near ${roads[0]}, tow truck near ${roads[1]}, breakdown recovery open now and motorway assistance.

Busy roads, poor weather, darkness and roadworks increase risk. If the vehicle is in a dangerous position, safety comes before the vehicle. Switch on hazard lights, move away from traffic where possible and contact emergency services if there is an immediate danger.

# Nearby Areas Covered

This AdForge page focuses on ${location}, but recovery may also be needed across ${nearby.join(", ")} and surrounding districts.

Customers may search by town, village, postcode, motorway junction, retail park, industrial estate or nearby landmark. Including nearby areas makes the page genuinely useful for local searches.

# Common Breakdown Faults

Drivers in ${location} may need AdForge recovery information because of a ${faults.join(", ")}.

Some faults stop the vehicle immediately. Others allow limited movement but make continued driving unsafe. Overheating, oil-pressure warnings, steering faults, suspension damage, severe vibration and accident damage should not be ignored.

# Engine, Clutch and Gearbox Failure

Engine problems may include loss of power, smoke, unusual noises, warning lights or complete failure to start. Clutch and gearbox faults may cause difficulty selecting gears, slipping, grinding noises or a vehicle that will not move.

AdForge explains these faults because they are common reasons for breakdown recovery. Stopping early can reduce further damage and make recovery safer.

# Electric and Hybrid Vehicle Recovery

Electric and hybrid vehicles may need specialist loading and transport. A provider should know the vehicle type before attendance, especially when the wheels are locked or the vehicle cannot select neutral.

AdForge includes electric vehicle recovery information so modern vehicle owners can find a relevant local service page rather than a generic towing result.

# Fleet, Taxi and Commercial Recovery

A breakdown can interrupt deliveries, customer appointments and working time. Taxi drivers, couriers, tradespeople and fleet operators may need fast local recovery to reduce downtime.

AdForge recovery pages cover fleet vehicles, company vans and commercial call-outs as well as private cars.

# What Happens When You Call

1. Give the exact location and postcode.
2. State the vehicle make, model and registration.
3. Explain the fault, damage or warning lights.
4. Confirm whether the vehicle rolls, steers and brakes.
5. State the destination required.
6. Mention passengers, access limits and safety concerns.

AdForge encourages clear information because it helps the provider assess the job and arrive with suitable equipment.

# Safety Advice While Waiting

On a motorway or fast road, move to a refuge area or hard shoulder if possible. Leave from the passenger side and wait behind the barrier where it is safe. Do not stand between the vehicle and moving traffic.

On local roads, use hazard lights and move passengers away from danger. Never work beneath a vehicle at the roadside.

# Frequently Asked Questions

## Is 24 hour recovery available in ${location}?

Availability depends on the provider and current workload, but AdForge pages are designed around emergency and out-of-hours recovery searches.

## Can a van be recovered?

Many providers recover vans and light commercial vehicles. Give the size and approximate weight when calling.

## Can a motorcycle be recovered?

Motorcycle recovery may be available using suitable transport equipment.

## Can an electric vehicle be recovered?

Yes, but the provider should know the vehicle is electric or hybrid before attendance.

## Can an accident-damaged vehicle be moved?

Yes, subject to access and vehicle condition. Explain damage to wheels, steering, suspension and bodywork.

## Can the vehicle be taken to my own garage?

Customers can usually request transport to a garage, dealership, home, storage site or another agreed destination.

## Is motorway recovery available?

Motorway recovery may be available. Give the motorway, direction, junction and marker information.

## Can a non-runner be transported?

Yes. AdForge pages cover non-running vehicle transport, auction collection and garage transfers.

## Can recovery help with a flat battery?

Jump-start or battery assistance may be possible. Full recovery may be needed when the vehicle will not restart reliably.

## Do providers cover ${nearby[0]} and ${nearby[1]}?

Nearby coverage may be available depending on location and workload.

# Popular Recovery Keywords

24 hour recovery ${location}, breakdown recovery ${location}, vehicle recovery near me, car recovery, van recovery, motorcycle recovery, tow truck near me, roadside assistance, accident recovery, motorway recovery, vehicle transport, long distance recovery, flat battery help, jump start, home start, non runner recovery and emergency towing.

# Choose AdForge for Local Recovery Information

AdForge is building a trusted local-service platform for drivers who need breakdown recovery, accident recovery, vehicle transport and roadside assistance. If a vehicle is broken down, damaged or unsafe in ${location}, use AdForge to find clear local information and arrange help. `;
}

function buildTyreContent(page: LandingPageLike) {
  const location = extractLocation(page);
  const seed = `${page.slug || ""}-${location}`;
  const nearby = getNearbyAreas(location);
  const roads = getRoads(location);
  const places = getLocalPlaces(location);
  const vehicles = getVehicleTypes(seed);
  const tyreBrands = getTyreBrands(seed);
  const vehicleMakes = getVehicleMakes(seed);

  const tyreProblems = rotateItems(
    [
      "flat tyre", "nail puncture", "screw puncture", "slow puncture",
      "tyre blowout", "damaged sidewall", "split tyre", "cracked tyre",
      "low tread", "uneven tyre wear", "valve leak", "TPMS warning",
      "locking wheel nut problem", "run-flat tyre failure", "wheel damage",
      "pressure loss", "pothole damage", "emergency tyre replacement",
    ],
    seed
  );

  return `${CONTENT_VERSION}

# Mobile Tyre Fitting in ${location}

AdForge helps drivers find mobile tyre fitting, tyre fitters, new tyres, part worn tyres, puncture repairs, locking wheel nut removal and wheel balancing in ${location}. This page is focused on the actual tyre services customers need, with local information added around the service.

Customers commonly search for mobile tyre fitting near me, 24 hour mobile tyre fitting, emergency tyre fitter, tyres near me, new tyres, part worn tyres, puncture repair, locking nut removal, wheel balancing and roadside tyre replacement. AdForge brings those services together on one clear local page.

# Mobile Tyre Services Available Through AdForge

AdForge mobile tyre pages cover:

• New Tyres
• Part Worn Tyres
• Budget Tyres
• Premium Tyres
• 24 Hour Mobile Tyre Fitting
• Emergency Mobile Tyre Fitting
• Mobile Tyre Fitters
• Roadside Tyre Replacement
• Home Tyre Fitting
• Workplace Tyre Fitting
• Puncture Repairs
• Slow Puncture Repairs
• Locking Wheel Nut Removal
• Wheel Balancing
• Valve Replacement
• TPMS Support
• Run Flat Tyres
• Van Tyres
• Commercial Tyres
• All Season Tyres
• Summer Tyres
• Winter Tyres

The main purpose of AdForge is to associate local customers with useful service information, not simply to repeat a location name.

# New Tyres in ${location}

New tyres are a major part of mobile tyre fitting. AdForge pages explain new tyre options for drivers who need a replacement after a puncture, blowout, sidewall cut, low tread, cracking, uneven wear or MOT advisory.

New tyres may be available in budget, mid-range and premium ranges. The right choice depends on tyre size, annual mileage, vehicle type, driving conditions and budget. A new tyre should match the correct width, profile, wheel diameter, load index and speed rating.

AdForge continually mentions new tyres because customers regularly search for new tyres near me, cheap new tyres, premium tyres, same-day tyres and mobile new tyre fitting.

# Part Worn Tyres in ${location}

Part worn tyres are also an important service for many customers. A legal part worn tyre should be inspected carefully, marked correctly and have sufficient tread and no dangerous structural damage.

AdForge pages clearly mention part worn tyres so customers searching for part worn tyres near me, cheap part worn tyres, mobile part worn tyre fitting and same-day part worn tyres can find a relevant local page.

Part worn tyres may provide a lower-cost option, but safety and condition matter. The tyre should have no exposed cords, serious sidewall damage, bulges or unsafe repairs. Availability depends on the exact tyre size.

# Budget and Premium Tyres

Budget tyres can be suitable for customers looking for an affordable replacement. Premium tyres may offer different performance, comfort, wet grip, noise and mileage characteristics.

Depending on size and availability, tyre brands may include ${tyreBrands.join(", ")}. AdForge does not assume one brand suits every driver; it helps customers understand that tyre size and safe fitting come first.

# 24 Hour Mobile Tyre Fitting

Tyre problems can happen at any time. A 24 hour mobile tyre fitting service may be needed during the night, early morning, weekend, bank holiday or before an urgent journey.

AdForge pages are written around 24 hour mobile tyre fitting searches because emergency call-outs are one of the main reasons drivers look for a mobile tyre fitter. A tyre fitter may attend the customer at home, work or roadside when the location is safe.

# Emergency Mobile Tyre Fitting

Emergency mobile tyre fitting is useful after a blowout, sudden pressure loss, damaged sidewall, pothole impact or tyre failure. Driving further can damage the wheel and make the vehicle harder to control.

AdForge makes emergency tyre fitting easier to find by connecting service terms such as emergency tyre replacement, roadside tyre fitter, tyre fitter open now and mobile tyre fitting near me with ${location}.

# Mobile Tyre Fitters

A mobile tyre fitter brings fitting equipment directly to the vehicle. This can save customers from arranging recovery, driving on a damaged tyre or waiting at a garage.

AdForge pages repeatedly use the terms tyre fitter and mobile tyre fitter naturally because those are the phrases customers use. Mobile tyre fitters may attend ${places.join(", ")} and other locations around ${location}.

# Puncture Repairs

Puncture repairs are one of the most requested tyre services. A puncture may be repairable when the damage is small, located within the repairable central tread area and the tyre has not been driven while flat.

The tyre should be removed and inspected internally. Sidewall punctures, severe damage, exposed cords and some previous repairs make a tyre unsuitable for repair.

AdForge includes puncture repairs throughout the page because drivers search for puncture repair near me, mobile puncture repair, slow puncture repair and emergency puncture help.

# Slow Punctures

A slow puncture may be caused by a nail, screw, leaking valve, corroded wheel rim or poor seal. Repeatedly adding air does not fix the cause.

A mobile tyre fitter may inspect the tyre, valve and wheel to decide whether a safe puncture repair is possible or a replacement tyre is required.

# Locking Wheel Nut Removal

A missing, damaged or rounded locking wheel nut key can prevent wheel removal. Locking wheel nut removal may be required before a new tyre, part worn tyre or puncture repair can be completed.

Customers should check the glovebox, boot, tool kit and spare-wheel area for the key. AdForge specifically highlights locking wheel nut removal because it is a common emergency search and an important mobile tyre service.

# Wheel Balancing

Wheel balancing helps reduce vibration and uneven tyre wear. After a tyre is fitted, balancing weights are used to distribute the wheel and tyre assembly evenly.

Drivers may notice steering-wheel vibration at speed when balancing is incorrect. AdForge pages mention wheel balancing as part of a complete tyre fitting service rather than treating tyre replacement as the only job.

# Valve Replacement and TPMS

A leaking valve can cause repeated pressure loss. Rubber valves may need replacing during fitting, while some vehicles use tyre-pressure-monitoring sensors.

A TPMS warning can indicate low pressure, a puncture or a sensor problem. AdForge explains valve replacement and TPMS support because they are closely connected to punctures and tyre fitting.

# Run Flat Tyres

Run flat tyres are designed to travel a limited distance after pressure loss, but speed and distance restrictions apply. Driving too far can damage the tyre internally and make repair impossible.

Tell the mobile tyre fitter when the vehicle uses run flat tyres. AdForge includes run flat tyre replacement for drivers searching for specialist mobile tyre services.

# Van and Commercial Tyres

Tradespeople, couriers, delivery drivers and businesses often need van tyres or light commercial tyres quickly to reduce downtime.

Van tyres may require higher load ratings than car tyres. AdForge pages include van tyre fitting and commercial tyre fitting so business users can find a service relevant to their vehicle.

# Home Tyre Fitting

Home tyre fitting is useful when a vehicle is parked on a driveway or safe residential road. Customers can arrange new tyres, part worn tyres or puncture repairs without travelling to a depot.

AdForge helps customers find home tyre fitting in ${location} and nearby areas.

# Workplace Tyre Fitting

Workplace tyre fitting allows employees, taxi drivers, tradespeople and fleet vehicles to receive tyre help while parked safely at work.

Customers should confirm parking permission and provide access details. AdForge includes workplace tyre fitting because convenience is one of the main benefits of a mobile tyre fitter.

# Tyres for Different Vehicles

Mobile fitting may be suitable for ${vehicles.join(", ")}.

Common vehicle makes include ${vehicleMakes.join(", ")}. The exact tyre size must still be confirmed because different models and trim levels can use different wheels.

# How to Read a Tyre Size

A typical tyre size looks like 205/55 R16 91V.

205 is the tyre width in millimetres.
55 is the sidewall profile.
R16 means a 16-inch wheel.
91 is the load index.
V is the speed rating.

AdForge encourages customers to provide the full tyre size so a mobile tyre fitter can check new tyre or part worn tyre availability before travelling.

# Common Tyre Problems

Drivers in ${location} may need AdForge tyre information because of a ${tyreProblems.join(", ")}.

Some problems can be repaired. Others require a new tyre or part worn tyre replacement. Sidewall damage, bulges, exposed cords and severe cracking should not be ignored.

# Sidewall Damage and Blowouts

Sidewall cuts and bulges usually require tyre replacement because the sidewall carries structural load. A blowout can cause sudden pressure loss and loss of control.

Slow down carefully, avoid harsh steering and stop somewhere safe. AdForge helps customers find emergency tyre fitters for these situations.

# Pothole and Wheel Damage

Potholes and kerb impacts can damage tyres, wheels, tracking and suspension. A bent or cracked wheel may cause repeated pressure loss even after a tyre is changed.

The mobile tyre fitter should be told about wheel damage before attendance.

# Local Tyre Fitting Around ${location}

Tyre assistance may be requested from ${places.join(", ")} and other locations across ${location}.

AdForge keeps the service central while also providing local relevance. The page is about mobile tyre fitting, new tyres, part worn tyres and puncture repairs in ${location}, not generic tyre advice.

# Roads and Motorway Routes

Drivers may need a mobile tyre fitter on or near ${roads.join(", ")}. Searches often include mobile tyre fitter near ${roads[0]}, puncture repair near ${roads[1]}, tyre replacement open now and emergency tyres near me.

Roadside fitting requires a safe working area. A live lane, blind bend or fast-moving traffic may make fitting unsafe.

# Nearby Areas Covered

This AdForge page focuses on ${location}, but mobile tyre fitting may also be available across ${nearby.join(", ")} and surrounding districts.

# Seasonal Tyre Advice

Cold weather can reduce tyre pressure. Heavy rain makes tread depth and wet grip more important. Summer heat can expose existing tyre weakness.

Before long journeys, check tread, pressure, sidewalls and the spare tyre or inflation kit. AdForge pages include seasonal advice because emergency call-outs often increase during bad weather and busy travel periods.

# What Happens When You Call

1. Give the exact location and postcode.
2. Read the full tyre size from the sidewall.
3. Explain whether you want new tyres, part worn tyres or a puncture repair.
4. Mention a missing locking wheel nut key.
5. State whether the tyre is completely flat or the wheel is damaged.
6. Confirm that the vehicle is parked somewhere safe.

Clear details help the tyre fitter check stock and bring the correct equipment.

# Frequently Asked Questions

## Do you supply new tyres?

New tyres may be available in budget, mid-range and premium options depending on size and stock.

## Do you supply part worn tyres?

Part worn tyres may be available for selected sizes. Condition and legal safety requirements are important.

## Can a puncture be repaired?

A puncture may be repairable after inspection when its position and size meet safety standards.

## Can you remove locking wheel nuts?

Locking wheel nut removal may be available when the key is missing or damaged.

## Is wheel balancing included?

Wheel balancing may be included with fitting or offered as an additional service. Confirm when booking.

## Is 24 hour mobile tyre fitting available?

Availability depends on the local tyre fitter and current workload, but AdForge pages target emergency and out-of-hours tyre searches.

## Can tyres be fitted at home?

Home fitting may be available where the vehicle is parked safely and there is enough working space.

## Can tyres be fitted at work?

Workplace fitting may be available with safe access and permission.

## Can you fit van tyres?

Van and commercial tyre fitting may be available. Give the tyre size and vehicle details.

## Do providers cover ${nearby[0]} and ${nearby[1]}?

Nearby coverage depends on fitter location, stock and workload.

# Popular Tyre Keywords

mobile tyre fitting ${location}, 24 hour mobile tyre fitting, emergency tyre fitter, mobile tyre fitter near me, new tyres, part worn tyres, cheap tyres, budget tyres, premium tyres, puncture repairs, slow puncture repair, locking wheel nut removal, wheel balancing, valve replacement, run flat tyres, van tyres, roadside tyre fitting, home tyre fitting and workplace tyre fitting.

# Choose AdForge for Mobile Tyre Information

AdForge is building a trusted local-service platform for customers who need mobile tyre fitting, new tyres, part worn tyres, puncture repairs, locking wheel nut removal, wheel balancing and 24 hour emergency tyre call-outs. If you need a tyre fitter in ${location}, use AdForge to find clear local information and arrange help. `;
}

function buildCustomContent(page: LandingPageLike) {
  const location = extractLocation(page);
  const service = extractService(page);
  const seed = `${page.slug || ""}-${service}-${location}`;
  const nearby = getNearbyAreas(location);
  const roads = getRoads(location);
  const places = getLocalPlaces(location);

  const customerTypes = rotateItems(
    [
      "homeowners", "drivers", "landlords", "tenants",
      "business owners", "property managers", "tradespeople",
      "fleet operators", "families", "local organisations",
      "retail businesses", "commercial customers",
    ],
    seed,
    10
  );

  return `${CONTENT_VERSION}

# ${service} in ${location}

AdForge helps customers find detailed local information for ${service.toLowerCase()} in ${location}. This page is designed for people searching for a fast local provider, same-day assistance, emergency support, a company near me or a trusted service covering their area.

Customers may need help at ${places.join(", ")} and other locations throughout ${location}.

# Local ${service} Information

Local service pages make it easier to understand what is available, where providers may travel and what details customers should give when making an enquiry.

People search in different ways. Some use the service name, while others add a town, postcode, district, nearby road, open now, emergency, same day or near me.

# Areas Covered Around ${location}

Customers may also search from ${nearby.join(", ")} and surrounding districts.

Local coverage can include residential properties, workplaces, shops, industrial estates, offices, public buildings, retail parks, business parks and roadside locations.

# Roads and Access

Providers may travel using ${roads.join(", ")} and other nearby routes. Customers should mention parking restrictions, access gates, narrow roads, height limits, loading areas or difficult entrances when relevant.

# Customers Who May Need ${service}

The service may be useful for ${customerTypes.join(", ")}.

Clear information about the location, urgency, required work and access helps providers assess the enquiry accurately.

# Why Choose a Local Provider

A local provider may understand the road network, neighbourhoods, parking conditions and common property or vehicle types around ${location}.

Local pages reduce the time customers spend searching and help them contact providers that are more likely to cover the area.

# What to Explain When Calling

• Your name and contact number
• The exact location or postcode
• The service required
• How urgent the job is
• Access or parking information
• Relevant sizes, measurements or photographs
• Any safety concern
• Your preferred appointment time

# Same-Day and Emergency Enquiries

Same-day help may be possible depending on provider availability, distance, materials and the type of work required.

Emergency enquiries should explain the immediate risk or problem clearly so the provider can decide how quickly attendance is needed.

# Quality and Clear Expectations

Customers should ask what is included, whether materials are required, how pricing works and whether any preparation is needed before attendance.

A clear description of the job helps reduce misunderstandings and allows providers to arrive prepared.

# Seasonal and Local Demand

Demand can change during weekends, bank holidays, winter weather, heavy rain, school holidays and busy trading periods.

Booking early is useful for planned work, while urgent pages help customers find contact options when a problem cannot wait.

# Frequently Asked Questions

## Is ${service.toLowerCase()} available in ${location}?

Local availability depends on provider coverage and workload.

## Can someone attend today?

Same-day attendance may be available depending on the service and time of enquiry.

## Are nearby areas covered?

Coverage may include ${nearby.slice(0, 5).join(", ")} and other surrounding locations.

## What information should I provide?

Give the postcode, exact service, urgency, access details and any useful measurements or photographs.

## Can businesses request the service?

Commercial and business enquiries may be accepted depending on provider capability.

## Are evening or weekend appointments available?

Out-of-hours appointments depend on local availability.

## How do I compare providers?

Compare coverage, availability, experience, price, reviews and what is included.

## Can I request an estimate?

Providers may give an estimate after receiving enough information about the job.

# Popular Local Search Terms

${service.toLowerCase()} ${location}, ${service.toLowerCase()} near me, local ${service.toLowerCase()}, same-day ${service.toLowerCase()}, emergency ${service.toLowerCase()}, ${service.toLowerCase()} open now and trusted local provider.

# Find Local Help Through AdForge

Use this AdForge page to find information for ${service.toLowerCase()} in ${location}. Explain the job clearly, confirm the provider covers the location and agree the service details before work begins.`;
}

export function buildRichContent(page: LandingPageLike) {
  const type = detectPageType(page);

  if (type === "tyre") return buildTyreContent(page);
  if (type === "recovery") return buildRecoveryContent(page);
  return buildCustomContent(page);
}


export function getSeoGallery(page: LandingPageLike) {
  const type = detectPageType(page);

  if (type === "tyre") {
    return [
      { src: "/images/seo-v4/new-tyres.svg", alt: "New tyres supplied by mobile tyre fitters", title: "New Tyres" },
      { src: "/images/seo-v4/part-worn-tyres.svg", alt: "Part worn tyres available locally", title: "Part Worn Tyres" },
      { src: "/images/seo-v4/puncture-repair.svg", alt: "Mobile puncture repair service", title: "Puncture Repairs" },
      { src: "/images/seo-v4/locking-wheel-nut.svg", alt: "Locking wheel nut removal", title: "Locking Nut Removal" },
      { src: "/images/seo-v4/wheel-balancing.svg", alt: "Wheel balancing service", title: "Wheel Balancing" },
      { src: "/images/seo-v4/mobile-tyre-fitting.svg", alt: "24 hour mobile tyre fitting", title: "24 Hour Mobile Tyre Fitting" },
    ];
  }

  if (type === "recovery") {
    return [
      { src: "/images/seo-v4/breakdown-recovery.svg", alt: "24 hour breakdown recovery", title: "Breakdown Recovery" },
      { src: "/images/seo-v4/accident-recovery.svg", alt: "Accident recovery service", title: "Accident Recovery" },
      { src: "/images/seo-v4/vehicle-transport.svg", alt: "Vehicle transport service", title: "Vehicle Transport" },
      { src: "/images/seo-v4/jump-start.svg", alt: "Flat battery and jump start assistance", title: "Battery Assistance" },
      { src: "/images/seo-v4/motorway-recovery.svg", alt: "Motorway recovery", title: "Motorway Recovery" },
      { src: "/images/seo-v4/van-recovery.svg", alt: "Car and van recovery", title: "Car & Van Recovery" },
    ];
  }

  return [];
}

export { CONTENT_VERSION };
