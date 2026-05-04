export type SeismicEvent = {
  id: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  mag: number;
  depthKm: number;
  location: string;
  region: string;
  state: string;
};

export type SwdWell = {
  id: string;
  lat: number;
  lng: number;
  volBblPerDay: number;
  operator: string;
};

export type Operation = {
  id: string;
  title: string;
  detail: string;
  date: string;
  depthM: number;
};

export const EVENTS: SeismicEvent[] = [
  {
    id: "EV-2024-0831",
    date: "Aug 31, 2024",
    time: "14:22:07",
    lat: 31.832,
    lng: -103.412,
    mag: 3.8,
    depthKm: 5.2,
    location: "Reeves County",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0829",
    date: "Aug 29, 2024",
    time: "09:44:51",
    lat: 31.621,
    lng: -103.891,
    mag: 2.9,
    depthKm: 3.8,
    location: "Culberson County",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0827",
    date: "Aug 27, 2024",
    time: "22:11:33",
    lat: 31.965,
    lng: -102.953,
    mag: 4.1,
    depthKm: 7.1,
    location: "Pecos County",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0825",
    date: "Aug 25, 2024",
    time: "03:58:19",
    lat: 32.104,
    lng: -103.244,
    mag: 2.4,
    depthKm: 4.5,
    location: "Ward County",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0822",
    date: "Aug 22, 2024",
    time: "18:30:02",
    lat: 31.743,
    lng: -102.677,
    mag: 3.2,
    depthKm: 6,
    location: "Midland Basin",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0819",
    date: "Aug 19, 2024",
    time: "11:05:44",
    lat: 32.287,
    lng: -103.655,
    mag: 2.1,
    depthKm: 2.9,
    location: "Eddy Adjacent",
    region: "West Texas / Permian",
    state: "TX",
  },
  {
    id: "EV-2024-0815",
    date: "Aug 15, 2024",
    time: "07:17:28",
    lat: 31.505,
    lng: -103.12,
    mag: 3.5,
    depthKm: 5.8,
    location: "Reeves County",
    region: "West Texas / Permian",
    state: "TX",
  },
];

export const WELLS: SwdWell[] = [
  { id: "SWD-001", lat: 31.855, lng: -103.44, volBblPerDay: 42000, operator: "Pioneer Natural Resources" },
  { id: "SWD-002", lat: 31.798, lng: -103.381, volBblPerDay: 31500, operator: "Diamondback Energy" },
  { id: "SWD-003", lat: 31.612, lng: -103.87, volBblPerDay: 28000, operator: "ConocoPhillips" },
  { id: "SWD-004", lat: 31.98, lng: -102.92, volBblPerDay: 55000, operator: "Devon Energy" },
  { id: "SWD-005", lat: 32.11, lng: -103.26, volBblPerDay: 19000, operator: "Coterra Energy" },
];

export const MOCK_OPERATIONS: Operation[] = [
  { id: "OP-9812", title: "Excavation", detail: "Shallow trenching and pad prep", date: "2024-08-10", depthM: 6 },
  { id: "OP-1044", title: "Blasting", detail: "Controlled micro-blast (permitted)", date: "2024-08-14", depthM: 18 },
  { id: "OP-1201", title: "Drilling", detail: "Directional drilling (pilot hole)", date: "2024-08-21", depthM: 2200 },
  { id: "OP-1337", title: "Injection", detail: "SWD injection phase (ramp-up)", date: "2024-08-25", depthM: 1600 },
];
