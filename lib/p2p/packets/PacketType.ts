enum PacketType {
  HELLO = 'HELLO',
  PING = 'PING',
  PONG = 'PONG',
  ORDER = 'ORDER',
  ORDER_INVALIDATION = 'ORDER_INVALIDATION',
  GET_ORDERS = 'GET_ORDERS',
  ORDERS = 'ORDERS',
  GET_NODES = 'GET_NODES',
  NODES = 'NODES',
  DEAL_REQUEST = 'DEAL_REQUEST',
  DEAL_RESPONSE = 'DEAL_RESPONSE',
  SWAP_REQUEST = 'SWAP_REQUEST',
  SWAP_RESPONSE = 'SWAP_RESPONSE',
}

export default PacketType;
