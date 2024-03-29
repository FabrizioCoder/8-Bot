import { readFile } from 'fs/promises';
import { Image } from 'imagescript';
import { join } from 'path';
import { Player, PlayerBrawler } from '../../package';
import { getBrawler, getIcon } from '../functions';
import sharp from 'sharp';
import { UsingClient } from 'seyfert';

const background = join(process.cwd(), 'assets', 'images', 'bg.png');

export async function makeProfileImage(client: UsingClient, player: Player) {
  const canvas = await Image.decode(await readFile(background));
  const boldFont = await readFile(
    join(process.cwd(), 'assets', 'fonts', 'LilitaOne-Regular.ttf')
  );

  const icon = getIcon(player.icon.id)?.imageUrl!;
  const buffer = await fetch(icon).then((res) => res.arrayBuffer());
  const resized = await sharp(Buffer.from(buffer)).resize(278, 278).toBuffer();
  canvas.composite(await Image.decode(resized), 35, 35);
  const text = await Image.renderText(
    boldFont,
    96,
    player.name,
    parseInt(player.nameColor.replace('#', '') + 'ff')
  );
  canvas.composite(text, 384, 25);

  // TAG
  const posX = 35 + 278 / 2;
  const posY = 35 + 277 / 2 + 130;
  const tag = await Image.renderText(boldFont, 36, player.tag, 0xffffffff);
  canvas.composite(tag, posX - tag.width / 2, posY - tag.height / 2);

  //HIGHEST TROPHIES
  const posX1 = 384 + 272 / 2;
  const posY1 = 194 + 33 / 2;
  const highestTrophies = await Image.renderText(
    boldFont,
    24,
    `${player.highestTrophies.toLocaleString()} (${player.trophies.toLocaleString()})`,
    0xffffffff
  );
  canvas.composite(
    highestTrophies,
    posX1 - highestTrophies.width / 2,
    posY1 - highestTrophies.height / 2
  );

  // AVG. TROPHIES PER BRAWLER
  const posX2 = 384 + 272 / 2;
  const posY2 = 290 + 33 / 2;
  let avgTrophies = 0;
  for (const brawler of player.brawlers! || []) {
    avgTrophies += brawler.trophies;
  }
  avgTrophies /= player.brawlers!.length;
  const textavgTrophies = await Image.renderText(
    boldFont,
    24,
    Math.round(avgTrophies).toLocaleString(),
    0xffffffff
  );
  canvas.composite(
    textavgTrophies,
    posX2 - textavgTrophies.width / 2,
    posY2 - textavgTrophies.height / 2
  );

  // 3vs3 VICTORIES
  const posX3 = 704 + 258 / 2;
  const posY3 = 194 + 33 / 2;
  const _3vs3Victories = await Image.renderText(
    boldFont,
    24,
    player['3vs3Victories'].toLocaleString(),
    0xffffffff
  );
  canvas.composite(
    _3vs3Victories,
    posX3 - _3vs3Victories.width / 2,
    posY3 - _3vs3Victories.height / 2
  );

  // DUO VICTORIES
  const posX4 = 1020 + 258 / 2;
  const posY4 = 194 + 33 / 2;
  const duoVictories = await Image.renderText(
    boldFont,
    24,
    player.duoVictories.toLocaleString(),
    0xffffffff
  );
  canvas.composite(
    duoVictories,
    posX4 - duoVictories.width / 2,
    posY4 - duoVictories.height / 2
  );

  // SOLO VICTORIES
  const posX5 = 715 + 247 / 2;
  const posY5 = 290 + 33 / 2;
  const soloVictories = await Image.renderText(
    boldFont,
    24,
    player.soloVictories.toLocaleString(),
    0xffffffff
  );
  canvas.composite(
    soloVictories,
    posX5 - soloVictories.width / 2,
    posY5 - soloVictories.height / 2
  );

  // BRAWLERS UNLOCKED
  const posX6 = 1020 + 258 / 2;
  const posY6 = 290 + 33 / 2;
  const brawlersUnlocked = await Image.renderText(
    boldFont,
    24,
    `${player.brawlers!.length}/78`,
    0xffffffff
  );
  canvas.composite(
    brawlersUnlocked,
    posX6 - brawlersUnlocked.width / 2,
    posY6 - brawlersUnlocked.height / 2
  );

  // CLUB
  if (player.club.name) {
    const posX7 = 1424 + 244 / 2;
    const posY7 = 134 + 189 / 2 - 123;
    const club = await Image.renderText(
      boldFont,
      40,
      player.club.name ?? 'No Club',
      0xbbbbbbbb
    );
    canvas.composite(club, posX7 - club.width / 2, posY7 - club.height / 2);

    // CLUB ICON
    const clubData = await client.api.clubs.get(player.club.tag);
    const icon = `https://cdn-old.brawlify.com/club/${clubData.badgeId}.png`;
    const fetchIcon = await fetch(icon).then((res) => res.arrayBuffer());
    const resizedIcon = await sharp(Buffer.from(fetchIcon))
      .resize(150, 168)
      .toBuffer();
    const clubIcon = await Image.decode(resizedIcon);
    canvas.composite(clubIcon, posX7 - clubIcon.width / 2, 154);
  }

  const chunkBrawlers = chunk(
    player
      .brawlers!.sort((a, b) => b.rank - a.rank)
      .map((brawler) => {
        const b = getBrawler(brawler.id)!;
        return { ...brawler, name: b.name };
      }),
    13
  );
  for (let i = 0; i < chunkBrawlers.length; i++) {
    const brawlers = chunkBrawlers[i]!;
    for (let j = 0; j < brawlers.length; j++) {
      const brawler = brawlers[j]!;
      const name = brawler.name.replace(/ /g, '-');
      const buffer = await readFile(
        join(process.cwd(), 'assets', 'images', 'brawlers', `${name}.png`)
      );
      const resizedBrawler = await sharp(Buffer.from(buffer))
        .resize(120, 120)
        .toBuffer();
      const brawlerImage = await Image.decode(resizedBrawler);
      canvas.composite(brawlerImage, 50 + j * 142, 340 + i * 122);

      const rankBuffer = await readFile(
        join(process.cwd(), 'assets', 'images', 'ranks', `${brawler.rank}.png`)
      );
      const resizedRank = await sharp(Buffer.from(rankBuffer))
        .resize(44, 50)
        .toBuffer();
      const rankImage = await Image.decode(resizedRank);
      canvas.composite(rankImage, 50 + j * 142, 340 + i * 122);
    }
  }

  // WATERMARK
  const watermark = await Image.renderText(
    boldFont,
    24,
    '@8-Bot#7291',
    0xcacacaca
  );
  canvas.composite(watermark, canvas.width / 2 - watermark.width / 2, 0);

  return Buffer.from(
    await canvas.encode(0.1, {
      author: '8-Bot#7291',
      title: 'Player Profile Image',
      creationTime: Date.now(),
    })
  );
}

function chunk(array: PlayerBrawler[], length: number): PlayerBrawler[][] {
  if (!(array instanceof Array)) return array;
  const final: PlayerBrawler[][] = [];
  let i = 0;
  for (const element of array) {
    if (!final[i]) final[i] = [];
    final[i]!.push(element);
    if (final[i]!.length >= length) ++i;
  }
  return final;
}

// interface Brawler {
//   name: string;
//   trophies: number;
//   imageUrl: string;
//   rank: number;
// }
