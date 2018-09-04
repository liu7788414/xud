import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.ORDERBOOK;
const errorCodes = {
  UNSUPPORTED_PAIR: codesPrefix.concat('.1'),
  DUPLICATE_ORDER: codesPrefix.concat('.2'),
  ORDER_NOT_FOUND: codesPrefix.concat('.3'),
  UNSUPPORTED_CURRENCY: codesPrefix.concat('.4'),
  CURRENCY_CANNOT_BE_REMOVED: codesPrefix.concat('.5'),
  CURRENCY_ALREADY_SUPPORTED: codesPrefix.concat('.6'),
  PAIR_ALREADY_SUPPORTED: codesPrefix.concat('.7'),
};

const errors = {
  UNSUPPORTED_PAIR_ID: (pairId: string) => ({
    message: `trading pair ${pairId} is not supported`,
    code: errorCodes.UNSUPPORTED_PAIR,
  }),
  DUPLICATE_ORDER: (localId: string) => ({
    message: `order with localId ${localId} already exists`,
    code: errorCodes.DUPLICATE_ORDER,
  }),
  ORDER_NOT_FOUND: (orderId: string) => ({
    message: `order with id ${orderId} could not be found`,
    code: errorCodes.ORDER_NOT_FOUND,
  }),
  UNSUPPORTED_CURRENCY: (currency: string) => ({
    message: `currency ${currency} is not supported`,
    code: errorCodes.UNSUPPORTED_CURRENCY,
  }),
  CURRENCY_CANNOT_BE_REMOVED: (currency: string, pairId: string) => ({
    message: `currency ${currency} cannot be removed because it is used for ${pairId}`,
    code: errorCodes.CURRENCY_CANNOT_BE_REMOVED,
  }),
  CURRENCY_ALREADY_SUPPORTED: (currency: string) => ({
    message: `currency ${currency} is already supported`,
    code: errorCodes.CURRENCY_ALREADY_SUPPORTED,
  }),
  PAIR_ALREADY_SUPPORTED: (pair_id: string) => ({
    message: `trading pair ${pair_id} is already supported`,
    code: errorCodes.PAIR_ALREADY_SUPPORTED,
  }),
};

export { errorCodes };
export default errors;
