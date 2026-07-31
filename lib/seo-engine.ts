
export type LandingPageLike = {
  slug?: string | null;
  headline?: string | null;
};

type PageType =
  | "tyre"
  | "recovery"
  | "custom";

const CONTENT_VERSION = "ADFORGE_SEO_ENGINE_V5";

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

We provide 24 hour vehicle recovery in ${location} for drivers whose cars, vans, motorcycles, SUVs, 4x4s or light commercial vehicles cannot be driven safely. We provide breakdown recovery from homes, workplaces, public car parks, retail parks, industrial estates, local roads and suitable roadside locations throughout ${location}. When a vehicle stops unexpectedly, develops a serious fault or is damaged in an accident, we provide a direct way to arrange local recovery without expecting the driver to continue using an unsafe vehicle.

We provide vehicle recovery services across ${location} and surrounding districts for mechanical breakdowns, electrical faults, flat batteries, clutch and gearbox problems, overheating, accident damage and non-starting vehicles. We provide assistance based on the vehicle's exact position, condition and destination. Customers should give the full postcode, road name, direction of travel and a nearby landmark whenever possible so the recovery operator can locate the vehicle accurately.

We provide local recovery information that is written specifically around ${location}. This page does not simply mention the area once and then switch to generic advice. It explains where we provide recovery, the roads and neighbourhoods covered, the faults that commonly require recovery and the information drivers in ${location} should provide when requesting assistance.

# We Provide Recovery Services Throughout ${location}

We provide recovery from ${places.join(", ")} and other accessible locations across ${location}. Vehicles can break down outside a home, during a commute, while making deliveries, after leaving work or during an ordinary local journey. We provide vehicle recovery whether the incident happens on a residential street, within a business park, near a shopping area or on a main route leading into or out of ${location}.

We provide recovery around roads including ${roads.join(", ")}. These routes connect local neighbourhoods, workplaces, retail areas and nearby towns. Drivers may search using a road name, motorway junction, postcode or nearby landmark instead of the general area name, so our ${location} recovery coverage is described in practical local detail.

We provide coverage around ${nearby.join(", ")} as well as ${location}. A vehicle may stop close to the boundary between two districts, so the exact live location is more useful than the nearest town name alone. We provide recovery based on the real collection point and the destination requested by the customer.

# 24 Hour Breakdown Recovery in ${location}

We provide 24 hour breakdown recovery in ${location} because vehicle faults do not follow normal garage opening hours. A car or van can fail early in the morning, late at night, during weekends or on bank holidays. We provide assistance for drivers who cannot safely continue because the engine has stopped, the vehicle has lost power, warning lights have appeared or an important mechanical component has failed.

We provide breakdown recovery when roadside repair is not possible, not safe or not appropriate. Some faults may appear minor but can cause serious damage if the vehicle is driven further. Overheating, oil-pressure warnings, steering problems, brake faults, severe vibration, coolant loss and unusual engine noises should never be ignored.

We provide transport to a garage, dealership, repair centre, home address, storage site or another agreed destination. Customers should confirm that the destination is open and able to receive the vehicle, especially during evenings and weekends. We provide recovery throughout ${location}, but the customer should agree the destination before the vehicle is loaded whenever possible.

# Emergency Vehicle Recovery

We provide emergency vehicle recovery in ${location} for vehicles that become immobilised suddenly or are left in an unsafe position. Emergency recovery may be needed after a complete engine failure, collision, wheel damage, suspension failure, steering fault or electrical problem that prevents the vehicle from moving normally.

We provide a recovery response based on the information supplied by the customer. The vehicle make, model, registration, approximate size and condition should be explained clearly. Customers should mention whether the vehicle rolls, steers and brakes, whether any wheels are locked and whether fluids are leaking.

We provide emergency recovery from accessible roadside locations, but safety comes first. If the vehicle is in a live traffic lane, on a blind bend or in another dangerous position, the driver should call the emergency services where necessary and move away from traffic. We provide recovery after safe access to the vehicle is possible.

# Accident Recovery in ${location}

We provide accident recovery throughout ${location} for vehicles that have collision damage and cannot be driven safely. A vehicle may still start after an accident but have damaged steering, suspension, wheels, tyres, lights, cooling components or bodywork. We provide recovery so the vehicle can be transported without creating further risk.

