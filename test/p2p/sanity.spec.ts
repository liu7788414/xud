import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import DB from '../../lib/db/DB';
import Logger, { Level } from '../../lib/Logger';
import Config from '../../lib/Config';
import { getUri } from '../../lib/utils/utils';

chai.use(chaiAsPromised);

const createConfig = (instanceId: number, p2pPort: number, config: Config) => ({
  instanceId,
  logLevel: 'warn',
  logPath: '',
  p2p: {
    listen: true,
    port: p2pPort,
    addresses: [`localhost:${p2pPort}`],
  },
  rpc: {
    disable: true,
  },
  lndbtc: {
    disable: true,
  },
  lndltc: {
    disable: true,
  },
  raiden: {
    disable: true,
  },
  db: {
    database: `${config.testDb.database}_${instanceId}`,
  },
});

describe('P2P Sanity Tests', () => {
  let nodeOneConfig: any;
  let nodeOne: Xud;
  let nodeOneUri: string;
  let nodeTwoConfig: any;
  let nodeTwo: Xud;
  let nodeTwoUri: string;

  before(async () => {
    const config = new Config().load();
    nodeOneConfig = createConfig(1, 9001, config);
    nodeTwoConfig = createConfig(2, 9002, config);
    const loggers = Logger.createLoggers(Level.WARN);

    // make sure the nodes table is empty
    const dbOne = new DB({ ...config.testDb, ...nodeOneConfig.db }, loggers.db);
    const dbTwo = new DB({ ...config.testDb, ...nodeTwoConfig.db }, loggers.db);
    await Promise.all([dbOne.init(), dbTwo.init()]);
    await Promise.all([dbOne.models.Node.truncate(), dbTwo.models.Node.truncate()]);
    await Promise.all([dbOne.close(), dbTwo.close()]);

    nodeOne = new Xud();
    nodeTwo = new Xud();

    await Promise.all([nodeOne.start(nodeOneConfig), nodeTwo.start(nodeTwoConfig)]);

    await nodeOne['db'].models.Node.truncate();

    nodeOneUri = getUri({ nodePubKey: nodeOne.nodePubKey, host: 'localhost', port: nodeOneConfig.p2p.port });
    nodeTwoUri = getUri({ nodePubKey: nodeTwo.nodePubKey, host: 'localhost', port: nodeTwoConfig.p2p.port });
  });

  it('should connect successfully', async () => {
    await nodeOne.service.connect({ nodeUri: nodeTwoUri });
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(1);
    expect(listPeersResult[0].nodePubKey).to.be.equal(nodeTwo.nodePubKey);
  });

  it('should fail connecting to the same node', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri }))
    .to.be.rejectedWith('already connected');
  });

  it('should disconnect successfully', async () => {
    const result = await nodeOne.service.disconnect({ nodePubKey: nodeTwo.nodePubKey });
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(0);
  });

  it('should fail when connecting to an unexpected node pub key', async () => {
    const connectPromise = nodeOne.service.connect({ nodeUri: getUri({
      nodePubKey: 'thewrongpubkey',
      host: 'localhost',
      port: nodeTwoConfig.p2p.port,
    }) });
    await expect(connectPromise).to.be.rejectedWith(
      `node at localhost:${nodeTwoConfig.p2p.port} sent pub key ${nodeTwo.nodePubKey}, expected thewrongpubkey`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(0);
  });

  it('should fail when connecting to self', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeOneUri }))
    .to.be.rejectedWith('cannot attempt connection to self');
  });

  it('should fail connecting to a non-existing node', async () => {
    const connectPromise = nodeOne.service.connect({ nodeUri: getUri({ nodePubKey: 'notarealnodepubkey', host: 'localhost', port: 9003 }) });
    await expect(connectPromise).to.be.rejectedWith('could not connect to peer at localhost:9003');
  });

  after(async () => {
    await Promise.all([nodeOne['db'].models.Node.truncate(), nodeTwo['db'].models.Node.truncate()]);
    await Promise.all([nodeOne['shutdown'](), nodeTwo['shutdown']()]);
  });
});
