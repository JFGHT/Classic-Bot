export const newNotification = (title = 'Classic-bot', text = '') => new Notification(
  title, {
    body: text,
    icon: '/static/favicon.ico',
  },
);

export const isPermissionGranted = () => Notification.permission === 'granted';

export const requestPermission = () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return;
  }

  Notification.requestPermission().then((result) => {
    if (result === 'denied') {
      console.log('Permission wasn\'t granted. Allow a retry.');
      return;
    }
    if (result === 'default') {
      console.log('The permission request was dismissed.');
    }
    // Do something with the granted permission.
  });
};
