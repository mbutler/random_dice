import { fetch } from 'undici';
import { DiceRoller, DiscordRollRenderer } from 'dice-roller-parser';

const apiKey = '';

async function fetchFromRandomOrg(count) {
  const url = 'https://api.random.org/json-rpc/4/invoke';
  const requestBody = {
    "jsonrpc": "2.0",
    "method": "generateDecimalFractions",
    "params": { "apiKey": apiKey, "n": count, "decimalPlaces": 14, "replacement": true },
    "id": 42
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  return json.result.random.data.map(Number);
}

function countDice(parsed) {
  if (parsed.type === 'die') return parsed.count.value || 1;
  if (parsed.type === 'group' || parsed.type === 'diceExpression') {
    return parsed.rolls?.reduce((sum, roll) => sum + countDice(roll), 0) || 0;
  }
  if (parsed.ops) {
    return parsed.ops.reduce((sum, op) => sum + countDice(op.tail || op.expr), countDice(parsed.head));
  }
  return 0;
}

async function rollDice(diceString) {
  const parsed = new DiceRoller().parse(diceString); // Parse first to count dice
  const dieCount = Math.min(countDice(parsed), 100); // Respect maxRollCount
  const randomNumbers = await fetchFromRandomOrg(dieCount);
  let index = 0;

  // Use random.org numbers in the DiceRoller constructor
  const diceRoller = new DiceRoller(() => {
    if (index >= randomNumbers.length) throw new Error('Not enough random numbers');
    return randomNumbers[index++]; // 0-1 range, perfect for DiceRoller
  }, 100); // Max 100 rolls per die

  const roll = diceRoller.roll(diceString);
  const renderer = new DiscordRollRenderer();
  return {
    total: roll.value,
    details: roll,
    discord: renderer.render(roll)
  };
}

/*
 * Supported Dice Notation Formats:
 * - Basic: NdM (e.g., "3d6" - roll 3 six-sided dice)
 * - Arithmetic: + - * / % ** (e.g., "2d6 + 3d8" - add rolls)
 * - Keep/Drop: khN, klN, dhN, dlN (e.g., "4d6kh3" - keep 3 highest, "4d6dl1" - drop lowest)
 * - Success/Failure: >N, <N, =N (e.g., "5d6>3" - count dice over 3)
 * - Explode: !, !p, !! (e.g., "3d6!" - reroll 6s, "3d6!p" - penetrate)
 * - Reroll: rN, roN (e.g., "2d6r<2" - reroll less than 2, "2d6ro<2" - reroll once)
 * - Group: {N,M} (e.g., "{2d6,3d8}" - group rolls)
 * - Sort: sa, sd (e.g., "4d6sa" - sort ascending)
 * - Math Functions: floor(), ceil(), round(), abs() (e.g., "floor(3d6/2)")
 * - Fate Dice: NdF (e.g., "2dF" - roll 2 fate dice: -1, 0, 1)
 * - Match: m, mt (e.g., "3d6m" - highlight matches, "20d6mt3" - count triple matches)
 * - Inline: [[expression]] (e.g., "[[2d20kh1]]" - inline roll)
 */

(async () => {
  try {
    const result = await rollDice("3d6kh2 + 2d8>6");
    console.log(`Total: ${result.total}`);
    console.log("Details:", JSON.stringify(result.details, null, 2));
    console.log(`Discord: ${result.discord}`);
  } catch (error) {
    console.error('Rolling dice failed:', error);
  }
})();