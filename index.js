import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Plugin } from '@vizality/entities';

export default class OpenLinksInDiscord extends Plugin {
  start () {
    const Anchor = getModule(m => m.default?.displayName === 'Anchor');

    patch('open-links-in-discord', Anchor, 'default', (_, res) => {
      res.props.oClick = res.props.onClick;
      res.props.onClick = e => {
        if (!e.shiftKey) {
          res.props.oClick(e);
          return;
        }

        e.preventDefault();

        const url = res.props.href;

        if (url) {
          vizality.api.windows.openWindow({ url });
        }

        return false;
      };

      return res;
    });
  }

  stop () {
    unpatch('open-links-in-discord');
  }
}
