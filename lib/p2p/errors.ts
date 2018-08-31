import errorCodesPrefix from '../constants/errorCodesPrefix';
import addressUtils from '../utils/addressUtils';
import { Address } from '../types/global';

const codesPrefix = errorCodesPrefix.P2P;
const errorCodes = {
  NODE_ALREADY_CONNECTED: codesPrefix.concat('.1'),
  NOT_CONNECTED: codesPrefix.concat('.2'),
  UNEXPECTED_NODE_PUB_KEY: codesPrefix.concat('.3'),
  ATTEMPTED_CONNECTION_TO_SELF: codesPrefix.concat('.4'),
  EXTERNAL_IP_UNRETRIEVABLE: codesPrefix.concat('.5'),
  COULD_NOT_CONNECT: codesPrefix.concat('.6'),
  CONNECTION_TIMED_OUT: codesPrefix.concat('.7'),
};

const errors = {
  NODE_ALREADY_CONNECTED: (nodePubKey: string, address: Address) => ({
    message: `Node ${nodePubKey} at ${addressUtils.toString(address)} already connected`,
    code: errorCodes.NODE_ALREADY_CONNECTED,
  }),
  NOT_CONNECTED: (nodePubKey: string) => ({
    message: `node (${nodePubKey}) is not connected`,
    code: errorCodes.NOT_CONNECTED,
  }),
  UNEXPECTED_NODE_PUB_KEY: (nodePubKey: string, expectedNodePubKey: string, address: string) => ({
    message: `node at ${address} sent pub key ${nodePubKey}, expected ${expectedNodePubKey}`,
    code: errorCodes.UNEXPECTED_NODE_PUB_KEY,
  }),
  ATTEMPTED_CONNECTION_TO_SELF: {
    message: 'cannot attempt connection to self',
    code: errorCodes.ATTEMPTED_CONNECTION_TO_SELF,
  },
  EXTERNAL_IP_UNRETRIEVABLE: (err: Error) => ({
    message: `could not retrieve external IP: ${err.message}`,
    code: errorCodes.EXTERNAL_IP_UNRETRIEVABLE,
  }),
  COULD_NOT_CONNECT: (address: Address, err: Error) => ({
    message: `could not connect to peer at ${addressUtils.toString(address)}: ${err.message}`,
    code: errorCodes.COULD_NOT_CONNECT,
  }),
  CONNECTION_TIMED_OUT: (address: Address) => ({
    message: `connection to peer at ${addressUtils.toString(address)} timed out`,
    code: errorCodes.CONNECTION_TIMED_OUT,
  }),
};

export { errorCodes };
export default errors;
