import { readFile } from 'fs/promises';
import { Image } from 'imagescript';
import { join } from 'path';
import { RankingsPlayer } from '../../package';
import { UsingClient } from 'seyfert';
import { getIcon } from '../functions';
import sharp from 'sharp';
import { CountryCodes } from '../constants';

const background = join(process.cwd(), 'assets', 'images', 'BG_1.png');

export async function makeTopImage(
  rankings: RankingsPlayer[],
  countryCode: string,
  client: UsingClient
) {
  const canvas = await Image.decode(await readFile(background));
  const boldFont = await readFile(
    join(process.cwd(), 'assets', 'fonts', 'LilitaOne-Regular.ttf')
  );

  // TITLE
  const t1 = 'Top'; // 0xffffffff
  const t2 = countryCode === 'global' ? 'Global' : CountryCodes[countryCode as keyof typeof CountryCodes]; // 0x007bffff
  const t3 = 'Players'; // 0xffffffff

  const title1 = await Image.renderText(boldFont, 72, t1, 0xffffffff);
  const title2 = await Image.renderText(boldFont, 72, t2, 0x007bffff);
  const title3 = await Image.renderText(boldFont, 72, t3, 0xffffffff);

  canvas.composite(title1, 50, 30);
  canvas.composite(title2, 60 + title1.width, 30);
  canvas.composite(title3, 70 + title1.width + title2.width, 30);

  // Τitles

  // Level
  const levelTitle = 'Level';
  const levelTitleText = await Image.renderText(
    boldFont,
    36,
    levelTitle,
    0xbbbbbbbb
  );
  canvas.composite(
    levelTitleText,
    canvas.width / 2 - levelTitleText.width / 2,
    100
  );

  // Trophies
  const trophiesTitle = 'Trophies';
  const trophiesTitleText = await Image.renderText(
    boldFont,
    36,
    trophiesTitle,
    0xbbbbbbbb
  );
  canvas.composite(
    trophiesTitleText,
    canvas.width - trophiesTitleText.width - 50,
    100
  );
  // Club
  const clubTitle = 'Club';
  const clubTitleText = await Image.renderText(
    boldFont,
    36,
    clubTitle,
    0xbbbbbbbb
  );
  canvas.composite(
    clubTitleText,

    canvas.width / 2 +
      levelTitleText.width / 2 +
      (canvas.width -
        trophiesTitleText.width -
        50 -
        (canvas.width / 2 + levelTitleText.width / 2)) /
        2 -
      clubTitleText.width / 2,
    100
  );

  // PLAYERS
  for (let i = 0; i < rankings.length; i++) {
    const user = rankings[i]!;
    const player = await client.api.players.get(user.tag);
    const playerIcon = await (
      await fetch(getIcon(player.icon.id)?.imageUrl!)
    ).arrayBuffer();
    const playerImage = await Image.decode(
      await sharp(Buffer.from(playerIcon)).resize(80, 80).toBuffer()
    );

    // RANK
    const rank = `#${i + 1}`;
    const rankText = await Image.renderText(boldFont, 36, rank, 0xffffffff);
    canvas.composite(
      rankText,
      50 - rankText.width / 2,
      165 + i * (playerImage.height + 10)
    );

    // ICON
    canvas.composite(
      playerImage,
      170 - playerImage.width / 2,
      150 + i * (playerImage.height + 10)
    );

    // NAME
    const name = player.name;
    const nameText = await Image.renderText(
      boldFont,
      36,
      name,
      parseInt(player.nameColor.replace('#', '') + 'ff')
    );
    canvas.composite(nameText, 250, 165 + i * (playerImage.height + 10));

    // TAG
    const tag = user.tag;
    const tagText = await Image.renderText(boldFont, 36, tag, 0xbbbbbbbb);
    canvas.composite(
      tagText,
      250 + nameText.width + 10,
      165 + i * (playerImage.height + 10)
    );

    // LEVEL
    const level = player.expLevel;
    const levelText = await Image.renderText(
      boldFont,
      36,
      level.toString(),
      0xffffffff
    );
    canvas.composite(
      levelText,
      canvas.width / 2 - levelText.width / 2,
      165 + i * (playerImage.height + 10)
    );

    // TROPHIES
    const trophies = player.trophies;
    const trophiesText = await Image.renderText(
      boldFont,
      36,
      trophies.toLocaleString(),
      0xffc107ff
    );
    canvas.composite(
      trophiesText,
      canvas.width - trophiesTitleText.width / 2 - trophiesText.width / 2 - 50,
      165 + i * (playerImage.height + 10)
    );

    if (player.club.name) {
      const club = player.club.name;
      const clubText = await Image.renderText(boldFont, 36, club, 0xffffffff);
      canvas.composite(
        clubText,
        canvas.width / 2 +
          levelTitleText.width / 2 +
          (canvas.width -
            trophiesTitleText.width -
            50 -
            (canvas.width / 2 + levelTitleText.width / 2)) /
            2 -
          clubText.width / 2,
        165 + i * (playerImage.height + 10)
      );
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
      title: 'Top Players',
      creationTime: Date.now(),
    })
  );
}
