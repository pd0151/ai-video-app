
export type LandingPageLike = {
  slug?: string | null;
  headline?: string | null;
};

type PageType =
  | "tyre"
  | "recovery"
  | "custom";

const CONTENT_VERSION = "ADFORGE_SEO_ENGINE_V3";

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

When a car, van or light commercial vehicle cannot be driven safely, AdForge helps customers find local vehicle recovery information for ${location}. Drivers may need breakdown recovery at home, at work, on a residential road, inside a car park, near a shopping area, outside a garage or beside a busy main road.

Customers commonly search for 24 hour recovery near me, breakdown recovery in ${location}, emergency car recovery, van recovery, roadside assistance, tow truck near me, motorway recovery, accident recovery and vehicle transport. This page brings those services together in one detailed local guide.

# Local Recovery Support Across ${location}

A vehicle problem can happen without warning. A driver may turn the key and find that the engine will not start, see a warning light while travelling, hear an unusual mechanical noise or discover that the vehicle is no longer safe to move.

AdForge is designed to make local services easier to find. Rather than ringing several companies or searching through outdated directory listings, customers can use a focused local page that explains the service, the area covered, the information needed when calling and the types of problems that may require recovery.

Recovery may be requested from ${places.join(", ")} and other locations throughout ${location}.

# Why Local Knowledge Matters

Local knowledge can be important when a driver is stranded. Providers familiar with ${location} may already know the fastest routes through the area, busy junctions, one-way systems, restricted-access roads, retail parks, industrial estates and motorway connections.

Clear location information can reduce delays. Customers should mention the road name, direction of travel, nearest junction, postcode, landmark, nearby business or car-park entrance. On motorways, the carriageway direction, junction number and marker information can be especially useful.

# Recovery Services Customers Search For

• 24 Hour Breakdown Recovery
• Emergency Vehicle Recovery
• Car Recovery Near Me
• Van Recovery
• Accident Recovery
• Roadside Assistance
• Tow Truck Service
• Car Towing
• Motorway Recovery
• Vehicle Transport
• Non Runner Vehicle Recovery
• Flat Battery Recovery
• Jump Start Assistance
• Garage Transport
• Home Vehicle Delivery
• Auction Vehicle Transport
• Long Distance Recovery
• Insurance Recovery
• Fleet Vehicle Recovery
• Light Commercial Vehicle Recovery

# Roads and Motorway Routes Near ${location}

Drivers may need help on or near ${roads.join(", ")}. Busy routes can create additional safety concerns, particularly during rush hour, poor weather, roadworks or darkness.

Searches often include recovery near ${roads[0]}, breakdown assistance near ${roads[1]}, tow truck open now, roadside help, emergency vehicle recovery and car transport near me.

If the vehicle is in a dangerous position, safety should come before the vehicle. Switch on hazard lights, move away from traffic where possible and contact the emergency services when there is an immediate danger.

# Nearby Towns and Surrounding Areas

This page focuses on ${location}, although local recovery may also be requested across ${nearby.join(", ")} and other nearby areas.

People do not always search using the main town name. They may search using a district, village, postcode, motorway junction, retail park or nearby road. Including surrounding areas helps customers recognise the local coverage and helps search engines understand the geographical relevance of the page.

# Vehicle Types That May Need Recovery

Recovery may be suitable for ${vehicles.join(", ")}.

Different vehicles can require different loading equipment, towing methods or transport arrangements. When calling, customers should explain the vehicle make, model, approximate size, condition and whether the wheels can roll freely.

Electric and hybrid vehicles may have specific recovery requirements. The recovery provider should be told when a vehicle is electric, hybrid, four-wheel drive, automatic or fitted with low ground clearance.

# Common Reasons Drivers Need Recovery

Customers in ${location} may need help because of a ${faults.join(", ")}.

Some faults make the vehicle completely immobile. Others may allow limited movement but make continued driving unsafe. Continuing to drive with overheating, low oil pressure, severe warning lights, damaged suspension, steering faults or accident damage can cause further damage and create a safety risk.

# Flat Battery and Non-Starting Vehicles

A flat battery is one of the most common reasons drivers call for assistance. Batteries can fail after lights are left on, during cold weather, after long periods without use or because the battery has reached the end of its life.

A jump start may get some vehicles moving, but repeated battery failure can indicate a charging-system or alternator problem. If the vehicle cannot be restarted reliably, recovery to a garage or safe destination may be the better option.

# Engine, Clutch and Gearbox Problems