We provide careful transport for accident-damaged vehicles where the wheels may not turn correctly or body panels may obstruct movement. Customers should describe deployed airbags, fluid leaks, broken glass, damaged wheels and any parts touching the road. This information helps determine what recovery equipment is required.

We provide accident recovery to garages, body shops, insurer-approved repair centres, storage compounds or home addresses. The customer remains responsible for confirming the destination and following any instructions from police or insurers. We provide the transport service once the scene is safe and the vehicle is available for collection.

# Car Recovery in ${location}

We provide car recovery in ${location} for family cars, company cars, electric vehicles, hybrid vehicles, performance cars and other suitable passenger vehicles. Cars may need recovery because of mechanical failure, electrical faults, accident damage, wheel problems or a non-starting engine.

We provide recovery for cars parked at homes, workplaces and local public locations, provided the vehicle can be accessed safely. Narrow roads, underground car parks, low height limits and restricted entrances should be mentioned before attendance.

We provide local and longer-distance car transport from ${location}. The price and availability can depend on the collection point, destination, vehicle condition, time of day and any special loading requirements.

# Van and Commercial Vehicle Recovery

We provide van recovery in ${location} for suitable light commercial vehicles used by tradespeople, couriers, delivery drivers, local businesses and fleet operators. A van breakdown can interrupt jobs, deliveries and customer appointments, so clear information helps arrange the right recovery vehicle.

We provide recovery for loaded and unloaded vans, but customers must state the vehicle size, approximate weight and whether it contains heavy tools or goods. A large or heavily loaded commercial vehicle may need specialist equipment that differs from normal car recovery.

We provide recovery from business parks, industrial estates, depots and customer locations throughout ${location}. Access gates, loading bays, security restrictions and site contact details should be given when the job is booked.

# Motorcycle Recovery

We provide motorcycle recovery in ${location} where suitable transport equipment is available. Motorcycles may need recovery after mechanical failure, punctures, chain problems, electrical faults, accident damage or lost keys.

We provide transport that secures the motorcycle correctly rather than attempting to tow it like a car. Customers should state the motorcycle make and model, its condition and whether it can roll freely.

We provide collection from homes, workplaces and accessible roadside locations around ${location}. The customer should explain any accident damage or fluid leaks before the recovery operator arrives.

# Flat Battery Help and Jump Starts

We provide help for flat batteries in ${location}. A battery may fail because of age, cold weather, lights being left on, a charging fault or a vehicle being unused for a long period. We provide jump-start assistance where appropriate and full recovery where the vehicle cannot restart reliably.

We provide battery-related assistance after basic details are confirmed. Customers should explain whether the dashboard lights come on, whether the starter motor turns and whether the battery has failed before. Repeat battery failure may indicate an alternator or charging-system fault.

We provide recovery to a garage when a jump start is not suitable or when the vehicle stops again. A temporary start does not always mean the underlying fault has been resolved.

# Home Start Recovery

We provide home-start assistance across ${location} for vehicles that fail before a journey begins. A car may be parked on a driveway, outside a property, in a residential car park or within an apartment development.

We provide recovery from home addresses where the vehicle is accessible. Customers should mention locked gates, narrow driveways, underground parking, steep slopes or other restrictions that may affect loading.

We provide transport from the home to a chosen garage or repair centre. The customer should confirm the destination and ensure the vehicle keys are available.

# Roadside Assistance in ${location}

We provide roadside assistance for drivers who experience a fault while travelling through ${location}. Basic assistance may include battery support, safety checks or an assessment of whether the vehicle can continue.

We provide full recovery when the fault cannot be resolved safely at the roadside. The purpose is not to encourage a driver to continue in an unsafe vehicle, but to arrange the most suitable next step.

We provide roadside coverage around ${roads.join(", ")} and other local routes. Drivers should state the direction of travel, nearest junction and a recognisable landmark.

# Motorway Recovery Near ${location}

We provide motorway recovery around routes serving ${location}, including ${roads.slice(0, 4).join(", ")} where applicable. Motorway breakdowns require precise information because carriageways, directions and junctions can place vehicles several miles apart even when the same road name is used.

We provide recovery after the customer gives the motorway number, direction of travel, nearest junction, marker post or emergency refuge information. A live location sent from a phone can also help.

