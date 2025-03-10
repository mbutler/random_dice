import { fetch } from 'undici';
import { DiceRoller, DiscordRollRenderer } from 'dice-roller-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.RANDOM_ORG_API_KEY;

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

  const diceRoller = new DiceRoller(() => {
    if (index >= randomNumbers.length) throw new Error('Not enough random numbers');
    return randomNumbers[index++]; // 0-1 range, perfect for DiceRoller
  }, 100); // Max 100 rolls per die

  const roll = diceRoller.roll(diceString);
  const renderer = new DiscordRollRenderer();
  return {
    total: roll.value,
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

// CLI logic
(async () => {
  // Get dice notation from command-line arguments
  const args = process.argv.slice(2);
  const diceString = args.join(' ').trim();

  if (!diceString) {
    console.error('Please provide dice notation as an argument.');
    console.error('Example: bun dice.js "3d6kh2 + 2d8>6"');
    process.exit(1);
  }

  try {
    if (!apiKey) throw new Error('API key is missing. Please set RANDOM_ORG_API_KEY in your .env file.');
    const result = await rollDice(diceString);
    console.log(`${diceString} = ${result.total} (${result.discord})`);
  } catch (error) {
    console.error('Rolling dice failed:', error.message);
    process.exit(1);
  }
})();