import * as Yup from 'yup';

import Deliveryman from '../models/deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails...' });
    }

    const emailExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const { name, email, password } = req.body;

    const deliveryman = await Deliveryman.create({
      name,
      email,
      password,
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails...' });
    }

    const { email, oldPassword } = req.body;

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found.' });
    }

    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({ where: email });

      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (oldPassword && !(await deliveryman.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'This deliveryman does not exist' });
    }

    await deliveryman.destroy();

    return res.json({ msg: 'Deliveryman deleted' });
  }
}

export default new DeliverymanController();