We provide motorway assistance only when it is safe and lawful to access the vehicle. Drivers should move behind a barrier where possible, leave through the passenger side and stay away from moving traffic.

# Vehicle Transport in ${location}

We provide vehicle transport in ${location} even when the vehicle has not broken down. Transport may be required for auction purchases, garage transfers, project cars, classic vehicles, newly purchased vehicles and non-runners.

We provide local and long-distance transport from ${location}. Customers should supply the collection address, destination, vehicle condition and access details in advance.

We provide transport for vehicles that roll and steer as well as certain non-runners, subject to the correct equipment being available. Missing keys, seized brakes and locked wheels must be declared before collection.

# Long-Distance Recovery

We provide long-distance recovery from ${location} when a vehicle needs to be transported beyond the immediate local area. This may be necessary when the customer's preferred garage, home address or specialist repair centre is in another town or county.

We provide quotations based on mileage, vehicle size, collection conditions and destination. Waiting time, tolls and difficult access can also affect the final cost.

We provide a clear collection and delivery service, but customers should ensure that somebody is available to release and receive the vehicle at both ends.

# Recovery for Electric and Hybrid Vehicles

We provide recovery for electric and hybrid vehicles in ${location}. These vehicles may require specific loading procedures, especially when the battery is depleted, the wheels are locked or the vehicle cannot select neutral.

We provide recovery operators with the vehicle details supplied by the customer. The make, model and drivetrain type should be stated before attendance.

We provide transport rather than unsafe towing methods where the vehicle design requires all wheels to be lifted from the road.

# Common Faults Requiring Recovery

We provide recovery information for faults including ${faults.join(", ")}. Some faults stop the vehicle immediately, while others create warning signs before complete failure.

We provide recovery when continuing to drive could worsen damage or endanger road users. Strong burning smells, smoke, rapid overheating, oil warnings, steering loss and brake problems require immediate caution.

We provide local assistance around ${location} so customers can explain the exact symptoms and arrange appropriate transport.

# Difficult Access and Winching

We provide recovery from many accessible locations in ${location}, but some vehicles are positioned in mud, soft ground, narrow driveways, steep car parks or restricted spaces. Winching or specialist equipment may be needed.

We provide assistance based on the real access conditions. Customers should send photographs where possible and mention low ceilings, height barriers, locked gates and limited turning space.

We provide recovery only where the operation can be completed safely without damaging property or creating an unreasonable risk.

# Wrong Fuel and Fuel Problems

We provide recovery support for wrong-fuel situations in ${location}. Starting or driving a vehicle after filling it with the wrong fuel can increase damage.

We provide transport to an appropriate garage or fuel-drain service where roadside treatment is not available. Customers should state the vehicle, fuel type and whether the engine has been started.

We provide help for vehicles that have run out of fuel where local assistance is available, but motorway safety rules must always be followed.

# Recovery for Taxis, Fleets and Businesses

We provide vehicle recovery for taxi drivers, private-hire vehicles, couriers, tradespeople and local fleets in ${location}. A breakdown can stop income and interrupt scheduled work.

We provide recovery from depots, customer addresses, ranks, business parks and roadside locations. Fleet managers should provide the driver contact details and destination instructions.

We provide support for individual vehicles and can discuss repeated or multi-vehicle requirements separately.

# Exact Areas We Cover Around ${location}

We provide recovery throughout ${location}, including locations around ${places.join(", ")}. This detailed local coverage helps customers understand that the service is connected to real places within the area.

We provide recovery in nearby districts such as ${nearby.join(", ")}. Availability can vary according to distance, workload and vehicle type, but the customer can still submit the exact location for assessment.

We provide assistance along roads including ${roads.join(", ")} and the smaller residential and commercial routes connected to them.

# What to Tell Us When You Call

We provide a quicker and more accurate recovery response when customers give complete information. State the exact postcode, road name, live location, vehicle registration, make, model and colour.

We provide the correct type of recovery more easily when the customer explains whether the vehicle rolls, steers and brakes. Mention flat tyres, collision damage, fluid leaks, missing keys, locked wheels and low suspension.

We provide transport to an agreed destination, so the garage or delivery address should be confirmed before loading whenever possible.

