import { readFile } from 'fs/promises';
import { Image } from 'imagescript';
import { PlayerBrawler } from '../../package';
import { getBrawler } from '../functions';
import { join } from 'path';
import sharp from 'sharp';

export async function makeBrawlerImage(brawler: PlayerBrawler) {
  const bw = getBrawler(brawler.id)!;

  const boldFont = await readFile(
    join(process.cwd(), 'assets', 'fonts', 'LilitaOne-Regular.ttf')
  );
  const rankBuffer = await readFile(
    join(process.cwd(), 'assets', 'images', 'ranks', `${brawler.rank}.png`)
  );
  const trophyBuffer = await readFile(
    join(process.cwd(), 'assets', 'images', 'others', 'trophy.png')
  );
  const levelBuffer = await readFile(
    join(process.cwd(), 'assets', 'images', 'others', 'PowerPoint.png')
  );

  const canvas = new Image(700, 400);
  canvas.fill(rarityColors[bw.rarity.id]!);

  const icon = await fetch(
    `https://cdn.brawlstats.com/character-arts/${bw.id}.png`
  ).then((res) => res.arrayBuffer());
  const resizedIcon = await sharp(Buffer.from(icon))
    .resize(265, 265, { fit: 'outside' })
    .toBuffer();
  const iconImage = await Image.decode(resizedIcon);
  canvas.composite(iconImage, 0, 0);

  const name = await Image.renderText(boldFont, 48, brawler.name, 0xffffffff);
  canvas.drawBox(700 - name.width - 50, 0, name.width + 60, 70, 0x000000ff);

  const posX = 700 - name.width / 2 - 10;
  const posY = 35;
  canvas.composite(name, posX - name.width / 2, posY - name.height / 2);

  const rankImage = await Image.decode(
    await sharp(rankBuffer).resize(60, 60, { fit: 'outside' }).toBuffer()
  );
  canvas.composite(
    rankImage,
    posX - name.width / 2 - rankImage.width - 10,
    posY - rankImage.height / 2
  );

  canvas.drawBox(0, 265, 705, 200, 0x000000ff);

  const levelImage = await Image.decode(
    await sharp(levelBuffer).resize(50, 50, { fit: 'outside' }).toBuffer()
  );
  const textLevelTitle = await Image.renderText(
    boldFont,
    48,
    'Level',
    0xbbbbbbff
  );
  canvas.composite(textLevelTitle, 50, 250 + textLevelTitle.height / 2);
  canvas.composite(levelImage, 50, 300 + levelImage.height / 2);
  const textLevel = await Image.renderText(
    boldFont,
    48,
    brawler.power.toString(),
    0xffffffff
  );
  canvas.composite(textLevel, 120, 295 + textLevel.height / 2);

  const trophyImage = await Image.decode(
    await sharp(trophyBuffer).resize(50, 50, { fit: 'outside' }).toBuffer()
  );

  canvas.composite(trophyImage, 250, 300 + trophyImage.height / 2);
  const textCurrentTrophyTitle = await Image.renderText(
    boldFont,
    48,
    'Current',
    0xbbbbbbff
  );
  canvas.composite(
    textCurrentTrophyTitle,
    250,
    250 + textCurrentTrophyTitle.height / 2
  );
  const textCurrentTrophy = await Image.renderText(
    boldFont,
    48,
    brawler.trophies.toString(),
    0xffffffff
  );
  canvas.composite(textCurrentTrophy, 320, 295 + textCurrentTrophy.height / 2);

  canvas.composite(trophyImage, 490, 300 + trophyImage.height / 2);
  const textHighestTrophyTitle = await Image.renderText(
    boldFont,
    48,
    'Highest',
    0xbbbbbbff
  );
  canvas.composite(
    textHighestTrophyTitle,
    490,
    250 + textHighestTrophyTitle.height / 2
  );
  const textHighestTrophy = await Image.renderText(
    boldFont,
    48,
    brawler.highestTrophies.toString(),
    0xffffffff
  );
  canvas.composite(textHighestTrophy, 560, 295 + textHighestTrophy.height / 2);

  const watermark = await Image.renderText(
    boldFont,
    14,
    '@8-Bot#7291',
    0xcacacaca
  );
  canvas.composite(
    watermark,
    700 / 2 - watermark.width / 2,
    400 - watermark.height - 5
  );

  return Buffer.from(
    await canvas.encode(0.1, {
      author: '8-Bot#7291',
      title: 'Brawler Profile Image',
      creationTime: Date.now(),
    })
  );
}

const rarityColors: { [key: number]: number } = {
  1: 0xb9eaffff,
  2: 0x68fd58ff,
  3: 0x5ab3ffff,
  4: 0xd850ffff,
  5: 0xfe5e72ff,
  6: 0xfff11eff,
};