Engine faults, clutch failure and gearbox problems can stop a vehicle from moving or make it unsafe to continue. Warning signs may include loss of power, unusual noises, difficulty selecting gears, burning smells, smoke, fluid leaks or severe vibration.

Stopping early can prevent a smaller fault becoming a major repair. Recovery allows the vehicle to be moved without driving it further.

# Accident Recovery and Damaged Vehicles

After an accident, a vehicle may have damaged bodywork, wheels, suspension, steering, airbags or cooling components. Even when the engine still runs, the vehicle may not be roadworthy.

Accident recovery may involve loading the vehicle carefully, clearing the immediate location and transporting it to a garage, storage yard, insurer-approved repair centre or home address.

# Vehicle Transport and Non-Runners

Vehicle transport is not only for roadside breakdowns. Customers may need a non-running vehicle moved between home and a garage, collected from an auction, delivered after a purchase, transported for repairs or moved into storage.

Providing accurate information about the vehicle condition helps ensure the correct transport equipment is used.

# Motorway and Fast-Road Safety

Breaking down on a motorway or fast dual carriageway can be dangerous. If possible, move onto the hard shoulder or into an emergency area, switch on hazard lights and leave the vehicle from the passenger side.

Wait behind the safety barrier where it is safe to do so. Do not stand between the vehicle and moving traffic. If the vehicle is stopped in a live lane or there is an immediate danger, contact emergency services.

# What Happens When You Call

1. Explain your exact location.
2. Give the vehicle make, model and registration.
3. Describe the fault or damage.
4. Confirm whether the vehicle rolls, steers and brakes.
5. State where you want the vehicle taken.
6. Mention passengers, access restrictions or safety concerns.

Clear information allows the recovery provider to assess the job and bring suitable equipment.

# Recovery for Businesses, Fleets and Tradespeople

A breakdown can interrupt deliveries, customer appointments and daily operations. Tradespeople, taxi drivers, couriers, delivery firms and fleet operators may need fast recovery to minimise lost working time.

Businesses should keep vehicle details, fleet contacts and preferred repair destinations available so arrangements can be made quickly.

# Seasonal Breakdown Risks

Cold weather can expose weak batteries and starting problems. Heavy rain can affect visibility, electrics and road conditions. Summer heat can contribute to overheating, cooling-system faults and tyre problems.

Holiday traffic, bank holidays and winter evenings can increase demand. Regular checks and early maintenance reduce risk, but emergency recovery remains important when a problem occurs unexpectedly.

# Before Recovery Arrives

Remove valuables and personal items where possible. Make sure passengers are waiting safely. Locate the keys and locking-wheel-nut key if relevant. Tell the provider about underground car parks, height restrictions, narrow entrances or inaccessible wheels.

Do not attempt to push a vehicle in moving traffic or work beneath a vehicle at the roadside.

# Frequently Asked Questions

## Can recovery attend my home address?

Recovery may be available from homes, driveways, residential streets and private parking areas, subject to safe access.

## Can a van or commercial vehicle be recovered?

Many providers can recover vans and light commercial vehicles. Give the approximate weight and dimensions when calling.

## Can an electric vehicle be recovered?

Electric vehicles can be recovered, but the provider should know the vehicle is electric so the correct loading method is used.

## Can an accident-damaged vehicle be moved?

Yes, subject to its condition and access. Explain whether wheels, steering, suspension or body panels are damaged.

## Can the vehicle be taken to my chosen garage?

Customers can usually request transport to a garage, home, dealership, storage yard or another agreed destination.

## Is motorway recovery available?

Motorway recovery may be available. Give the motorway, carriageway direction, junction and nearest marker information.

## Can a non-running vehicle be transported?

Yes. Non-runners may be moved for repairs, purchase collection, auction transport or storage.

## What if the steering is locked?

Tell the provider before attendance. Locked steering or wheels can affect the equipment required.

## Can recovery help with a flat battery?

A jump start or battery assistance may be possible. Recovery may be required if the vehicle will not restart reliably.

## Do providers cover ${nearby[0]} and ${nearby[1]}?

Nearby coverage may be available depending on provider location and workload.

# Popular Recovery Search Terms

24 hour recovery ${location}, recovery near me, breakdown recovery ${location}, car recovery, van recovery, emergency towing, tow truck near me, roadside assistance, accident recovery, motorway recovery, non-runner transport, vehicle transport, flat battery recovery and breakdown service open now.

# Call for Local Recovery Help

