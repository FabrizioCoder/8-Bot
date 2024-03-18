import Icons from '../../assets/json/icons.json';
import Events from '../../assets/json/events.json';


function getIcon(id: number) {
  return Object.values(Icons).find((icon) => icon.id === id) ?? null;
}

export function getEvent(id: number) {
  return Object.values(Events).find((event) => event.slot.id === id) ?? null;
}

export { getIcon };
