import * as Yup from 'yup';

import Order from '../models/order';
import Deliveryman from '../models/deliveryman';
import Recipient from '../models/recipient';

import OrderCreatedMail from '../jobs/OrderCreatedMail';
import Queue from '../../lib/Queue';

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

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const order = await Order.create({
      product,
      deliveryman_id,
      recipient_id,
    });

    await Queue.add(OrderCreatedMail.key, {
      deliveryman: deliveryman.name,
      recipient: recipient.street,
      product,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      signature_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist.' });
    }

    const { product, deliveryman_id, recipient_id } = req.body;

    if (deliveryman_id && deliveryman_id !== order.deliveryman_id) {
      const newDeliveryman = await Deliveryman.findByPk(deliveryman_id);
      if (!newDeliveryman) {
        return res.status(400).json({ error: 'Deliveryman does not exist' });
      }
    }

    if (recipient_id && recipient_id !== order.recipient_id) {
      const newRecipient = await Recipient.findByPk(recipient_id);
      if (!newRecipient) {
        return res.status(400).json({ error: 'Recipient does not exist' });
      }
    }

    await order.update(req.body);

    return res.json({ product, deliveryman_id, recipient_id });
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    await order.destroy();

    return res.json({ msg: 'Order deleted' });
  }
}

export default new OrderController();