# Safety While Waiting for Recovery

We provide recovery throughout ${location}, but customers must remain safe while waiting. Use hazard lights, move away from moving traffic and avoid standing between the vehicle and the road.

We provide motorway recovery, but drivers should leave through the passenger side and wait behind a barrier where safe. Never attempt repairs in a live lane.

We provide assistance after emergency services have made an accident scene safe where their involvement is required.

# Frequently Asked Questions

## Do you provide 24 hour recovery in ${location}?

Yes. We provide 24 hour vehicle recovery in ${location}, subject to operator availability, vehicle type and the exact collection location.

## Do you provide breakdown recovery from homes?

Yes. We provide home recovery throughout ${location} where the vehicle is accessible and there is enough space for safe loading.

## Do you provide car and van recovery?

Yes. We provide recovery for suitable cars, vans and light commercial vehicles. Customers should give the vehicle size and approximate weight.

## Do you provide accident recovery?

Yes. We provide accident recovery in ${location} after the scene is safe and the vehicle is available for collection.

## Can you recover an electric vehicle?

Yes. We provide electric and hybrid vehicle recovery, but the exact vehicle type must be confirmed before attendance.

## Can you take my vehicle to my own garage?

Yes. We provide transport to an agreed garage, dealership, home address, storage site or repair centre.

## Do you provide recovery near ${nearby[0]} and ${nearby[1]}?

We provide recovery around ${location} and nearby districts including ${nearby.slice(0, 6).join(", ")}, subject to availability.

## What roads do you cover?

We provide recovery around ${roads.join(", ")} and other roads serving ${location}.

# Popular Recovery Searches in ${location}

24 hour recovery ${location}, vehicle recovery ${location}, breakdown recovery ${location}, car recovery ${location}, van recovery ${location}, tow truck near me, accident recovery, motorway recovery, roadside assistance, flat battery help, jump start, home start, non-runner recovery, vehicle transport and long-distance recovery.

# Choose AdForge for Recovery in ${location}

