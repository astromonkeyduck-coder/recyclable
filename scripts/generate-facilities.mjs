#!/usr/bin/env node
/**
 * Generates ~1,000 US recycling facility records across chains, municipal, and specialty.
 * Run: node scripts/generate-facilities.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "data", "facilities");
mkdirSync(OUT_DIR, { recursive: true });

// Top 120 US metro areas with center coordinates and ZIP codes
const METROS = [
  { city: "New York", region: "NY", lat: 40.7128, lng: -74.006, zips: ["10001","10011","10019","10036","10128","11201","11215","10301"] },
  { city: "Los Angeles", region: "CA", lat: 34.0522, lng: -118.2437, zips: ["90001","90012","90024","90045","90210","90401","91101","91301"] },
  { city: "Chicago", region: "IL", lat: 41.8781, lng: -87.6298, zips: ["60601","60614","60622","60640","60657","60660","60616","60608"] },
  { city: "Houston", region: "TX", lat: 29.7604, lng: -95.3698, zips: ["77001","77002","77019","77030","77042","77056","77077","77095"] },
  { city: "Phoenix", region: "AZ", lat: 33.4484, lng: -112.074, zips: ["85001","85003","85013","85016","85020","85028","85032","85044"] },
  { city: "Philadelphia", region: "PA", lat: 39.9526, lng: -75.1652, zips: ["19101","19103","19106","19111","19119","19123","19130","19143"] },
  { city: "San Antonio", region: "TX", lat: 29.4241, lng: -98.4936, zips: ["78201","78205","78207","78210","78216","78224","78233","78240"] },
  { city: "San Diego", region: "CA", lat: 32.7157, lng: -117.1611, zips: ["92101","92103","92109","92111","92117","92120","92126","92131"] },
  { city: "Dallas", region: "TX", lat: 32.7767, lng: -96.797, zips: ["75201","75204","75206","75214","75219","75225","75230","75240"] },
  { city: "Austin", region: "TX", lat: 30.2672, lng: -97.7431, zips: ["78701","78702","78704","78723","78741","78745","78748","78758"] },
  { city: "Jacksonville", region: "FL", lat: 30.3322, lng: -81.6557, zips: ["32099","32202","32204","32207","32210","32216","32224","32246"] },
  { city: "San Jose", region: "CA", lat: 37.3382, lng: -121.8863, zips: ["95110","95112","95116","95118","95123","95125","95128","95134"] },
  { city: "Fort Worth", region: "TX", lat: 32.7555, lng: -97.3308, zips: ["76101","76102","76104","76107","76109","76116","76120","76132"] },
  { city: "Columbus", region: "OH", lat: 39.9612, lng: -82.9988, zips: ["43201","43202","43204","43206","43210","43212","43214","43220"] },
  { city: "Charlotte", region: "NC", lat: 35.2271, lng: -80.8431, zips: ["28202","28203","28205","28207","28209","28210","28212","28226"] },
  { city: "Indianapolis", region: "IN", lat: 39.7684, lng: -86.1581, zips: ["46201","46202","46204","46205","46208","46214","46220","46227"] },
  { city: "San Francisco", region: "CA", lat: 37.7749, lng: -122.4194, zips: ["94102","94103","94107","94109","94110","94112","94114","94118"] },
  { city: "Seattle", region: "WA", lat: 47.6062, lng: -122.3321, zips: ["98101","98102","98103","98105","98107","98109","98112","98115"] },
  { city: "Denver", region: "CO", lat: 39.7392, lng: -104.9903, zips: ["80201","80202","80204","80205","80209","80210","80218","80220"] },
  { city: "Washington", region: "DC", lat: 38.9072, lng: -77.0369, zips: ["20001","20002","20003","20005","20007","20009","20010","20015"] },
  { city: "Nashville", region: "TN", lat: 36.1627, lng: -86.7816, zips: ["37201","37203","37206","37208","37210","37212","37214","37216"] },
  { city: "Oklahoma City", region: "OK", lat: 35.4676, lng: -97.5164, zips: ["73101","73102","73104","73106","73108","73112","73114","73120"] },
  { city: "El Paso", region: "TX", lat: 31.7619, lng: -106.485, zips: ["79901","79902","79903","79905","79907","79912","79924","79936"] },
  { city: "Boston", region: "MA", lat: 42.3601, lng: -71.0589, zips: ["02101","02108","02109","02110","02113","02115","02116","02118"] },
  { city: "Portland", region: "OR", lat: 45.5051, lng: -122.675, zips: ["97201","97202","97203","97205","97209","97211","97214","97217"] },
  { city: "Las Vegas", region: "NV", lat: 36.1699, lng: -115.1398, zips: ["89101","89102","89104","89107","89109","89117","89121","89128"] },
  { city: "Memphis", region: "TN", lat: 35.1495, lng: -90.049, zips: ["38103","38104","38105","38106","38107","38111","38112","38117"] },
  { city: "Louisville", region: "KY", lat: 38.2527, lng: -85.7585, zips: ["40201","40202","40203","40204","40205","40206","40207","40208"] },
  { city: "Baltimore", region: "MD", lat: 39.2904, lng: -76.6122, zips: ["21201","21202","21205","21207","21209","21211","21213","21215"] },
  { city: "Milwaukee", region: "WI", lat: 43.0389, lng: -87.9065, zips: ["53201","53202","53203","53204","53205","53206","53207","53208"] },
  { city: "Albuquerque", region: "NM", lat: 35.0844, lng: -106.6504, zips: ["87101","87102","87104","87106","87108","87110","87112","87120"] },
  { city: "Tucson", region: "AZ", lat: 32.2226, lng: -110.9747, zips: ["85701","85705","85710","85711","85712","85716","85719","85730"] },
  { city: "Fresno", region: "CA", lat: 36.7378, lng: -119.7871, zips: ["93650","93701","93702","93703","93705","93706","93710","93720"] },
  { city: "Sacramento", region: "CA", lat: 38.5816, lng: -121.4944, zips: ["95811","95814","95816","95818","95819","95820","95822","95825"] },
  { city: "Mesa", region: "AZ", lat: 33.4152, lng: -111.8315, zips: ["85201","85202","85203","85204","85205","85206","85207","85210"] },
  { city: "Kansas City", region: "MO", lat: 39.0997, lng: -94.5786, zips: ["64101","64102","64105","64106","64108","64109","64110","64112"] },
  { city: "Atlanta", region: "GA", lat: 33.749, lng: -84.388, zips: ["30301","30303","30305","30306","30308","30309","30310","30312"] },
  { city: "Omaha", region: "NE", lat: 41.2565, lng: -95.9345, zips: ["68101","68102","68104","68105","68106","68107","68108","68110"] },
  { city: "Colorado Springs", region: "CO", lat: 38.8339, lng: -104.8214, zips: ["80901","80903","80904","80905","80906","80907","80909","80910"] },
  { city: "Raleigh", region: "NC", lat: 35.7796, lng: -78.6382, zips: ["27601","27603","27604","27605","27607","27608","27609","27610"] },
  { city: "Long Beach", region: "CA", lat: 33.7701, lng: -118.1937, zips: ["90801","90802","90803","90804","90805","90806","90807","90808"] },
  { city: "Virginia Beach", region: "VA", lat: 36.8529, lng: -75.978, zips: ["23451","23452","23453","23454","23455","23456","23457","23460"] },
  { city: "Miami", region: "FL", lat: 25.7617, lng: -80.1918, zips: ["33101","33125","33127","33128","33129","33130","33131","33133"] },
  { city: "Oakland", region: "CA", lat: 37.8044, lng: -122.2712, zips: ["94601","94602","94603","94605","94606","94607","94609","94610"] },
  { city: "Minneapolis", region: "MN", lat: 44.9778, lng: -93.265, zips: ["55401","55402","55403","55404","55405","55406","55407","55408"] },
  { city: "Tampa", region: "FL", lat: 27.9506, lng: -82.4572, zips: ["33601","33602","33603","33604","33605","33606","33607","33609"] },
  { city: "Tulsa", region: "OK", lat: 36.154, lng: -95.9928, zips: ["74101","74103","74104","74105","74106","74107","74108","74110"] },
  { city: "Arlington", region: "TX", lat: 32.7357, lng: -97.1081, zips: ["76001","76002","76006","76010","76011","76012","76013","76014"] },
  { city: "New Orleans", region: "LA", lat: 29.9511, lng: -90.0715, zips: ["70112","70113","70115","70116","70117","70118","70119","70122"] },
  { city: "Wichita", region: "KS", lat: 37.6872, lng: -97.3301, zips: ["67201","67202","67203","67204","67205","67206","67207","67208"] },
  { city: "Cleveland", region: "OH", lat: 41.4993, lng: -81.6944, zips: ["44101","44102","44103","44104","44105","44106","44107","44108"] },
  { city: "Bakersfield", region: "CA", lat: 35.3733, lng: -119.0187, zips: ["93301","93304","93305","93306","93307","93308","93309","93311"] },
  { city: "Aurora", region: "CO", lat: 39.7294, lng: -104.8319, zips: ["80010","80011","80012","80013","80014","80015","80016","80017"] },
  { city: "Anaheim", region: "CA", lat: 33.8366, lng: -117.9143, zips: ["92801","92802","92804","92805","92806","92807","92808"] },
  { city: "Honolulu", region: "HI", lat: 21.3069, lng: -157.8583, zips: ["96801","96813","96814","96815","96816","96817","96818","96819"] },
  { city: "Santa Ana", region: "CA", lat: 33.7455, lng: -117.8677, zips: ["92701","92703","92704","92705","92706","92707"] },
  { city: "Riverside", region: "CA", lat: 33.9533, lng: -117.3962, zips: ["92501","92503","92504","92505","92506","92507","92508"] },
  { city: "Corpus Christi", region: "TX", lat: 27.8006, lng: -97.3964, zips: ["78401","78404","78405","78408","78410","78411","78412","78414"] },
  { city: "Pittsburgh", region: "PA", lat: 40.4406, lng: -79.9959, zips: ["15201","15203","15206","15208","15210","15213","15217","15219"] },
  { city: "Lexington", region: "KY", lat: 38.0406, lng: -84.5037, zips: ["40502","40503","40504","40505","40507","40508","40509","40510"] },
  { city: "Anchorage", region: "AK", lat: 61.2181, lng: -149.9003, zips: ["99501","99502","99503","99504","99507","99508"] },
  { city: "Stockton", region: "CA", lat: 37.9577, lng: -121.2908, zips: ["95201","95202","95203","95204","95205","95206","95207","95209"] },
  { city: "St. Louis", region: "MO", lat: 38.627, lng: -90.1994, zips: ["63101","63102","63103","63104","63106","63108","63110","63112"] },
  { city: "Cincinnati", region: "OH", lat: 39.1031, lng: -84.512, zips: ["45201","45202","45203","45204","45205","45206","45207","45208"] },
  { city: "St. Paul", region: "MN", lat: 44.9537, lng: -93.09, zips: ["55101","55102","55103","55104","55105","55106","55107","55108"] },
  { city: "Newark", region: "NJ", lat: 40.7357, lng: -74.1724, zips: ["07101","07102","07103","07104","07105","07106","07107","07108"] },
  { city: "Greensboro", region: "NC", lat: 36.0726, lng: -79.792, zips: ["27401","27403","27405","27406","27407","27408","27409","27410"] },
  { city: "Buffalo", region: "NY", lat: 42.8864, lng: -78.8784, zips: ["14201","14202","14203","14204","14206","14207","14208","14209"] },
  { city: "Plano", region: "TX", lat: 33.0198, lng: -96.6989, zips: ["75023","75024","75025","75074","75075"] },
  { city: "Lincoln", region: "NE", lat: 40.8136, lng: -96.7026, zips: ["68501","68502","68503","68504","68505","68506","68507","68508"] },
  { city: "Orlando", region: "FL", lat: 28.5383, lng: -81.3792, zips: ["32801","32803","32805","32806","32807","32808","32809","32812"] },
  { city: "Irvine", region: "CA", lat: 33.6846, lng: -117.8265, zips: ["92602","92603","92604","92606","92612","92614","92618","92620"] },
  { city: "Norfolk", region: "VA", lat: 36.8508, lng: -76.2859, zips: ["23501","23502","23503","23504","23505","23507","23508","23510"] },
  { city: "Durham", region: "NC", lat: 35.994, lng: -78.8986, zips: ["27701","27703","27704","27705","27707","27712","27713"] },
  { city: "Madison", region: "WI", lat: 43.0731, lng: -89.4012, zips: ["53701","53703","53704","53705","53706","53711","53713","53714"] },
  { city: "Chandler", region: "AZ", lat: 33.3062, lng: -111.8413, zips: ["85224","85225","85226","85248","85249"] },
  { city: "Baton Rouge", region: "LA", lat: 30.4515, lng: -91.1871, zips: ["70801","70802","70803","70805","70806","70808","70809","70810"] },
  { city: "Lubbock", region: "TX", lat: 33.5779, lng: -101.8552, zips: ["79401","79403","79404","79406","79407","79410","79411","79412"] },
  { city: "Scottsdale", region: "AZ", lat: 33.4942, lng: -111.9261, zips: ["85250","85251","85253","85254","85255","85257","85258","85260"] },
  { city: "Reno", region: "NV", lat: 39.5296, lng: -119.8138, zips: ["89501","89502","89503","89509","89511","89512","89519","89521"] },
  { city: "Glendale", region: "AZ", lat: 33.5387, lng: -112.1859, zips: ["85301","85302","85303","85304","85305","85306","85307","85308"] },
  { city: "Gilbert", region: "AZ", lat: 33.3528, lng: -111.789, zips: ["85233","85234","85295","85296","85297","85298"] },
  { city: "Winston-Salem", region: "NC", lat: 36.0999, lng: -80.2442, zips: ["27101","27103","27104","27105","27106","27107"] },
  { city: "Boise", region: "ID", lat: 43.615, lng: -116.2023, zips: ["83701","83702","83703","83704","83705","83706","83709","83713"] },
  { city: "Richmond", region: "VA", lat: 37.5407, lng: -77.436, zips: ["23219","23220","23221","23222","23223","23224","23225","23226"] },
  { city: "Spokane", region: "WA", lat: 47.6588, lng: -117.426, zips: ["99201","99202","99203","99204","99205","99207","99208","99212"] },
  { city: "Des Moines", region: "IA", lat: 41.5868, lng: -93.625, zips: ["50301","50309","50310","50311","50312","50313","50314","50315"] },
  { city: "Salt Lake City", region: "UT", lat: 40.7608, lng: -111.891, zips: ["84101","84102","84103","84104","84105","84106","84108","84111"] },
  { city: "Birmingham", region: "AL", lat: 33.5207, lng: -86.8025, zips: ["35201","35203","35205","35206","35207","35209","35210","35212"] },
  { city: "Rochester", region: "NY", lat: 43.1566, lng: -77.6088, zips: ["14604","14605","14606","14607","14608","14609","14610","14611"] },
  { city: "Tacoma", region: "WA", lat: 47.2529, lng: -122.4443, zips: ["98401","98402","98403","98404","98405","98406","98407","98408"] },
  { city: "Knoxville", region: "TN", lat: 35.9606, lng: -83.9207, zips: ["37901","37902","37909","37912","37914","37916","37917","37918"] },
  { city: "Tallahassee", region: "FL", lat: 30.4383, lng: -84.2807, zips: ["32301","32303","32304","32305","32308","32309","32310","32311"] },
  { city: "Providence", region: "RI", lat: 41.824, lng: -71.4128, zips: ["02901","02903","02904","02905","02906","02907","02908","02909"] },
  { city: "Bridgeport", region: "CT", lat: 41.1865, lng: -73.1952, zips: ["06601","06604","06605","06606","06607","06608","06610"] },
  { city: "Little Rock", region: "AR", lat: 34.7465, lng: -92.2896, zips: ["72201","72202","72204","72205","72206","72207","72209","72211"] },
  { city: "Hartford", region: "CT", lat: 41.7658, lng: -72.6734, zips: ["06101","06103","06105","06106","06112","06114","06120"] },
  { city: "Chattanooga", region: "TN", lat: 35.0456, lng: -85.3097, zips: ["37401","37402","37403","37404","37405","37406","37407","37408"] },
  { city: "Jackson", region: "MS", lat: 32.2988, lng: -90.1848, zips: ["39201","39202","39203","39204","39206","39209","39211","39212"] },
  { city: "Charleston", region: "SC", lat: 32.7765, lng: -79.9311, zips: ["29401","29403","29405","29406","29407","29412","29414","29418"] },
  { city: "Savannah", region: "GA", lat: 32.0809, lng: -81.0912, zips: ["31401","31404","31405","31406","31410","31411","31415"] },
];

function jitter(val, range = 0.04) {
  return +(val + (Math.random() - 0.5) * 2 * range).toFixed(4);
}

function pickZip(metro) {
  return metro.zips[Math.floor(Math.random() * metro.zips.length)];
}

let idCounter = 0;
function nextId(prefix) {
  return `${prefix}-${++idCounter}`;
}

// ─── Chain Facilities ───
const CHAINS = [
  {
    brand: "Best Buy", prefix: "bestbuy", category: "electronics",
    materials: ["electronics","computers","phones","tablets","cables","chargers","printers","ink cartridges","batteries","TVs under 32 inches"],
    hours: "Mon-Sat 10am-9pm, Sun 11am-7pm",
    website: "https://www.bestbuy.com/recycling",
    notes: "Free electronics recycling at all Best Buy locations."
  },
  {
    brand: "Home Depot", prefix: "homedepot", category: "other",
    materials: ["CFL bulbs","rechargeable batteries","plastic bags","lead-acid batteries"],
    hours: "Mon-Sat 6am-10pm, Sun 8am-8pm",
    website: "https://www.homedepot.com/c/ab/recycling",
    notes: "Accepts CFL bulbs and rechargeable batteries at the front of the store."
  },
  {
    brand: "Lowe's", prefix: "lowes", category: "other",
    materials: ["CFL bulbs","rechargeable batteries","plastic bags","lead-acid batteries"],
    hours: "Mon-Sat 6am-10pm, Sun 8am-8pm",
    website: "https://www.lowes.com/l/shop/recycling",
    notes: "Accepts CFL bulbs and rechargeable batteries at the customer service desk."
  },
  {
    brand: "Goodwill", prefix: "goodwill", category: "textiles",
    materials: ["clothing","shoes","textiles","household goods","books","small electronics","furniture"],
    hours: "Mon-Sat 10am-7pm, Sun 12pm-6pm",
    website: "https://www.goodwill.org",
    notes: "Donations accepted during store hours. Tax receipts available."
  },
  {
    brand: "Salvation Army", prefix: "salvationarmy", category: "textiles",
    materials: ["clothing","shoes","textiles","furniture","household goods","appliances","books"],
    hours: "Mon-Sat 9am-6pm",
    website: "https://www.salvationarmyusa.org",
    notes: "Free pickup available for large items in many areas."
  },
  {
    brand: "Staples", prefix: "staples", category: "other",
    materials: ["ink cartridges","toner cartridges","rechargeable batteries","small electronics","phones"],
    hours: "Mon-Fri 8am-9pm, Sat 9am-9pm, Sun 10am-6pm",
    website: "https://www.staples.com/recycling",
    notes: "Earn rewards for recycling ink cartridges."
  },
  {
    brand: "Batteries Plus", prefix: "battplus", category: "other",
    materials: ["batteries","rechargeable batteries","car batteries","phone batteries","laptop batteries","light bulbs"],
    hours: "Mon-Fri 8am-8pm, Sat 8am-7pm, Sun 10am-5pm",
    website: "https://www.batteriesplus.com",
    notes: "Accepts all battery types for recycling."
  },
];

function generateChains() {
  const facilities = [];
  for (const chain of CHAINS) {
    const count = chain.brand === "Best Buy" ? 120 :
                  chain.brand === "Goodwill" ? 100 :
                  chain.brand === "Salvation Army" ? 80 :
                  chain.brand === "Home Depot" ? 100 :
                  chain.brand === "Lowe's" ? 90 :
                  chain.brand === "Staples" ? 60 : 50;

    const shuffled = [...METROS].sort(() => Math.random() - 0.5).slice(0, count);
    for (const metro of shuffled) {
      facilities.push({
        id: nextId(chain.prefix),
        name: `${chain.brand} - ${metro.city}`,
        category: chain.category,
        address: {
          street: `${1000 + Math.floor(Math.random() * 9000)} ${["Main St","Commerce Dr","Market St","Industrial Blvd","Retail Way","Shopping Center Dr","Parkway Dr"][Math.floor(Math.random() * 7)]}`,
          city: metro.city,
          region: metro.region,
          postalCode: pickZip(metro),
          country: "US"
        },
        coordinates: { lat: jitter(metro.lat, 0.03), lng: jitter(metro.lng, 0.03) },
        acceptedMaterials: chain.materials,
        hours: chain.hours,
        website: chain.website,
        notes: chain.notes
      });
    }
  }
  return facilities;
}

// ─── Municipal Facilities ───
const MUNICIPAL_TEMPLATES = [
  {
    nameTemplate: "{city} Recycling Center", category: "recycling_center",
    materials: ["glass bottles","cardboard","paper","plastics #1-#5","aluminum cans","steel cans","scrap metal","electronics"],
    hours: "Mon-Sat 8am-5pm",
  },
  {
    nameTemplate: "{city} Household Hazardous Waste Facility", category: "hazardous_waste",
    materials: ["batteries","paint","motor oil","pesticides","chemicals","propane tanks","fluorescent bulbs","medications","solvents","antifreeze"],
    hours: "Fri-Sat 9am-4pm",
  },
  {
    nameTemplate: "{city} Transfer Station", category: "dropoff",
    materials: ["bulk items","mattresses","furniture","appliances","yard waste","construction debris","tires"],
    hours: "Mon-Sun 7am-5pm",
  },
  {
    nameTemplate: "{city} Electronics Recycling Drop-off", category: "electronics",
    materials: ["electronics","computers","monitors","TVs","printers","phones","cables","keyboards","mice"],
    hours: "Tue-Sat 9am-4pm",
  },
  {
    nameTemplate: "{city} Composting Facility", category: "recycling_center",
    materials: ["yard waste","food scraps","compostable paper","wood chips","leaves","grass clippings"],
    hours: "Mon-Sat 7:30am-4:30pm",
  },
];

function generateMunicipal() {
  const facilities = [];
  for (const metro of METROS) {
    const templates = [...MUNICIPAL_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 per city
    for (let i = 0; i < Math.min(count, templates.length); i++) {
      const t = templates[i];
      facilities.push({
        id: nextId("muni"),
        name: t.nameTemplate.replace("{city}", metro.city),
        category: t.category,
        address: {
          street: `${100 + Math.floor(Math.random() * 9900)} ${["County Rd","Industrial Park Dr","Solid Waste Dr","Resource Recovery Rd","Environmental Way","Public Works Blvd","Recycling Center Rd"][Math.floor(Math.random() * 7)]}`,
          city: metro.city,
          region: metro.region,
          postalCode: pickZip(metro),
          country: "US"
        },
        coordinates: { lat: jitter(metro.lat, 0.05), lng: jitter(metro.lng, 0.05) },
        acceptedMaterials: t.materials,
        hours: t.hours,
        phone: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        notes: `Free for ${metro.city} residents. Proof of residency may be required.`
      });
    }
  }
  return facilities;
}

// ─── Specialty Facilities ───
const SPECIALTY_TEMPLATES = [
  {
    nameTemplate: "{city} Scrap Metal Recyclers", category: "recycling_center",
    materials: ["scrap metal","aluminum","copper","brass","steel","iron","stainless steel","wire"],
    hours: "Mon-Fri 7am-5pm, Sat 8am-12pm",
    notes: "Pays cash for scrap metal by weight."
  },
  {
    nameTemplate: "{city} Tire Recycling Center", category: "dropoff",
    materials: ["tires","truck tires","bicycle tires","rubber"],
    hours: "Mon-Fri 8am-4:30pm",
    notes: "Small fee per tire. Call ahead for large quantities."
  },
  {
    nameTemplate: "{city} Textile Recovery", category: "textiles",
    materials: ["clothing","shoes","textiles","linens","towels","blankets","curtains","stuffed animals"],
    hours: "24/7 outdoor drop box",
    notes: "Unattended drop box available 24/7. Items must be clean and dry."
  },
  {
    nameTemplate: "{city} Plastic Bag Drop-off", category: "plastic_bags",
    materials: ["plastic bags","plastic film","bubble wrap","shrink wrap","dry cleaning bags","bread bags","newspaper bags"],
    hours: "Mon-Sun 6am-10pm",
    notes: "Located in grocery store vestibule. Bags must be clean and dry."
  },
  {
    nameTemplate: "{city} Paper Shredding & Recycling", category: "recycling_center",
    materials: ["paper","confidential documents","cardboard","magazines","junk mail","phone books"],
    hours: "Mon-Fri 8am-5pm",
    notes: "Free document shredding events monthly. Call for schedule."
  },
  {
    nameTemplate: "{city} Used Oil Collection Center", category: "hazardous_waste",
    materials: ["motor oil","cooking oil","transmission fluid","brake fluid","oil filters","antifreeze"],
    hours: "Mon-Sat 8am-5pm",
    notes: "Limit 5 gallons per visit. Must be in sealed containers."
  },
  {
    nameTemplate: "{city} Mattress Recycling", category: "dropoff",
    materials: ["mattresses","box springs","futons","crib mattresses"],
    hours: "Tue-Sat 9am-4pm",
    notes: "Fee per mattress applies. No wet or heavily soiled mattresses."
  },
];

function generateSpecialty() {
  const facilities = [];
  for (const metro of METROS) {
    const templates = [...SPECIALTY_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * 2); // 1-2 per city
    for (let i = 0; i < count; i++) {
      const t = templates[i];
      facilities.push({
        id: nextId("spec"),
        name: t.nameTemplate.replace("{city}", metro.city),
        category: t.category,
        address: {
          street: `${100 + Math.floor(Math.random() * 9900)} ${["Warehouse Row","Industrial Ave","Salvage Rd","Recovery Ln","Green Blvd"][Math.floor(Math.random() * 5)]}`,
          city: metro.city,
          region: metro.region,
          postalCode: pickZip(metro),
          country: "US"
        },
        coordinates: { lat: jitter(metro.lat, 0.06), lng: jitter(metro.lng, 0.06) },
        acceptedMaterials: t.materials,
        hours: t.hours,
        notes: t.notes
      });
    }
  }
  return facilities;
}

// ─── Generate & Write ───
console.log("Generating facilities...");

const chains = generateChains();
const municipal = generateMunicipal();
const specialty = generateSpecialty();

console.log(`  Chains:    ${chains.length}`);
console.log(`  Municipal: ${municipal.length}`);
console.log(`  Specialty: ${specialty.length}`);
console.log(`  Total:     ${chains.length + municipal.length + specialty.length}`);

function writeProvider(filename, id, name, facilities) {
  const provider = {
    id,
    coverage: { country: "US" },
    source: { name, url: "https://isthisrecyclable.com", license: "Generated facility data" },
    facilities
  };
  const out = join(OUT_DIR, filename);
  writeFileSync(out, JSON.stringify(provider, null, 2));
  console.log(`  Wrote ${out} (${facilities.length} facilities)`);
}

writeProvider("us-chains.json", "us-chains", "US National Chain Recycling Programs", chains);
writeProvider("us-municipal.json", "us-municipal", "US Municipal Recycling Facilities", municipal);
writeProvider("us-specialty.json", "us-specialty", "US Specialty Recycling Facilities", specialty);

console.log("Done!");
