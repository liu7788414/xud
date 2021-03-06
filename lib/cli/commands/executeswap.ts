import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest, SwapPayload } from '../../proto/xudrpc_pb';

export const command = 'executeSwap <role> <sending_amount> <sending_token> <receiving_amount> <receiving_token> <node_pub_key>';

export const describe = 'execute an atomic swap';

export const builder = {
  sending_amount: {
    type: 'number',
  },
  receiving_amount: {
    type: 'number',
  },
};

/*function callHandler(xuClient: XUClient, argv: Arguments) {
  const payload = {
    role: argv.role,
    sending_amount: argv.sending_amount,
    sending_token: argv.sending_token,
    receiving_amount: argv.receiving_amount,
    receiving_token: argv.receiving_token,
  };
  return xuClient.tokenSwap(argv.target_address, payload, argv.identifier);
}*/

export const handler = (argv: Arguments) => {
  const request = new ExecuteSwapRequest();
  request.setTargetAddress = argv.target_address;

  const payload = new SwapPayload();
  payload.setSendingAmount(argv.sending_amount);
  payload.setSendingToken(argv.sending_token);
  payload.setReceivingAmount(argv.receiving_amount);
  payload.setReceivingToken(argv.receiving_token);
  payload.setNodePubKey(argv.node_pub_key);
  payload.setRole(argv.role);
  request.setPayload(payload);

  loadXudClient(argv).executeSwap(request, callback);
};
