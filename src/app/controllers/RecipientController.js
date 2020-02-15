import * as Yup from 'yup';

import Recipient from '../models/recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      cep: Yup.string()
        .required()
        .min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails...' });
    }

    const {
      name,
      number,
      complement,
      city,
      state,
      cep,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      number,
      complement,
      city,
      state,
      cep,
    });
  }
}

export default new RecipientController();
