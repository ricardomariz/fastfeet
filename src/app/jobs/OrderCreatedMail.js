import Mail from '../../lib/Mail';

class OrderCreatedMail {
  get key() {
    return 'OrderCreatedMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    Mail.sendMail({
      to: `${deliveryman} <caiq_refl@hotmail.com>`,
      subject: 'Encomenda liberada',
      template: 'order',
      context: {
        deliveryman,
        recipient,
        product,
      },
    });
  }
}

export default new OrderCreatedMail();
