import axios, { AxiosResponse } from 'axios';
import { Footprint } from '../models/footprint.model';
import { Transport } from '../models/transport.model';
import { CalculationDto } from '../dto/calculation.dto';
import { NotFoundError } from '../errors/not-found.error';

export const getFootprints = (): Promise<AxiosResponse<Footprint[]>> => {
  return axios.get('https://frankvisuals.github.io/co2-data/footprints.json');
};

export const getTransports = (): Promise<AxiosResponse<Transport[]>> => {
  return axios.get('https://frankvisuals.github.io/co2-data/transport.json');
};

const findFootprint = async (footprintId: string) => {
  const footprints = await getFootprints();
  const selectedFootprint = footprints.data.find(
    (item) => item.identifier === footprintId
  );

  if (!selectedFootprint) {
    throw new NotFoundError(
      `A footprint with the identifier ${footprintId} was not found.`
    );
  }
  return selectedFootprint;
};

const findTransport = async (
  transportId: string,
  targetCountry: string,
  originCountry: string
) => {
  const transports = await getTransports();
  const selectedTransport = transports.data.find(
    (item) =>
      item.identifier === transportId &&
      item.target_country === targetCountry &&
      item.origin_country === originCountry
  );

  if (!selectedTransport) {
    throw new NotFoundError(
      `A Transport with the identifier ${transportId}, the targetCountry ${targetCountry} and the origin country ${originCountry} was not found`
    );
  }
  return selectedTransport;
};

const formatFootprint = (value: number, factor: number, unit: string) => {
  return `${value * factor} ${unit}`;
};

export const calculateFootprint = async (dto: CalculationDto) => {
  const footprint = await findFootprint(dto.footprint);
  const transport = await findTransport(
    dto.transport,
    dto.targetCountry,
    footprint.country
  );
  return {
    result: formatFootprint(
      footprint.footprint_value,
      transport.factor,
      footprint.footprint_unit
    )
  };
};
