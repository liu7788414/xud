import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { AddCurrencyRequest } from '../../proto/xudrpc_pb';
import { NetworkClients } from '../../types/enums';

export const command = 'addcurrency <currency> <network_client> [token_address] [subunits]';

export const describe = 'add a supported currency';

export const builder = {
  currency: {
    description: 'The ticker symbol for the currency',
    type: 'string',
  },
  network_client: {
    description: 'The payment channel network client',
    type: 'string',
    choices: ['LND', 'RAIDEN'],
  },
  token_address: {
    description: 'The contract address for layered tokens such as ERC20',
    type: 'string',
  },
  subunits: {
    description: 'The number of subunits (e.g. satoshis) per unit',
    default: 100000000,
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
  const request = new AddCurrencyRequest();
  request.setCurrency(argv.currency.toUpperCase());
  request.setNetworkClient(Number(NetworkClients[argv.network_client]));
  request.setTokenAddress(argv.token_address);
  request.setSubunits(argv.subunits);
  loadXudClient(argv).addCurrency(request, callback);
};
