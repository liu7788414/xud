import { NetworkClients } from './enums';

type MarketOrder = {
  /** The number of base currency tokens for the order. */
  quantity: number;
  /** A trading pair symbol with the base currency first followed by a '/' separator and the quote currency */
  pairId: string;
};

/** A limit order with a specified price. */
type Order = MarketOrder & {
  /** The price for the order expressed in units of the quote currency. */
  price: number;
};

type Local = {
  /** A local identifier for the order. */
  localId: string;
};

type Remote = {
  /** The nodePubKey of the node which created this order. */
  peerPubKey: string;
};

type Stamp = {
  /** The global identifier for this order on the XU network. */
  id: string;
  /** Epoch timestamp when this order was created. */
  createdAt: number;
};

export type OwnMarketOrder = MarketOrder & Local;

export type OwnOrder = Order & Local;

export type StampedOwnOrder = OwnOrder & Stamp;

export type StampedPeerOrder = Order & Remote & Stamp;

export type StampedOrder = StampedOwnOrder | StampedPeerOrder;

/** An outgoing version of a local order without the localId and createdAt timestamp */
export type OutgoingOrder = Pick<StampedOwnOrder, Exclude<keyof StampedOwnOrder, 'localId' | 'createdAt'>>;

export type OrderIdentifier = {
  orderId: string;
  pairId: string;
  quantity?: number;
};

export type Currency = {
  /** The ticker symbol for this currency such as BTC, LTC, ETH, etc... */
  id: string;
  /* The payment channel network client to use for executing swaps. */
  networkClient: NetworkClients;
  /** The contract address for layered tokens such as ERC20. */
  tokenAddress?: string;
  /** The number of subunits (e.g. satoshis) per unit (e.g. bitcoin), if different from the 100000000:1 ratio used by BTC, LTC, and others. */
  subunits?: number;
};

export type Pair = {
  /* The base currency that is bought and sold for this trading pair. */
  baseCurrency: string;
  /* The currency used to quote a price for the base currency. */
  quoteCurrency: string;
};

export function isOwnOrder(order: StampedOrder): order is StampedOwnOrder {
  return (order as StampedPeerOrder).peerPubKey === undefined && typeof (order as StampedOwnOrder).localId === 'string';
}

export function isPeerOrder(order: StampedOrder): order is StampedPeerOrder {
  return (order as StampedOwnOrder).localId === undefined && typeof (order as StampedPeerOrder).peerPubKey === 'string';
}
