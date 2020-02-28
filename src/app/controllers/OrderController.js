import * as Yup from 'yup';

import Order from '../models/order';
import Deliveryman from '../models/deliveryman';
import Recipient from '../models/recipient';

class OrderController {
  async index(req, res) {
    const order = await Order.findAll();

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!schema.isValid()) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { product, deliveryman_id, recipient_id } = req.body;

    const deliveryman = Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const recipient = Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const order = await Order.create({
      product,
      deliveryman_id,
      recipient_id,
    });
    return res.json(order);
  }
}

export default new OrderController();
