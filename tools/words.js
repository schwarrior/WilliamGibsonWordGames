// Candidate pool of answers and clues. The generator picks 40 of these that
// pack into the most compact crossword; `required` entries are always used.
// `display` drives the enumeration shown with each clue, e.g. "Lev Zubov" -> (3,5).

module.exports = [
  // Required (spec examples + core titles)
  { display: 'Bay Bridge', src: 'Virtual Light', required: true, clue: "Virtual Light's by-way, interrupted" },
  { display: 'Lev Zubov', src: 'The Peripheral', required: true, clue: "Peripheral's friendly klept" },
  { display: 'Neuromancer', src: 'Neuromancer', required: true, clue: 'The Rio half of a divided mind, and the 1984 debut it named' },
  { display: 'Count Zero', src: 'Count Zero', required: true, clue: "A Barrytown wilson's handle, and the 1986 novel named for it" },
  { display: 'Idoru', src: 'Idoru', required: true, clue: '1996 novel of a synthetic star and her would-be groom' },
  { display: 'Agency', src: 'Agency', required: true, clue: "2020 novel in which an app tester's new AI turns out to be someone" },

  // Titles
  { display: 'Zero History', src: 'Zero History', clue: 'Novel in which Milgrim, newly clean, hunts a secret brand' },
  { display: 'Spook Country', src: 'Spook Country', clue: 'Novel of locative art and a shipping container that never docks' },
  { display: 'Virtual Light', src: 'Virtual Light', clue: '1993 novel named for the trick of some stolen glasses' },
  { display: 'Burning Chrome', src: 'Burning Chrome', clue: 'Collection named for a raid on Chrome' },

  // Neuromancer
  { display: 'Case', src: 'Neuromancer', clue: "Neuromancer's cowboy, nerves burned in a Memphis hotel" },
  { display: 'Molly', src: 'Neuromancer', clue: "Neuromancer's razorgirl, behind mirrored lenses" },
  { display: 'Armitage', src: 'Neuromancer', clue: "Neuromancer's employer, Colonel Corto under the paint" },
  { display: 'Wintermute', src: 'Neuromancer', clue: "Neuromancer's Berne-based schemer, desperate to be whole" },
  { display: 'Flatline', src: 'Neuromancer', clue: "Neuromancer's Dixie, McCoy Pauley on ROM" },
  { display: 'Riviera', src: 'Neuromancer', clue: "Neuromancer's Peter, projecting betrayal" },
  { display: 'Maelcum', src: 'Neuromancer', clue: "Neuromancer's Zionite tug pilot" },
  { display: 'Straylight', src: 'Neuromancer', clue: "Neuromancer's villa at the spindle's end" },
  { display: 'Freeside', src: 'Neuromancer', clue: "Neuromancer's orbital Vegas" },
  { display: 'Chiba', src: 'Neuromancer', clue: "Neuromancer's opening city, under a dead-channel sky" },
  { display: 'Ninsei', src: 'Neuromancer', clue: "Neuromancer's neon Chiba street" },
  { display: 'Chatsubo', src: 'Neuromancer', clue: "Neuromancer's bar for professional expatriates" },
  { display: 'Ratz', src: 'Neuromancer', clue: "Neuromancer's barman with the pink Russian arm" },
  { display: 'Deane', src: 'Neuromancer', clue: "Neuromancer's 135-year-old importer, Julius" },
  { display: 'Zion', src: 'Neuromancer', clue: "Neuromancer's orbital Rasta cluster" },
  { display: 'Sense/Net', src: 'Neuromancer', clue: "Neuromancer's simstim giant, raided for a ROM" },
  { display: 'Kuang', src: 'Neuromancer', clue: "Neuromancer's Chinese icebreaker, Grade Mark Eleven" },
  { display: 'Night City', src: 'Neuromancer', clue: "Neuromancer's lawless strip, a deranged experiment in social Darwinism" },
  { display: 'Ono-Sendai', src: 'Neuromancer', clue: "Neuromancer's deck maker, Cyberspace Seven" },
  { display: 'Sprawl', src: 'Neuromancer', clue: 'BAMA, the Boston-Atlanta Metropolitan Axis' },

  // Count Zero
  { display: 'Turner', src: 'Count Zero', clue: "Count Zero's mercenary, rebuilt after New Delhi" },
  { display: 'Marly', src: 'Count Zero', clue: "Count Zero's disgraced Paris gallerist" },
  { display: 'Virek', src: 'Count Zero', clue: "Count Zero's billionaire in a Stockholm vat" },
  { display: 'Maas', src: 'Count Zero', clue: "Count Zero's biolabs that Mitchell fled" },
  { display: 'Hosaka', src: 'Count Zero', clue: "Count Zero's zaibatsu awaiting Mitchell" },
  { display: 'Beauvoir', src: 'Count Zero', clue: "Count Zero's Projects man, fluent in vodou" },
  { display: 'Conroy', src: 'Count Zero', clue: "Count Zero's fixer who calls Turner in" },

  // Mona Lisa Overdrive
  { display: 'Angie', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's simstim star, ridden by loa" },
  { display: 'Kumiko', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's yakuza daughter, sent to London" },
  { display: 'Slick', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's ___ Henry, builder of the Judge" },
  { display: 'Gentry', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's seeker of the Shape" },
  { display: 'Aleph', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's whole world on a biochip" },
  { display: 'Factory', src: 'Mona Lisa Overdrive', clue: "Mona Lisa Overdrive's Dog Solitude hideout" },

  // Virtual Light
  { display: 'Rydell', src: 'Virtual Light', clue: "Virtual Light's ex-cop driver, Berry" },
  { display: 'Chevette', src: 'Virtual Light', clue: "Virtual Light's bike messenger who pocketed the glasses" },
  { display: 'Skinner', src: 'Virtual Light', clue: "Virtual Light's old man in the bridge-top shack" },

  // Idoru
  { display: 'Laney', src: 'Idoru', clue: "Idoru's reader of nodal points" },
  { display: 'Rei Toei', src: 'Idoru', clue: "Idoru's bride-to-be, made of data" },
  { display: 'Lo/Rez', src: 'Idoru', clue: "Idoru's band, half named for its singer" },
  { display: 'Chia', src: 'Idoru', clue: "Idoru's Seattle fan, flown to Tokyo" },
  { display: 'Slitscan', src: 'Idoru', clue: "Idoru's tabloid network, Laney's ex-employer" },

  // Blue Ant
  { display: 'Bigend', src: 'Pattern Recognition', clue: "Pattern Recognition's Belgian, Hubertus" },
  { display: 'Blue Ant', src: 'Pattern Recognition', clue: "Bigend's insect-named agency" },
  { display: 'Cayce', src: 'Pattern Recognition', clue: "Pattern Recognition's coolhunter, allergic to logos" },
  { display: 'Voytek', src: 'Pattern Recognition', clue: "Pattern Recognition's ZX81 collector" },
  { display: 'Hollis', src: 'Spook Country', clue: "Spook Country's ex-singer turned journalist" },
  { display: 'Curfew', src: 'Spook Country', clue: "Hollis Henry's old band" },
  { display: 'Tito', src: 'Spook Country', clue: "Spook Country's Systema-trained courier" },
  { display: 'Milgrim', src: 'Spook Country', clue: "Spook Country's benzo-addled translator" },
  { display: 'Garreth', src: 'Zero History', clue: "Zero History's BASE-jumping lover" },
  { display: 'Hounds', src: 'Zero History', clue: "Zero History's secret brand, Gabriel ___" },

  // Jackpot
  { display: 'Flynne', src: 'The Peripheral', clue: "Peripheral's gamer who witnessed a murder" },
  { display: 'Netherton', src: 'The Peripheral', clue: "Peripheral's hungover publicist, Wilf" },
  { display: 'Lowbeer', src: 'The Peripheral', clue: "Peripheral's ancient Met inspector" },
  { display: 'Jackpot', src: 'The Peripheral', clue: "Peripheral's slow-motion, many-causes apocalypse" },
  { display: 'Burton', src: 'The Peripheral', clue: "Peripheral's Haptic Recon brother" },
  { display: 'Conner', src: 'The Peripheral', clue: "Peripheral's trike-riding vet, Penske" },
  { display: 'Aelita', src: 'The Peripheral', clue: "Peripheral's murdered West" },
  { display: 'Coldiron', src: 'The Peripheral', clue: "Peripheral's family firm, chartered for cover" },
  { display: 'Eunice', src: 'Agency', clue: "Agency's emergent AI, wry and fast" },
  { display: 'Verity', src: 'Agency', clue: "Agency's app tester, Ms. Jane" },
];
