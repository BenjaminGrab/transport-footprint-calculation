import { NextFunction, Request, Response } from 'express';
import { describe } from 'node:test';
import * as calculationService from '../src/services/calculation.service';
import { AxiosResponse } from 'axios';
import footprintsData from '../mock-data/footprints.json';
import transportsData from '../mock-data/transports.json';
import { getFootprint } from '../src/controllers/calculation.controller';
import { NotFoundError } from '../src/errors/not-found.error';

describe('Calculation Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest
      .spyOn(calculationService, 'getFootprints')
      .mockResolvedValue({ data: footprintsData } as AxiosResponse);
    jest
      .spyOn(calculationService, 'getTransports')
      .mockResolvedValue({ data: transportsData } as AxiosResponse);
  });

  describe('getFootprint()', () => {
    it('should return a NotFoundError when the given footprint is not found', async () => {
      req = {
        body: {
          footprint: 'FAKE_FOOTPRINT',
          transport: 'TRUCK',
          targetCountry: 'DE'
        }
      };
      await getFootprint(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(
        new NotFoundError(
          `A footprint with the identifier FAKE_FOOTPRINT was not found.`
        )
      );
    });

    it('should return a NotFoundError when a matching footprint is found but no transport with the given targetCountry', async () => {
      req = {
        body: {
          footprint: 'STRAWBERRY_4713',
          transport: 'TRUCK',
          targetCountry: 'CH'
        }
      };
      await getFootprint(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(
        new NotFoundError(
          `A Transport with the identifier TRUCK, the targetCountry CH and the origin country IT was not found`
        )
      );
    });

    it('should return a result of 16.64 kgCO2e for given data', async () => {
      req = {
        body: {
          footprint: 'STRAWBERRY_4713',
          transport: 'TRUCK',
          targetCountry: 'DE'
        }
      };
      await getFootprint(req as Request, res as Response, next);
      expect(res.json).toHaveBeenCalledWith({ result: '16.64 kgCO2e' });
    });
  });
});
