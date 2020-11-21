const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { Plugin } = require('@vizality/entities');

module.exports = class OpenLinksInDiscord extends Plugin {
  onStart () {
    const Anchor = getModule(m => m.default && m.default.displayName === 'Anchor');

    patch('open-links-in-discord', Anchor, 'default', (_, res) => {
      res.props.oClick = res.props.onClick;
      res.props.onClick = (e) => {
        if (!e.shiftKey) {
          res.props.oClick(e);
          return;
        }

        e.preventDefault();

        const url = res.props.href;
        if (url) vizality.api.popups.openWindow({ url });

        return false;
      };

      return res;
    });
  }

  onStop () {
    unpatch('open-links-in-discord');
  }
};
