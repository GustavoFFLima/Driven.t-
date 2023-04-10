import { Response } from 'express';
import httpStatus from 'http-status';
import axios from 'axios';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';

interface ViaCEPResponse {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  const cep = req.query.cep as string;

  if (!cep) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const viaCEPUrl = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    const { data } = await axios.get<ViaCEPResponse>(viaCEPUrl);

    if (data.erro) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const { logradouro, complemento, bairro, localidade, uf } = data;

    return res.status(httpStatus.OK).json({
      logradouro,
      complemento,
      bairro,
      cidade: localidade,
      uf,
    });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