We provide clear local information for drivers who need recovery in ${location}. We provide breakdown recovery, accident recovery, roadside assistance and vehicle transport across the area and nearby districts. If your vehicle is broken down, damaged or unsafe to drive, use AdForge to arrange local help.`;
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

We provide mobile tyre fitting in ${location} for drivers who need tyre help at home, at work, in a car park or at a safe roadside location. We provide emergency tyre replacement, puncture assistance, new tyres, part worn tyres, locking wheel nut removal and wheel balancing throughout ${location}. When a vehicle cannot be driven safely because of a flat tyre, blowout, damaged sidewall or severe pressure loss, we provide a mobile service that comes directly to the vehicle.

We provide 24 hour mobile tyre fitting across ${location} and nearby districts. Customers can request help for cars, vans, taxis, SUVs, electric vehicles, hybrid vehicles and suitable light commercial vehicles. We provide assistance based on the exact tyre size, vehicle type, location and nature of the damage, so customers should give complete information before a fitter travels.

We provide content written specifically around mobile tyre fitting in ${location}. The service and location are explained throughout the page rather than appearing only in the heading. We describe the local roads, neighbourhoods, nearby areas, common tyre faults and the different places where we provide mobile tyre services.

# We Provide Mobile Tyre Fitting Throughout ${location}

We provide tyre fitting from ${places.join(", ")} and other accessible locations across ${location}. A tyre problem may be discovered outside a home, during a commute, while shopping, on a delivery route or before an important journey. We provide mobile tyre fitting wherever the vehicle is positioned safely and there is enough space to complete the work.

We provide mobile tyre assistance around roads including ${roads.join(", ")}. These routes connect homes, workplaces, schools, retail areas and neighbouring towns. Customers may identify their position using a postcode, road name, business name or landmark, so our coverage around ${location} is explained in practical local detail.

We provide tyre fitting in nearby areas including ${nearby.join(", ")}. A customer may be only a short distance outside ${location} or close to the boundary between two districts. We provide assistance according to the vehicle's exact location and fitter availability.

# 24 Hour Mobile Tyre Fitting in ${location}

We provide 24 hour mobile tyre fitting in ${location} because punctures and tyre failures can happen at any time. A driver may discover a flat tyre early in the morning, late at night, during a weekend or on a bank holiday.

We provide emergency call-outs when a vehicle cannot be driven safely to a garage. Mobile fitting removes the need to risk driving on a damaged tyre or to arrange separate recovery before the tyre can be replaced.

We provide out-of-hours tyre assistance subject to tyre stock, location and fitter availability. Customers should give the full tyre size and exact location so the job can be assessed accurately.

# Emergency Mobile Tyre Fitting

We provide emergency mobile tyre fitting in ${location} after blowouts, sudden pressure loss, pothole impacts, sidewall damage and other tyre failures. Driving further can damage the wheel and reduce control of the vehicle.

We provide a fitter to assess whether the tyre can be repaired or must be replaced. Sidewall damage, exposed cords, bulges and severe internal damage normally require replacement rather than repair.

We provide emergency tyre fitting at safe roadside locations. A live traffic lane, blind bend or fast road may not be suitable for tyre work, so the vehicle may first need to be moved or recovered.

# New Tyres in ${location}

We provide new tyres in ${location} for customers who need a safe replacement after damage, wear or an MOT advisory. New tyres may be available in budget, mid-range and premium options depending on size and stock.

We provide tyre options only after the correct size and specification are confirmed. The tyre width, profile, wheel diameter, load index and speed rating all matter.

We provide access to brands that may include ${tyreBrands.join(", ")}. Brand availability varies, but the correct fitment and safe specification come before brand preference.

We provide new mobile tyre fitting at homes, workplaces and roadside locations throughout ${location}, allowing customers to replace an unsafe tyre without first travelling to a depot.

# Part Worn Tyres in ${location}

We provide part worn tyres in ${location} for selected sizes where suitable stock is available. Part worn tyres can offer a lower-cost option, but they must be inspected and remain safe and legal for road use.

We provide part worn fitting only when a suitable tyre is available for the required vehicle and size. Customers should not assume that every size is held in stock.

We provide clear information about tyre condition. A part worn tyre should not have exposed cords, dangerous sidewall damage, bulges or unsafe repairs.

We provide mobile part worn tyre fitting throughout ${location}, subject to availability and the location of the vehicle.

# Budget and Premium Tyres

We provide budget tyres in ${location} for customers who need an affordable replacement. Budget options can be useful for lower-mileage vehicles or urgent replacements where cost is a major consideration.

We provide mid-range and premium tyres for drivers who want different performance, mileage, comfort, noise or wet-grip characteristics.

We provide guidance based on the vehicle, driving pattern and tyre size. The cheapest tyre is not always the best option for every customer, and the most expensive tyre is not always necessary.

# Mobile Tyre Fitters in ${location}

We provide mobile tyre fitters who travel directly to the customer. A mobile fitter brings tyre-changing and balancing equipment to the vehicle rather than requiring the customer to visit a workshop.

We provide fitting at ${places.join(", ")} and other safe locations around ${location}. The vehicle needs enough space around the wheel and a reasonably level surface.

We provide a convenient service for drivers who are stranded, busy at work or unable to drive safely because of tyre damage.

# Puncture Repairs in ${location}

We provide puncture repair assistance in ${location} where the tyre remains suitable for repair. A puncture may be repairable when the damage is small, located in the central tread area and the tyre has not been damaged by being driven while flat.

We provide an inspection before deciding whether a repair is safe. The tyre may need to be removed from the wheel so the internal condition can be checked.

We provide replacement tyres when a puncture cannot be repaired. Sidewall punctures, shoulder damage, exposed cords, bulges and severe internal damage make repair unsuitable.

We provide mobile puncture assistance throughout ${location}, but safety determines whether a repair or replacement is required.

# Slow Puncture Repairs

We provide help for slow punctures in ${location}. A slow loss of pressure may be caused by a nail, screw, leaking valve, corroded wheel rim or a poor seal between the tyre and wheel.

We provide checks to identify the cause rather than simply adding air. Repeatedly inflating the tyre without repairing the fault may leave the driver stranded again.

We provide a puncture repair where possible or a replacement where the tyre is no longer safe.

# Locking Wheel Nut Removal

We provide locking wheel nut removal in ${location} where the correct equipment and access are available. A missing, damaged or rounded locking key can prevent the wheel from being removed.

We provide assistance after customers check the glovebox, boot, spare-wheel compartment and original tool kit for the key.

We provide specialist removal for certain locking nuts, but badly damaged or seized fixings may require workshop equipment.

We provide mobile tyre fitting after the wheel can be removed safely and the replacement tyre has been confirmed.

# Wheel Balancing

We provide wheel balancing as part of many tyre-fitting jobs in ${location}. Balancing helps reduce steering-wheel vibration and uneven tyre wear.

We provide balancing using weights placed on the wheel after the new or part worn tyre is fitted.

We provide a complete mobile tyre service rather than treating tyre replacement as only removing one tyre and fitting another.

# Valve Replacement and TPMS

We provide valve replacement in ${location} where a leaking or damaged valve is causing pressure loss. Rubber valves can deteriorate over time and may be replaced during tyre fitting.

We provide support for vehicles with tyre-pressure-monitoring systems. A TPMS warning may indicate low pressure, a puncture or a sensor fault.

We provide customers with clear information when a sensor issue requires separate specialist attention.

# Run Flat Tyres

We provide run-flat tyre replacement in ${location} for suitable vehicles and sizes. Run-flat tyres can support limited driving after pressure loss, but strict speed and distance limits apply.

We provide advice to stop driving when the tyre has exceeded its safe limit or shows visible damage. Continued use can cause internal damage and make repair impossible.

We provide mobile fitting after the exact run-flat specification is confirmed.

# Van and Commercial Tyres

We provide van tyre fitting in ${location} for tradespeople, couriers, delivery drivers and local businesses. Van tyres may require a higher load rating than ordinary car tyres.

We provide tyres for suitable light commercial vehicles after the full tyre size and load information are confirmed.

We provide mobile fitting at depots, workplaces, customer sites and safe roadside locations, helping reduce business downtime.

# Taxi and Private-Hire Tyres

We provide mobile tyre fitting for taxis and private-hire vehicles in ${location}. A tyre problem can stop a driver working and lead to cancelled jobs.

We provide urgent assistance where stock and availability allow. Taxi drivers should provide the exact tyre size, vehicle registration and live location.

We provide fitting at ranks, homes, workplaces, car parks and safe roadside positions.

# Home Tyre Fitting in ${location}

We provide home tyre fitting throughout ${location}. Customers can arrange new tyres, part worn tyres or puncture assistance while the vehicle is parked on a driveway or safe residential road.

We provide a service that avoids the need to fit a spare wheel or drive to a garage on a damaged tyre.

We provide home fitting where there is sufficient space and safe access around the vehicle.

# Workplace Tyre Fitting

We provide workplace tyre fitting in ${location} for employees, taxi drivers, tradespeople and fleet vehicles. A tyre can be replaced while the customer is at work, subject to access and parking permission.

We provide fitting at offices, industrial estates, retail sites, depots and business parks.

We provide a convenient option when a customer discovers a flat tyre during the working day.

# Car Park and Retail-Park Tyre Fitting

We provide mobile tyre fitting at accessible car parks around ${location}, including supermarket car parks, retail parks and leisure locations.

We provide attendance when the customer gives the exact car park, entrance, level, bay or nearby business name.

We provide fitting only where the vehicle is positioned safely and the site permits the work.

# Tyres for Different Vehicles

We provide mobile tyre fitting for ${vehicles.join(", ")}.

We provide tyres for common vehicle makes including ${vehicleMakes.join(", ")}. Different models and trim levels can use different tyre sizes, so the exact sidewall markings must still be confirmed.

We provide suitable options based on the vehicle rather than guessing from the make and model alone.

# How to Read Your Tyre Size

We provide the correct tyre more quickly when customers read the full size from the tyre sidewall. A common example is 205/55 R16 91V.

205 is the tyre width in millimetres.
55 is the sidewall profile.
R16 means the tyre fits a 16-inch wheel.
91 is the load index.
V is the speed rating.

We provide mobile tyre fitting in ${location}, but the complete size and specification are needed before stock can be checked.

# Common Tyre Problems in ${location}

We provide assistance for problems including ${tyreProblems.join(", ")}.

We provide puncture repair where safe and replacement tyres where repair is not possible.

We provide emergency tyre help after blowouts, sidewall cuts, pothole damage and severe pressure loss.

We provide advice not to continue driving when the tyre is visibly unsafe or the wheel may be damaged.

# Sidewall Damage and Blowouts

We provide replacement tyres for sidewall damage and blowouts in ${location}. Sidewall cuts, bulges and exposed cords normally cannot be repaired safely.

We provide roadside fitting where the vehicle is in a safe position. Sudden pressure loss can affect steering and braking, so the driver should slow down carefully and stop without harsh movements.

We provide a replacement after the correct tyre size has been confirmed.

# Pothole and Wheel Damage

We provide tyre assistance after pothole and kerb impacts throughout ${location}. An impact can damage the tyre, wheel, tracking and suspension.

We provide tyre replacement where the tyre is damaged, but a bent or cracked wheel may also need specialist repair.

We provide customers with clear advice when wheel damage prevents a normal tyre-fitting job.

# Exact Local Coverage Around ${location}

We provide mobile tyre fitting throughout ${location}, including ${places.join(", ")} and other accessible local locations.

We provide assistance around ${nearby.join(", ")} and surrounding districts, subject to fitter availability.

We provide mobile tyre fitting along roads including ${roads.join(", ")} and the residential and commercial streets connected to them.

We provide detailed local information because customers need to know that the service genuinely covers ${location}, not just a generic national page.

# What to Tell Us When You Call

We provide a quicker mobile tyre response when customers give the exact postcode, road name, live location and nearby landmark.

We provide the correct tyre more easily when customers read the full tyre size and state whether they need a new tyre, part worn tyre or puncture repair.

We provide locking wheel nut assistance when customers mention that the key is missing or damaged before attendance.

We provide safer service when customers explain whether the vehicle is on a driveway, in a car park or beside a busy road.

# Safety While Waiting for a Tyre Fitter

We provide mobile tyre fitting throughout ${location}, but customers should not stand close to moving traffic while waiting.

We provide roadside fitting only where there is a safe working area. A live lane, blind bend or narrow high-speed road may require recovery to another position.

We provide assistance after the customer switches on hazard lights and moves passengers away from danger where possible.

# Frequently Asked Questions

## Do you provide mobile tyre fitting in ${location}?

Yes. We provide mobile tyre fitting throughout ${location} and nearby districts, subject to tyre stock and fitter availability.

## Do you provide 24 hour tyre fitting?

Yes. We provide 24 hour emergency tyre fitting in ${location}, subject to the time, location and required tyre size.

## Do you provide new tyres?

Yes. We provide budget, mid-range and premium new tyres depending on size and stock.

## Do you provide part worn tyres?

Yes. We provide part worn tyres for selected sizes where safe and suitable stock is available.

## Do you provide puncture repairs?

Yes. We provide puncture repairs when the tyre passes inspection and the damage is within a safe repairable area.

## Do you provide locking wheel nut removal?

Yes. We provide locking wheel nut removal for certain vehicles and locking-nut types.

## Do you provide home tyre fitting?

Yes. We provide home tyre fitting across ${location} where the vehicle is accessible and safely parked.

## Do you provide workplace tyre fitting?

Yes. We provide workplace fitting where parking permission and safe access are available.

## Do you cover ${nearby[0]} and ${nearby[1]}?

We provide mobile tyre fitting around ${location} and nearby areas including ${nearby.slice(0, 6).join(", ")}, subject to availability.

## What roads do you cover?

We provide mobile tyre fitting around ${roads.join(", ")} and other roads serving ${location}.

# Popular Mobile Tyre Searches in ${location}

mobile tyre fitting ${location}, 24 hour mobile tyre fitting ${location}, emergency tyre fitter, mobile tyre fitter near me, new tyres, part worn tyres, puncture repair, slow puncture repair, locking wheel nut removal, wheel balancing, run-flat tyres, van tyres, taxi tyres, roadside tyre replacement, home tyre fitting and workplace tyre fitting.

# Choose AdForge for Mobile Tyre Fitting in ${location}

We provide clear local information for customers who need mobile tyre fitting in ${location}. We provide new tyres, part worn tyres, puncture repairs, locking wheel nut removal and emergency roadside tyre replacement throughout the area. If you need a mobile tyre fitter in ${location}, use AdForge to arrange local help.`;
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
