import Icons from '../../assets/json/icons.json';
import Events from '../../assets/json/events.json';

function getIcon(id: number) {
  return Object.values(Icons).find((icon) => icon.id === id) ?? null;
}

function getEvent(id: number) {
  return Object.values(Events).find((event) => event.slot.id === id) ?? null;
}

function capitalizeString(str: string) {
  const strLowerCase = str.toLowerCase();
  if (strLowerCase == null || strLowerCase.length <= 1) return strLowerCase;
  return strLowerCase.substring(0, 1).toUpperCase() + strLowerCase.substring(1);
}

export { getIcon, getEvent, capitalizeString };
