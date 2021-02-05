import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Plugin } from '@vizality/entities';

export default class extends Plugin {
  start () {
    const Anchor = getModule(m => m.default?.displayName === 'Anchor');
    patch('open-links-in-discord', Anchor, 'default', (_, res) => {
      const ogOnClick = res.props.onClick;
      res.props.onClick = e => {
        if (!e.shiftKey) return ogOnClick(e);
        e.preventDefault();
        const url = res.props.href;
        if (url) vizality.api.popups.openPopup({ url });
        return false;
      };
      return res;
    });
  }

  stop () {
    unpatch('open-links-in-discord');
  }
}
