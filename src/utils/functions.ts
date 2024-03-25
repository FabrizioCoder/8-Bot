import Icons from '../../assets/json/icons.json';
import Events from '../../assets/json/events.json';
import Emojis from '../../assets/json/emojis.json';
import Brawlers from '../../assets/json/brawlers.json';

function getIcon(id: number) {
  return Object.values(Icons).find((icon) => icon.id === id) ?? null;
}

function getBrawler(id: number) {
  return Object.values(Brawlers).find((brawler) => brawler.id === id) ?? null;
}

function getEvent(id: number) {
  return Object.values(Events).find((event) => event.slot.id === id) ?? null;
}

function capitalizeString(str: string) {
  const strLowerCase = str.toLowerCase();
  if (strLowerCase == null || strLowerCase.length <= 1) return strLowerCase;
  return strLowerCase.substring(0, 1).toUpperCase() + strLowerCase.substring(1);
}

function rawEmote(name: string): string | null {
  const flattenedEmotes = Emojis.flat();
  const emote = flattenedEmotes.find(
    (x: { name: string }) => x && x.name === name
  );

  return emote ? `<:${emote.name}:${emote.id}>` : null;
}

export { getIcon, getBrawler, getEvent, capitalizeString, rawEmote };
