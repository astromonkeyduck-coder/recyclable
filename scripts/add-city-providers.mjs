import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const generalPath = resolve(__dirname, "../data/providers/general.json");
const outDir = resolve(__dirname, "../data/providers");

const general = JSON.parse(readFileSync(generalPath, "utf-8"));
const materials = general.materials.slice(0, 50);
const rulesSummary = general.rulesSummary;

const cities = [
  {
    id: "la",
    displayName: "Los Angeles, CA",
    coverage: {
      country: "US",
      region: "CA",
      city: "Los Angeles",
      zips: ["90001", "90002", "90003", "90004", "90005", "90006", "90007", "90008", "90009", "90010", "90011", "90012", "90013", "90014", "90015", "90016", "90017", "90018", "90019", "90020", "90021", "90022", "90023", "90024", "90025", "90026", "90027", "90028", "90029", "90031", "90032", "90033", "90034", "90035", "90036", "90037", "90038", "90039", "90040", "90041", "90042", "90043", "90044", "90045", "90046", "90047", "90048", "90049", "90056", "90057", "90058", "90059", "90061", "90062", "90063", "90064", "90065", "90066", "90067", "90068", "90069", "90077", "90079", "90089", "90090", "90094", "90095"],
      aliases: ["los angeles", "la", "l.a.", "la california", "city of angels"],
    },
    source: {
      name: "LA Sanitation & Environment",
      url: "https://www.lacitysan.org/cs/groups/public/documents/document/y250/mdax/~edisp/cnt044002.pdf",
      generatedAt: new Date().toISOString().slice(0, 10),
      notes: "Placeholder based on general US guidance. Replace with official LA extraction when available.",
      license: "Public domain",
    },
  },
  {
    id: "chicago",
    displayName: "Chicago, IL",
    coverage: {
      country: "US",
      region: "IL",
      city: "Chicago",
      zips: ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661"],
      aliases: ["chicago illinois", "chicago il", "chi", "windy city"],
    },
    source: {
      name: "City of Chicago — Streets & Sanitation",
      url: "https://www.chicago.gov/city/en/depts/streets/provdrs/streets_san/supp_info/recycling.html",
      generatedAt: new Date().toISOString().slice(0, 10),
      notes: "Placeholder based on general US guidance. Replace with official Chicago extraction when available.",
      license: "Public domain",
    },
  },
  {
    id: "sf",
    displayName: "San Francisco, CA",
    coverage: {
      country: "US",
      region: "CA",
      city: "San Francisco",
      zips: ["94102", "94103", "94104", "94105", "94107", "94108", "94109", "94110", "94111", "94112", "94114", "94115", "94116", "94117", "94118", "94121", "94122", "94123", "94124", "94127", "94131", "94132", "94133", "94134", "94137", "94139", "94140", "94141", "94142", "94143", "94144", "94145", "94146", "94147", "94151", "94158", "94159", "94160", "94161", "94163", "94164", "94172", "94177", "94188"],
      aliases: ["san francisco", "sf", "s.f.", "san fran", "bay area"],
    },
    source: {
      name: "SF Environment — Recology",
      url: "https://www.sfenvironment.org/recycling",
      generatedAt: new Date().toISOString().slice(0, 10),
      notes: "Placeholder based on general US guidance. San Francisco has strict recycling and mandatory composting. Replace with official SF extraction when available.",
      license: "Public domain",
    },
  },
  {
    id: "denver",
    displayName: "Denver, CO",
    coverage: {
      country: "US",
      region: "CO",
      city: "Denver",
      zips: ["80202", "80203", "80204", "80205", "80206", "80207", "80209", "80210", "80211", "80212", "80214", "80216", "80218", "80219", "80220", "80221", "80222", "80223", "80224", "80226", "80227", "80229", "80230", "80231", "80232", "80233", "80234", "80235", "80236", "80237", "80238", "80239", "80241", "80243", "80244", "80246", "80247", "80248", "80249", "80250", "80251", "80256", "80257", "80259", "80260", "80261", "80262", "80263", "80264", "80265", "80266", "80271", "80273", "80274", "80279", "80280", "80281", "80290", "80291", "80293", "80294", "80295", "80299"],
      aliases: ["denver colorado", "denver co", "mile high city"],
    },
    source: {
      name: "Denver Solid Waste Management",
      url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Department-of-Transportation-Infrastructure/Solid-Waste-Management",
      generatedAt: new Date().toISOString().slice(0, 10),
      notes: "Placeholder based on general US guidance. Denver has unique composting programs. Replace with official Denver extraction when available.",
      license: "Public domain",
    },
  },
];

for (const city of cities) {
  const provider = {
    id: city.id,
    displayName: city.displayName,
    coverage: city.coverage,
    source: city.source,
    materials,
    rulesSummary,
  };
  writeFileSync(resolve(outDir, `${city.id}.json`), JSON.stringify(provider, null, 2));
  console.log(`Wrote ${city.id}.json`);
}
