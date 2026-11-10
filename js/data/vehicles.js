// EDIT: capacity = how many pieces (blocks, cabro) or loads (sand) one trip carries.
// These are SAMPLE numbers. Replace them with the real figures before launch.
export const vehicles = [
  { id: 'faw', name: 'FAW tipper', role: 'Bulk sand and large block orders', blurb: 'Our heavy hauler for full loads to building sites.', capacity: { blocks: 800, cabro: 1500, sand: 1 }, image: 'assets/images/faw-tipper.jpg' },
  { id: 'fuso', name: 'Mitsubishi Fuso canter', role: 'Smaller orders and tighter access', blurb: 'A lighter truck for narrow roads and smaller jobs.', capacity: { blocks: 300, cabro: 600, sand: 1 }, image: 'assets/images/fuso-canter.jpg' },
];
// EDIT: fee in KES per trip, or null to confirm on WhatsApp.
export const zones = [
  { id: 'kimana', name: 'Kimana', fee: null },
  { id: 'rombo', name: 'Rombo', fee: null },
  { id: 'loitokitok', name: 'Loitokitok', fee: null },
  { id: 'entonet', name: 'Entonet', fee: null },
  { id: 'other', name: 'Another nearby area', fee: null },
];