If a vehicle is broken down, damaged or unsafe to drive in ${location}, use this AdForge page to find local information and arrange support. Give clear details, remain somewhere safe and avoid driving a vehicle that may cause further damage or create a danger.`;
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

AdForge helps drivers find detailed local information for mobile tyre fitting in ${location}. A mobile tyre fitter can attend homes, workplaces, car parks and roadside locations when a vehicle has a flat tyre, puncture, blowout, damaged sidewall, worn tyre or another problem that makes driving unsafe.

Customers commonly search for mobile tyre fitting near me, emergency tyre fitting ${location}, 24 hour mobile tyres, puncture repair near me, roadside tyre replacement, same-day tyre fitting, locking wheel nut removal and mobile tyre fitter open now.

# Local Mobile Tyre Service Across ${location}

Mobile fitting removes the need to drive to a garage on a damaged tyre. It can also save time for drivers who are at work, looking after children, operating a business vehicle or unable to leave the vehicle unattended.

Appointments and emergency call-outs may be requested from ${places.join(", ")} and other locations throughout ${location}.

# Why Mobile Tyre Fitting Is Useful

Driving on a flat, damaged or badly worn tyre can damage the wheel and reduce control of the vehicle. A mobile fitter brings equipment to the customer, checks the tyre and fits a suitable replacement where possible.

For many customers, mobile fitting is more convenient than arranging vehicle recovery, waiting at a garage or risking further damage by driving.

# Tyre Services Customers Search For

• 24 Hour Mobile Tyre Fitting
• Emergency Tyre Fitting
• Mobile Tyre Replacement
• Roadside Tyre Replacement
• Same Day Tyre Fitting
• Mobile Puncture Repair
• Flat Tyre Repair
• Locking Wheel Nut Removal
• Run Flat Tyre Replacement
• Home Tyre Fitting
• Workplace Tyre Fitting
• Van Tyre Fitting
• Commercial Vehicle Tyres
• Valve Replacement
• TPMS Support
• Wheel Balancing
• Seasonal Tyre Changes
• Budget Tyres
• Premium Tyres
• Mobile Tyre Fitter Near Me

# Roads and Routes Near ${location}

Drivers may need tyre assistance on or near ${roads.join(", ")}. Potholes, debris, kerb contact, pressure loss and worn tyres can cause sudden problems on local roads and motorway routes.

Customers often search for tyre fitter near ${roads[0]}, emergency tyres near ${roads[1]}, roadside puncture repair, mobile tyre replacement open now and same-day tyres near me.

# Nearby Areas Covered

This page focuses on ${location}, although tyre fitting may also be requested across ${nearby.join(", ")} and other nearby districts.

Location pages help customers find relevant services using town names, suburbs, villages, postcodes, motorway junctions and local roads.

# Vehicles That May Need Mobile Tyres

Mobile tyre fitting may be suitable for ${vehicles.join(", ")}.

Common makes include ${vehicleMakes.join(", ")}. Customers should give the exact tyre size rather than relying only on the vehicle model, because different versions of the same vehicle can use different wheels and tyre sizes.

# Tyre Brands and Options

Depending on size and availability, tyre options may include ${tyreBrands.join(", ")}.

Drivers may choose budget, mid-range or premium tyres based on mileage, vehicle type, driving conditions and price. The replacement should always match the required size, load rating and speed rating.

# How to Find Your Tyre Size

The tyre size is written on the sidewall. A typical size looks like 205/55 R16 91V.

205 is the tyre width in millimetres.
55 is the sidewall profile.
R16 means the tyre fits a 16-inch wheel.
91 is the load index.
V is the speed rating.

Giving the full tyre size helps the fitter confirm stock before travelling.

# Common Tyre Problems

Customers in ${location} may need help with a ${tyreProblems.join(", ")}.

Some tyre damage can be repaired safely. Other damage requires replacement. Sidewall cuts, exposed cords, severe cracking, large punctures and damage outside the central tread area are usually not suitable for repair.

# Puncture Repair

A puncture may be repairable when the hole is small, located within the repairable central tread area and the tyre has not been driven while flat.

The tyre should be removed and inspected internally. A quick external plug is not always a permanent or suitable repair.

# Sidewall Damage and Blowouts

Sidewall damage is serious because the sidewall flexes while driving. Bulges, cuts, splits or exposed cords normally mean the tyre must be replaced.

A blowout can cause sudden pressure loss and loss of control. Drivers should slow down carefully, avoid harsh steering or braking and stop somewhere safe.

# Slow Punctures and Pressure Loss

A slow puncture may be caused by a nail, screw, leaking valve, damaged wheel rim or poor seal between the tyre and wheel.

Repeatedly inflating the tyre without identifying the cause is not a long-term solution. The tyre and wheel should be inspected.

# Locking Wheel Nut Problems

A missing, damaged or rounded locking-wheel-nut key can prevent tyre replacement. Specialist removal may be needed before the wheel can be removed.

Customers should check the glovebox, boot, spare-wheel compartment and tool kit before calling.

# Run-Flat Tyres

Run-flat tyres are designed to travel a limited distance after pressure loss, but distance and speed limits vary. Driving too far can make repair impossible and may damage the tyre internally.

Tell the fitter when the vehicle uses run-flat tyres so a suitable replacement can be sourced.

# TPMS Warning Lights

A tyre-pressure-monitoring-system warning can indicate low pressure, a puncture, temperature-related pressure change or a sensor problem.

Check all tyres safely. Do not assume the warning is only a faulty sensor, especially when handling or steering feels different.

# Wheel and Pothole Damage

Potholes and kerb impacts can damage tyres, alloy wheels, tracking and suspension. A wheel may crack or bend, causing repeated pressure loss.

If a new tyre cannot seal safely against a damaged wheel, the wheel may also need repair or replacement.

# Mobile Fitting at Home or Work

Home tyre fitting is useful for vehicles on driveways or residential parking areas. Workplace fitting can reduce time away from work for employees, tradespeople, couriers and fleet operators.

Customers should ensure there is enough safe space around the vehicle and provide any access instructions.

# Roadside Tyre Fitting Safety

A fitter needs a safe working area. Tyre replacement may not be possible in a live lane, on a blind bend or immediately beside fast-moving traffic.

Move to a safer location when possible. On motorways, follow emergency guidance and wait behind the barrier.

# Tyres for Taxis, Couriers and Fleets

Taxis, delivery vans, private-hire vehicles and business fleets often cover high mileage. Regular pressure and tread checks help reduce downtime and unexpected failures.

Fleet customers should record tyre sizes and preferred tyre options for each vehicle.

# Seasonal Tyre Advice

Cold weather can reduce tyre pressure. Heavy rain increases the importance of tread depth. Summer heat can increase pressure and expose existing tyre damage.

Before long journeys, bank holidays and winter travel, check tyre pressure, tread, sidewalls and the condition of the spare tyre or inflation kit.

# Before the Fitter Arrives

1. Confirm the exact location and postcode.
2. Read the full tyre size from the sidewall.
3. Check whether a locking-wheel-nut key is present.
4. State whether the tyre is completely flat or damaged.
5. Mention run-flat tyres, wheel damage or TPMS warnings.
6. Make sure the vehicle is parked somewhere safe and accessible.

# Frequently Asked Questions

## Can a mobile fitter come to my home?

Home tyre fitting may be available where the vehicle is parked safely and there is suitable access.

## Can tyres be fitted at work?

Yes, workplace car parks, yards and business premises may be suitable with permission and safe space.

## Can a puncture be repaired?

A puncture may be repairable after an internal inspection if its position and size meet safety standards.

## Can sidewall damage be repaired?

Sidewall cuts, bulges and structural damage generally require tyre replacement.

## What if I do not know my tyre size?

Read the code printed on the tyre sidewall or send a clear photograph of it.

## Can run-flat tyres be replaced?

Yes, subject to correct size and availability. Tell the fitter the vehicle uses run-flat tyres.

## Can locking wheel nuts be removed?

Specialist removal may be available when the key is missing or damaged.

## Can mobile fitting help with vans?

Van and light-commercial tyre fitting may be available. Give the tyre size and vehicle details.

## Do providers cover ${nearby[0]} and ${nearby[1]}?

Nearby coverage may be available depending on provider location, stock and workload.

## Is same-day fitting available?

Same-day service depends on tyre size, stock, distance and local demand.

# Popular Tyre Search Terms

mobile tyre fitting ${location}, mobile tyre fitter near me, 24 hour tyre fitting, emergency tyre replacement, puncture repair ${location}, roadside tyre fitting, flat tyre help, same-day tyres, home tyre fitting, work tyre fitting, run-flat tyre replacement, locking wheel nut removal and tyre fitter open now.

# Arrange Mobile Tyre Help

If a tyre is flat, damaged or unsafe in ${location}, use this AdForge page to find local information and arrange help. Provide the correct tyre size and location so the fitter can check availability before travelling.`;
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

export { CONTENT_VERSION };
