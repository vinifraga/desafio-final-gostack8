import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const {
      mailData: {
        organizerName,
        organizerEmail,
        meetupTitle,
        userName,
        userEmail,
      },
    } = data;

    Mail.sendMail({
      to: `${organizerName} <${organizerEmail}>`,
      subject: 'Someone subscribed to one of your meetups!',
      template: 'subscription',
      context: {
        organizerName,
        userName,
        userEmail,
        meetupTitle,
      },
    });
  }
}

export default new SubscriptionMail();
